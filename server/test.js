const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
    auth: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzk4NmUzYmQ3YTVlMDRkYzU1MGJhMzEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDAzNzQ2Njh9.TWjDczPOM9ktWFRP6KgGEUg9XGsOc00Yl0RjrYrWbu8'
    },
    transports: ['websocket'] // Force WebSocket only
});

socket.on('connect', () => {
    console.log('✅ Connected as socket.id:', socket.id);
    socket.emit('requestJoin', { meetingLink: 'l4az6cvd5' });
});

socket.on('joinResponse', (data) => {
    console.log('🔔 joinResponse →', data);
});

socket.on('joinAccepted', ({ meetingLink, by }) => {
    console.log(`✅ You were accepted into meeting: ${meetingLink} by ${by}`);
    // socket.emit('joinAccepted', { meetingLink }); // 👈 required to trigger full join
});

socket.on('joined', ({ meetingLink }) => {
  console.log(`🎉 Successfully joined meeting: ${meetingLink}`);

  // Send a test message after joining
  socket.emit('chatMessage', {
    meetingLink,
    message: 'Hello from test client!'
  });
});


socket.on('meetingEnded', ({ meetingLink }) => {
  console.log(`⚠️ Meeting ${meetingLink} has ended.`);
  // Optionally disable UI or redirect user
});


socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('⚠️ Connection error:', error.message);
});

socket.on('error', (err) => {
    console.error('Socket error:', err);
});

socket.on('chatMessage', ({ meetingLink, from, name, role, message, timestamp }) => {
  console.log(`[${new Date(timestamp).toLocaleTimeString()}][${meetingLink}] ${name} (${role}): ${message}`);
});
