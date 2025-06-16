const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const PasswordReset = require('../models/forgotPassword');
const { sendEmail } = require('../utils/sendEmail');
const generateOtpTemplate = require('../utils/otpTemplate');
const { addRevokedToken } = require('../utils/tokenRevocation');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const School = require('../models/School');
const SchoolStaff = require('../models/SchoolStaff');
const ApplyForEntranceExam = require('../models/ApplyForEntranceExam');
const moment = require('moment');
const EntranceExamResults = require('../models/EntranceExamResults');


//user login
exports.userLogin = async (req, res) => {
  try {
    const { email, password, role, mobileNumber } = req.body;

    const loginInput = email || mobileNumber;
    if (!loginInput || !password) {
      return res.status(400).json({ message: 'Login (email or mobile number) and password are required.' });
    }

    let user
    let allowedRoles = ['superadmin', 'teacher', 'authority'];

    if (role) {
      user = await User.findOne({ role, email });
    } else {
      user = await User.findOne({ role: { $in: allowedRoles }, $or: [{ email: loginInput }, { mobileNumber: loginInput }] });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found with the given credentials or role.' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password!' });
    };

    if (user.role == 'superadmin' && user.employeeType == 'groupD') {
      if (!user.isActive) {
        return res.status(409).json({ message: "Please contact the super admin to know details." })
      }
    }

    if (user.role !== 'superadmin' && user.role !== 'authority') {
      const school = await School.findOne({ userId: user._id }) || await Student.findOne({ userId: user._id }).populate('schoolId') || await Teacher.findOne({ userId: user._id }).populate('schoolId') || await Parent.findOne({ userId: user._id }).populate('schoolId') || await SchoolStaff.findOne({ userId: user._id }).populate('schoolId')
      if (user.role !== 'admin') {
        if (school.schoolId.status !== 'active' && !user.isActive) {
          return res.status(409).json({ message: 'You cannot login right now, please contact your school admin.' })
        }
      }
      else {
        if (!user.isActive || school.status !== 'active') {
          return res.status(409).json({ message: "Please contact the super admin to know details." })
        }
      }
    }

    let payload = { userId: user._id, role: user.role };

    if (user.role === 'teacher' || (user.role === 'superadmin' && user.employeeType === 'groupD') || user.role === 'authority') {
      payload.employeeType = user.employeeType;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Login success',
      user: {
        id: user._id,
        email: user.email,
        employeeType: user.employeeType ? user.employeeType : null,
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    addRevokedToken(token);

    res.status(200).json({ message: 'Logout successful.' });
  }
  catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};


//generate otp for password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide a valid email.' })
    };

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    };

    const otp = crypto.randomInt(100000, 999999).toString();

    await PasswordReset.create({ email, otp });

    await sendEmail(email, email, 'Password Reset OTP from Shikshamitra', generateOtpTemplate(otp));

    res.status(200).json({ message: 'OTP sent to email, It will expires in 5 minutes.' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP.', error: err.message });
  }
};

//verify opt and reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!otp || !newPassword) {
      return res.status(400).json({ message: 'OTP or new password is missing.' })
    };

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with the email.' });
    };

    const resetRequest = await PasswordReset.findOne({ email, otp });
    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid OTP or email.' });
    };

    hpass = bcrypt.hashSync(newPassword, 10);

    user.password = hpass;
    await user.save();

    await PasswordReset.deleteOne({ email, otp });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password.', error: err.message });
  }
};


// exports.register=async(req,res)=>{
//   try{
//     const {email,password,role} = req.body;
//     const hpass = bcrypt.hashSync(password, 10);

//     const newUser = new User({
//       email,password:hpass,role
//     });
//     await newUser.save();
//     res.status(201).json({message:"Successfully registered."})
//   }
//   catch(error) {
//     res.status(500).json({ message: 'Registraion failed', error: error.message });
//   }
// };


exports.loginForEntranceExam = async (req, res) => {
  try {
    const { examId, email } = req.body;
    if (!examId || !email) {
      return res.status(400).json({ message: "Please provide exam ID and email to attempt the exam." });
    }

    const application = await ApplyForEntranceExam.findOne({ 'studentDetails.email': email, examId, status: 'sent' });
    if (!application) {
      return res.status(404).json({ message: "Please enter a valid email and exam ID." });
    }

    const school = await School.findById(application.schoolId);
    if (!school || school.status !== 'active') {
      return res.status(403).json({ message: "School is not active. Please contact the school management." });
    }

    const result = await EntranceExamResults.findOne({ schoolId: school._id, applicantId: application._id });
    if (result) { return res.status(403).json({ message: "You have already attempted the exam." }) }

    const currentTime = moment();

    const examDateFormatted = moment(application.examDate).format('YYYY-MM-DD');
    const examStart = moment(`${examDateFormatted} ${application.startTime}`, 'YYYY-MM-DD HH:mm');
    const examEnd = moment(`${examDateFormatted} ${application.endTime}`, 'YYYY-MM-DD HH:mm');

    if (currentTime.isBefore(examStart)) {
      return res.status(403).json({ message: "The exam has not started yet. Please wait until the scheduled time." });
    }

    if (currentTime.isAfter(examEnd)) {
      return res.status(403).json({ message: "The exam time has expired. You can no longer attempt the exam." });
    }

    const token = jwt.sign(
      {
        applicationId: application._id,
        examId: application.examId,
        email: application.studentDetails.email,
        schoolId: application.schoolId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.status(200).json({ message: "Login successful for entrance exam.", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
