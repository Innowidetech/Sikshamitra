const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
require('dotenv').config();

const Connect = require('../models/Connect');
const OnlineLectures = require('../models/OnlineLectures');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const School = require('../models/School');

let io;

const userSockets = new Map();

function parseMeetingDateTime(dateObj, timeStr) {
  const dateOnly = dayjs(dateObj).format('YYYY-MM-DD');
  return dayjs(`${dateOnly} ${timeStr}`, 'YYYY-MM-DD hh:mm A').toDate();
}

function getMeetingStatus(doc) {
  const now = new Date();
  const start = parseMeetingDateTime(doc.startDate, doc.startTime);
  const end = parseMeetingDateTime(doc.endDate, doc.endTime);
  if (now < start) return 'Not Started';
  if (now > end) return 'Expired';
  return 'Live';
}

function addUserSocket(userId, socketId) {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socketId);
}

function getUserSocketIds(userId) {
  return userSockets.has(userId) ? Array.from(userSockets.get(userId)) : [];
}

exports.initSocket = (server) => {
  io = socketIo(server, { cors: { origin: '*' } });

  function emitParticipants(meetingLink) {
    const roomSockets = Array.from(io.sockets.adapter.rooms.get(`meeting_${meetingLink}`) || []);
    const participantIds = roomSockets.map(sid => io.sockets.sockets.get(sid)?.user?.id);
    io.in(`meeting_${meetingLink}`).emit('participants', {
      meetingLink,
      participants: participantIds
    });
  }

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error('User not found'));

      let fullUser = null;

      switch (user.role) {
        case 'superadmin': {
          fullUser = { id: user._id.toString(), name: 'Super Admin', role: user.role };
          break;
        }
        case 'admin': {
          const school = await School.findOne({ userId: user._id })
          if (!school) return next(new Error('School Admin not found'));
          fullUser = { id: user._id.toString(), name: school.principalName, role: user.role }
          break;
        }
        case 'teacher': {
          const teacher = await Teacher.findOne({ userId: user._id });
          if (!teacher) return next(new Error('Teacher not found'));
          fullUser = { id: teacher._id.toString(), name: teacher.profile.fullname, role: user.role };
          break;
        }
        case 'student': {
          const student = await Student.findOne({ userId: user._id });
          if (!student) return next(new Error('Student not found'));
          fullUser = { id: student._id.toString(), name: student.studentProfile.fullname, role: user.role };
          break;
        }
        case 'parent': {
          const parent = await Parent.findOne({ userId: user._id });
          if (!parent) return next(new Error('Parent not found'));
          const name = parent.parentProfile.fatherName || parent.parentProfile.motherName;
          fullUser = { id: parent._id.toString(), name, role: user.role };
          break;
        }
        default:
          return next(new Error('Invalid role'));
      }

      socket.user = fullUser;
      next();
    } catch (err) {

      return next(new Error('Authentication error'));
    }
  });


  // SOCKET CONNECTION HANDLING
  io.on('connection', (socket) => {

    addUserSocket(socket.user.id, socket.id);

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
    socket.join(`user_${socket.user.id}`);

    socket.meetings = {};

    socket.on('requestJoin', async ({ meetingLink }) => {
      try {
        if (socket.user.name !== 'Super Admin') console.log(`[requestJoin] User ${socket.user?.name} requested to join meeting: ${meetingLink}`);

        if (!socket.user || !socket.user.id) {
          return socket.emit('joinResponse', { meetingLink, success: false, message: 'Unauthorized.' });
        }

        const doc = await Connect.findOne({ meetingLink }) || await OnlineLectures.findOne({ meetingLink });
        if (!doc) {
          return socket.emit('joinResponse', { meetingLink, success: false, message: 'Meeting not found.' });
        }

        const status = getMeetingStatus(doc);
        console.log(`[requestJoin] Meeting status: ${status}`);

        if (status !== 'Live') {
          return socket.emit('joinResponse', { meetingLink, success: false, message: status });
        }

        const attendants = Array.isArray(doc.connect) ? doc.connect : [];
        const isInvited = attendants.some(c => c.attendant.toString() === socket.user.id) || doc.createdBy.toString() === socket.user.id;
        if (!isInvited) {
          console.log(`[requestJoin] User ${socket.user.id} not invited to meeting ${meetingLink}`);

          return socket.emit('joinResponse', { meetingLink, success: false, message: 'Not invited.' });
        }

        if (!socket.meetings) socket.meetings = {};

        if (socket.user.id === doc.createdBy.toString()) {
          socket.join(`meeting_${meetingLink}`);
          socket.emit('joinResponse', { meetingLink, success: true, message: 'Joined successfully.' });

          const roomSockets = io.sockets.adapter.rooms.get(`meeting_${meetingLink}`) || new Set();
          const participantIds = Array.from(roomSockets).map(sid => io.sockets.sockets.get(sid)?.user?.id);
          io.in(`meeting_${meetingLink}`).emit('participants', { meetingLink, participants: participantIds });
          return;
        }

        const creatorId = doc.createdBy.toString();
        socket.meetings[meetingLink] = { creatorId };
        io.to(`user_${creatorId}`).emit('joinRequest', {
          meetingLink,
          userId: socket.user.id,
          fullname: socket.user.name,
          role: socket.user.role
        });

        socket.emit('joinResponse', {
          meetingLink,
          success: true,
          message: 'Join request sent. Waiting for approval.'
        });
      } catch (err) {
        console.log('Error in requestJoin:', err);
        socket.emit('joinResponse', { meetingLink, success: false, message: 'Internal server error.' });
      }
    });


    socket.on('respondToJoin', async ({ meetingLink, userId, accept }) => {
      try {
        const meetingDoc = await Connect.findOne({ meetingLink }) || await OnlineLectures.findOne({ meetingLink });
        if (!meetingDoc || meetingDoc.createdBy.toString() !== socket.user.id) {
          console.warn(`Unauthorized respondToJoin attempt by ${socket.user.name}`);
          return;
        }

        if (accept) {
          const targetSocketIds = getUserSocketIds(userId);

          if (targetSocketIds.length > 0) {
            targetSocketIds.forEach(socketId => {
              const userSocket = io.sockets.sockets.get(socketId);
              if (userSocket) {
                userSocket.join(`meeting_${meetingLink}`);
                io.to(socketId).emit('joinAccepted', { meetingLink, by: socket.user.id });
              }
            });

            emitParticipants(meetingLink);
            console.log(`✅ ${socket.user.name} approved and joined meeting ${meetingLink}`);
          } else {
            console.log(`⚠️ No active sockets found for user ${userId} to approve join`);
          }
        } else {
          const targetSocketIds = getUserSocketIds(userId);
          targetSocketIds.forEach(socketId => {
            io.to(socketId).emit('joinDenied', { meetingLink, by: socket.user.id });
          });
        }
      } catch (err) {
        console.error('❌ Error in respondToJoin:', err);
      }
    });

    socket.on('joinAccepted', ({ meetingLink }) => {
      socket.join(`meeting_${meetingLink}`);
      socket.emit('joined', { meetingLink });

      emitParticipants(meetingLink);
    });

    socket.on('chatMessage', ({ meetingLink, message }) => {
      io.in(`meeting_${meetingLink}`).emit('chatMessage', {
        meetingLink,
        from: socket.user.id,
        name: socket.user.name,
        role: socket.user.role,
        message,
        timestamp: new Date()
      });
    });


    socket.on('signal', ({ meetingLink, type, data }) => {
      io.in(`meeting_${meetingLink}`).emit('signal', { from: socket.id, type, data });
    });


    socket.on('leaveMeeting', ({ meetingLink }) => {
      socket.leave(`meeting_${meetingLink}`);
      const roomSockets = Array.from(io.sockets.adapter.rooms.get(`meeting_${meetingLink}`) || []);
      const participantIds = roomSockets.map(sid => io.sockets.sockets.get(sid)?.user?.id);

      io.in(`meeting_${meetingLink}`).emit('participants', {
        meetingLink,
        participants: participantIds
      });
    });

    socket.on('endMeeting', async ({ meetingLink }) => {
      try {
        const meetingDoc = await Connect.findOne({ meetingLink }) || await OnlineLectures.findOne({ meetingLink });
        if (!meetingDoc) {
          return socket.emit('error', { message: 'Meeting not found.' });
        }

        if (meetingDoc.createdBy.toString() !== socket.user.id) {
          console.warn(`Unauthorized endMeeting attempt by ${socket.user.name}`);
          return socket.emit('error', { message: 'Unauthorized.' });
        }

        // await Connect.deleteOne({ meetingLink }) || await OnlineLectures.deleteOne({ meetingLink });

        // Notify all participants
        io.in(`meeting_${meetingLink}`).emit('meetingEnded', { meetingLink });

        // Disconnect all
        const roomSockets = io.sockets.adapter.rooms.get(`meeting_${meetingLink}`) || new Set();
        roomSockets.forEach(socketId => {
          const s = io.sockets.sockets.get(socketId);
          if (s) {
            s.leave(`meeting_${meetingLink}`);
            s.emit('leftMeeting', { meetingLink, reason: 'Meeting ended by host.' });
          }
        });

        console.log(`Meeting ${meetingLink} ended by host ${socket.user.name}`);

      } catch (err) {
        console.error('Error ending meeting:', err);
        socket.emit('error', { message: 'Failed to end meeting.' });
      }
    });

    socket.on('disconnecting', () => {
      const rooms = Array.from(socket.rooms).filter(r => r.startsWith('meeting_'));
      rooms.forEach(room => {
        const meetingLink = room.replace('meeting_', '');
        const participantIds = Array.from(io.sockets.adapter.rooms.get(room) || []).map(sid =>
          io.sockets.sockets.get(sid)?.user?.id
        );
        io.in(room).emit('participants', {
          meetingLink,
          participants: participantIds
        });
      });
    });

    socket.on('disconnect', () => {
      if (userSockets.has(socket.user.id)) {
        userSockets.get(socket.user.id).delete(socket.id);
        if (userSockets.get(socket.user.id).size === 0) {
          userSockets.delete(socket.user.id);
        }
      }
      console.log(`Socket disconnected.`);
    });

  });
};

exports.io = () => {
  if (!io) {
    console.warn("⚠️ Socket.io not initialized yet.");
    return null;
  }
  return io;
};

