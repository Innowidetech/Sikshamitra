const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhkZTVjNzU5ZjU5Y2NlNDIyZDhlMDgiLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc0MDM5NDI2Nn0.ZQJHN-4LB0o01tiRMNwZywljEMIyE7Inz72N6EdLheo' // 🔑 Replace with the host/creator's token
  },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('✅ Host connected with socket ID:', socket.id);
  socket.emit('requestJoin', { meetingLink: 'l4az6cvd5' }); // Host joins meeting directly
});

socket.on('joinResponse', (data) => {
  console.log('📨 joinResponse →', data);
});

socket.on('joinRequest', ({ meetingLink, userId, fullname, role }) => {
  console.log(`🛎️ Join request from ${fullname} (${role}) - userId: ${userId}`);

  // Simulate approving the user after a short delay
  setTimeout(() => {
    console.log(`✅ Approving ${fullname}`);
    socket.emit('respondToJoin', {
      meetingLink,
      userId,
      accept: true
    });
  }, 2000); // delay for realism
});

socket.on('participants', ({ meetingLink, participants }) => {
  console.log(`👥 Participants in ${meetingLink}:`, participants);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Host disconnected:', reason);
});

function endMeeting(meetingLink) {
  socket.emit('endMeeting', { meetingLink });
  console.log(`🛑 Host ended meeting: ${meetingLink}`);
}

// Example usage, maybe on some user action or timeout:
setTimeout(() => {
  endMeeting('l4az6cvd5'); // Replace with your meetingLink or trigger manually
}, 600000);

socket.on('connect_error', (error) => {
  console.error('⚠️ Host connection error:', error.message);
});

socket.on('error', (err) => {
  console.error('Host socket error:', err);
});

socket.on('chatMessage', ({ meetingLink, from, name, role, message, timestamp }) => {
  console.log(`[${new Date(timestamp).toLocaleTimeString()}][${meetingLink}] ${name} (${role}): ${message}`);
});

setTimeout(() => {
  socket.emit('chatMessage', {
    meetingLink: 'l4az6cvd5',
    message: 'Hello from host!'
  });
}, 5000);
