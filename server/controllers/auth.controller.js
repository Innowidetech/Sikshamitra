const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const PasswordReset = require('../models/forgotPassword');
const { sendEmail } = require('../utils/sendEmail');
const generateOtpTemplate = require('../utils/otpTemplate')
const { addRevokedToken } = require('../utils/tokenRevocation');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const School = require('../models/School');


//user login
exports.userLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email or password or role is missing.' })
    };

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: 'User not found with the email or role.' });
    };

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password!' });
    };

    if (user.role !== 'superadmin') {
      const loggedInUser = await School.findOne({ userId: user._id }) || await Student.findOne({ userId: user._id }).populate('schoolId') || await Teacher.findOne({ userId: user._id }).populate('schoolId') || await Parent.findOne({ userId: user._id }).populate('schoolId')
      if (user.role !== 'admin') {
        if (loggedInUser.schoolId.status !== 'active') {
          return res.status(409).json({ message: 'You cannot login right now, please contact your school admin.' })
        }
      }
      else {
        if (!user.isActive || loggedInUser.status !== 'active') {
          return res.status(409).json({ message: "Please contact the super admin to know details." })
        }
      }

      if (user.role !== 'admin' && !user.isActive) {
        return res.status(409).json({ message: 'You cannot login right now, please contact your school admin.' })
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      // { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login success',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employeeType: user.employeeType,
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


