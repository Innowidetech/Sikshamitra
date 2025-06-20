const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {autoMarkHoliday} = require('./controllers/teacher.controller');
dotenv.config();
const {initSocket} = require('./utils/socket');
const http = require('http');



const authRoute = require('./routes/auth.routes');
const userRoute = require('./routes/user.routes');
const superAdminRoute=require('./routes/superAdmin.routes');
const adminRoute = require('./routes/admin.routes');
const teacherRoute = require('./routes/teacher.routes');
const studentRoute = require('./routes/student.routes');
const parentRoute = require('./routes/parent.routes');
const staffRoute = require('./routes/staff.routes');
const authorityRoute = require('./routes/authority.routes');

const app = express();
const server = http.createServer(app); // use HTTP server for socket.io

// Initialize Socket.IO
initSocket(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);
app.use('/api/user',userRoute);
app.use('/api/superAdmin',superAdminRoute);
app.use('/api/admin',adminRoute);
app.use('/api/teacher',teacherRoute);
app.use('/api/student',studentRoute);
app.use('/api/parent',parentRoute);
app.use('/api/staff', staffRoute);
app.use('/api/authority', authorityRoute);

setInterval(autoMarkHoliday, 3600000)

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('Connected to DataBase'))
.catch(err => console.error('DataBase connection error:', err));

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('joinRoom', (room) => {
//         socket.join(room);
//         console.log(`User joined room: ${room}`);
//     });

//     socket.on('sendMessage', (data) => {
//         io.to(data.room).emit('receiveMessage', data.message);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// server.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });



// CLIENT
{/* <script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  socket.emit('joinRoom', 'admin-teacher-room');

  socket.on('receiveMessage', function (message) {
    console.log('New message:', message);
  });

  function sendMessage(msg) {
    socket.emit('sendMessage', { room: 'admin-teacher-room', message: msg });
  }
</script> */}
