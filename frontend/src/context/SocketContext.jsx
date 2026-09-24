import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import API from '../services/api';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Fetch persisted notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      const list = Array.isArray(res.data) ? res.data : [];
      setNotifications(list);
      const unread = list.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const token = localStorage.getItem('token');
      const newSocket = io('http://localhost:5000', {
        auth: { token },
      });

      newSocket.on('connect', () => {
        console.log('🔌 Socket connected');
      });

      newSocket.on('NEW_ANNOUNCEMENT', (data) => {
        setNotifications((prev) => [
          { ...data, type: 'announcement', createdAt: new Date(), isRead: false },
          ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on('NEW_EVENT', (data) => {
        setNotifications((prev) => [
          { ...data, type: 'event', createdAt: new Date(), isRead: false },
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
          { ...data, type: 'discussion_reply', createdAt: new Date(), isRead: false },
          ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const clearUnread = () => markAllAsRead();

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        clearUnread,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        setNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
