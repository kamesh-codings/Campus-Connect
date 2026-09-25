const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocket = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.user.role})`);

    // Auto-join the global campus room
    socket.join('campus_all');

    // Join user-specific room for targeted notifications
    socket.join(`user_${socket.user._id}`);

    // Join club rooms for club-specific updates
    if (socket.user.joinedClubs && socket.user.joinedClubs.length > 0) {
      socket.user.joinedClubs.forEach((clubId) => {
        socket.join(`club_${clubId}`);
      });
    }

    // Handle joining discussion rooms
    socket.on('join_discussion', (discussionId) => {
      socket.join(`discussion_${discussionId}`);
      console.log(`${socket.user.name} joined discussion room: ${discussionId}`);
    });

    // Handle leaving discussion rooms
    socket.on('leave_discussion', (discussionId) => {
      socket.leave(`discussion_${discussionId}`);
    });

    // Handle joining club rooms
    socket.on('join_club_room', (clubId) => {
      socket.join(`club_${clubId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

module.exports = setupSocket;
