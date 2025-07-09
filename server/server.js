const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {autoMarkHoliday} = require('./controllers/teacher.controller');
require('dotenv').config();

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
const server = http.createServer(app);


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

initSocket(server);

setInterval(autoMarkHoliday, 3600000)

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('Connected to DataBase'))
.catch(err => console.error('DataBase connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
