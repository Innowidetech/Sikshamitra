const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Route imports
const authRoute = require('./routes/auth.routes');
const userRoute = require('./routes/user.routes');
const superAdminRoute=require('./routes/superAdmin.routes');
const adminRoute = require('./routes/admin.routes');
const teacherRoute = require("./routes/teacher.routes");
const studentRoute = require('./routes/student.routes');
const parentRoute = require('./routes/parent.routes');
const paymentRoute = require('./routes/payment.routes');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user',userRoute);
app.use('/api/superAdmin',superAdminRoute);
app.use('/api/admin',adminRoute);
app.use('/api/teacher',teacherRoute);
app.use('/api/student',studentRoute);
app.use('/api/parent',parentRoute);
app.use('/api/payment',paymentRoute);



// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to DataBase'))
.catch(err => console.error('DataBase connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});