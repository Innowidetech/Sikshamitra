const socketIo = require('socket.io');

let io = null;

exports.initSocket = (server) => {
  io = socketIo(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;

    if (userId) {
      socket.join(`user_${userId}`);
    }

    socket.on('joinMeeting', ({ meetingLink }) => {
      socket.join(`meeting_${meetingLink}`);
    });

    socket.on('leaveMeeting', ({ meetingLink }) => {
      socket.leave(`meeting_${meetingLink}`);
    });

    socket.on('signal', (data) => {
      io.to(`meeting_${data.meetingLink}`).emit('signal', data);
    });
  });
};

// Expose limited io for controllers
exports.io = {
  to: (room) => io.to(room),
  emit: (...args) => io.emit(...args),
};
