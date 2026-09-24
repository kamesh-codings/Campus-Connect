import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      const newSocket = io('http://localhost:5000', {
        auth: { token },
      });

      newSocket.on('connect', () => {
        console.log('🔌 Socket connected');
      });

      newSocket.on('NEW_ANNOUNCEMENT', (data) => {
        setNotifications((prev) => [
          { ...data, type: 'announcement', createdAt: new Date() },
          ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on('NEW_EVENT', (data) => {
        setNotifications((prev) => [
          { ...data, type: 'event', createdAt: new Date() },
          ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on('USER_NOTIFICATION', (data) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on('DISCUSSION_REPLY', (data) => {
        setNotifications((prev) => [
          { ...data, type: 'discussion_reply', createdAt: new Date() },
          ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const clearUnread = () => setUnreadCount(0);

  return (
    <SocketContext.Provider
      value={{ socket, notifications, unreadCount, clearUnread, setNotifications }}
    >
      {children}
    </SocketContext.Provider>
  );
};
