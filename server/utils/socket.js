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
const meetingParticipants = new Map();
const waitingRooms = new Map(); // meetingLink => { userId: { name, role } }
const meetingLayouts = new Map(); // meetingLink => { layout: 'grid'|'spotlight', spotlightUserId }

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

function broadcastParticipantsInfo(meetingLink) {
  const roomSockets = Array.from(io.sockets.adapter.rooms.get(`meeting_${meetingLink}`) || []);
  const participants = [];

  roomSockets.forEach(socketId => {
    const s = io.sockets.sockets.get(socketId);
    if (s?.user) {
      const { id, name, role } = s.user;
      const status = meetingParticipants.get(meetingLink)?.[id] || { camera: false, mic: false, screen: false };
      participants.push({ userId: id, name, role, ...status });
    }
  });

  io.in(`meeting_${meetingLink}`).emit('participantsInfo', { meetingLink, participants });
}

exports.initSocket = (server) => {
  io = socketIo(server, { cors: { origin: '*' } });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error('User not found'));

      let fullUser;
      switch (user.role) {
        case 'superadmin':
          fullUser = { id: user._id.toString(), name: 'Super Admin', role: user.role };
          break;
        case 'admin': {
          const school = await School.findOne({ userId: user._id });
          if (!school) return next(new Error('School Admin not found'));
          fullUser = { id: user._id.toString(), name: school.principalName, role: user.role };
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

  io.on('connection', (socket) => {
    addUserSocket(socket.user.id, socket.id);
    socket.join(`user_${socket.user.id}`);
    socket.meetings = {};

    socket.on('error', (err) => console.error('Socket error:', err));

    socket.on('requestJoin', async ({ meetingLink }) => {
      try {
        const doc = await Connect.findOne({ meetingLink }) || await OnlineLectures.findOne({ meetingLink });
        if (!doc) return socket.emit('joinResponse', { meetingLink, success: false, message: 'Meeting not found.' });

        const status = getMeetingStatus(doc);
        if (status !== 'Live') return socket.emit('joinResponse', { meetingLink, success: false, message: status });

        const isCreator = socket.user.id === doc.createdBy.toString();
        const isInvited = doc.connect?.some(c => c.attendant.toString() === socket.user.id) || isCreator;

        if (!isInvited) return socket.emit('joinResponse', { meetingLink, success: false, message: 'Not invited.' });

        if (isCreator) {
          socket.join(`meeting_${meetingLink}`);
          socket.emit('joinResponse', { meetingLink, success: true, message: 'Joined as host.' });
          broadcastParticipantsInfo(meetingLink);
          return;
        }

        socket.meetings[meetingLink] = { creatorId: doc.createdBy.toString() };

        if (!waitingRooms.has(meetingLink)) waitingRooms.set(meetingLink, {});
        waitingRooms.get(meetingLink)[socket.user.id] = {
          name: socket.user.name,
          role: socket.user.role
        };

        const waitingList = Object.entries(waitingRooms.get(meetingLink)).map(([id, u]) => ({ userId: id, ...u }));
        io.to(`user_${doc.createdBy}`).emit('waitingRoomUpdate', { meetingLink, waitingList });
        io.to(`user_${doc.createdBy}`).emit('joinRequest', {
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
        socket.emit('joinResponse', { meetingLink, success: false, message: 'Internal error.' });
      }
    });

    socket.on('respondToJoin', async ({ meetingLink, userId, accept }) => {
      const meetingDoc = await Connect.findOne({ meetingLink }) || await OnlineLectures.findOne({ meetingLink });
      if (!meetingDoc || meetingDoc.createdBy.toString() !== socket.user.id) return;

      const targetSocketIds = getUserSocketIds(userId);
      if (accept) {
        targetSocketIds.forEach(socketId => {
          const userSocket = io.sockets.sockets.get(socketId);
          if (userSocket) {
            userSocket.join(`meeting_${meetingLink}`);
            userSocket.emit('joinAccepted', { meetingLink });
            io.in(`meeting_${meetingLink}`).emit('userJoined', {
              userId,
              name: userSocket.user.name,
              role: userSocket.user.role
            });
          }
        });

        if (waitingRooms.has(meetingLink)) {
          delete waitingRooms.get(meetingLink)[userId];
          const updatedWaiting = Object.entries(waitingRooms.get(meetingLink)).map(([id, u]) => ({ userId: id, ...u }));
          io.to(`user_${socket.user.id}`).emit('waitingRoomUpdate', { meetingLink, waitingList: updatedWaiting });
        }
        broadcastParticipantsInfo(meetingLink);
      } else {
        targetSocketIds.forEach(socketId => {
          io.to(socketId).emit('joinDenied', { meetingLink });
        });

        if (waitingRooms.has(meetingLink)) {
          delete waitingRooms.get(meetingLink)[userId];
          const updatedWaiting = Object.entries(waitingRooms.get(meetingLink)).map(([id, u]) => ({ userId: id, ...u }));
          io.to(`user_${socket.user.id}`).emit('waitingRoomUpdate', { meetingLink, waitingList: updatedWaiting });
        }
      }
    });

    socket.on('joinAccepted', ({ meetingLink }) => {
      socket.join(`meeting_${meetingLink}`);
      socket.emit('joined', { meetingLink });

      io.in(`meeting_${meetingLink}`).emit('userJoined', {
        userId: socket.user.id,
        name: socket.user.name,
        role: socket.user.role
      });
      broadcastParticipantsInfo(meetingLink);
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

    socket.on('signal', ({ meetingLink, type, data, targetId }) => {
      const targetSocketIds = getUserSocketIds(targetId);
      targetSocketIds.forEach(socketId => {
        const targetSocket = io.sockets.sockets.get(socketId);
        const room = `meeting_${meetingLink}`;
        if (targetSocket?.rooms.has(room) && socket.rooms.has(room)) {
          io.to(socketId).emit('signal', { from: socket.user.id, type, data });
        }
      });
    });

    socket.on('mediaStatus', ({ meetingLink, type, isEnabled }) => {
      if (!meetingParticipants.has(meetingLink)) meetingParticipants.set(meetingLink, {});
      const participants = meetingParticipants.get(meetingLink);
      if (!participants[socket.user.id]) participants[socket.user.id] = { camera: false, mic: false, screen: false };
      participants[socket.user.id][type] = isEnabled;

      socket.to(`meeting_${meetingLink}`).emit('mediaStatus', {
        userId: socket.user.id,
        type,
        isEnabled
      });

      broadcastParticipantsInfo(meetingLink);
    });

    socket.on('getParticipantsInfo', ({ meetingLink }) => {
      broadcastParticipantsInfo(meetingLink);
    });

    socket.on('leaveMeeting', ({ meetingLink }) => {
      socket.leave(`meeting_${meetingLink}`);
      if (meetingParticipants.has(meetingLink)) {
        delete meetingParticipants.get(meetingLink)[socket.user.id];
      }
      broadcastParticipantsInfo(meetingLink);
    });

    socket.on('endMeeting', async ({ meetingLink }) => {
      const meetingDoc = await Connect.findOne({ meetingLink }) || await OnlineLectures.findOne({ meetingLink });
      if (!meetingDoc || meetingDoc.createdBy.toString() !== socket.user.id) return;

      await Connect.deleteOne({ meetingLink });
      await OnlineLectures.deleteOne({ meetingLink });

      io.in(`meeting_${meetingLink}`).emit('meetingEnded', { meetingLink });

      const roomSockets = io.sockets.adapter.rooms.get(`meeting_${meetingLink}`) || new Set();
      roomSockets.forEach(socketId => {
        const s = io.sockets.sockets.get(socketId);
        if (s) {
          s.leave(`meeting_${meetingLink}`);
          s.emit('leftMeeting', { meetingLink, reason: 'Meeting ended by host.' });
        }
      });
    });

    socket.on('setLayout', ({ meetingLink, layout, spotlightUserId }) => {
      if (!['grid', 'spotlight'].includes(layout)) return;
      meetingLayouts.set(meetingLink, { layout, spotlightUserId: spotlightUserId || null });
      io.in(`meeting_${meetingLink}`).emit('layoutChanged', {
        meetingLink,
        layout,
        spotlightUserId: spotlightUserId || null
      });
    });

    socket.on('getLayout', ({ meetingLink }) => {
      const layoutData = meetingLayouts.get(meetingLink) || { layout: 'grid', spotlightUserId: null };
      socket.emit('layoutChanged', { meetingLink, ...layoutData });
    });

    socket.on('disconnecting', () => {
      const rooms = Array.from(socket.rooms).filter(r => r.startsWith('meeting_'));
      rooms.forEach(room => {
        const meetingLink = room.replace('meeting_', '');
        if (meetingParticipants.has(meetingLink)) {
          delete meetingParticipants.get(meetingLink)[socket.user.id];
        }
        broadcastParticipantsInfo(meetingLink);
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
