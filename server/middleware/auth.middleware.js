const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {isTokenRevoked} = require('../utils/tokenRevocation');
const ApplyForEntranceExam = require('../models/ApplyForEntranceExam');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'User not Authenticated' });
    };

    if (isTokenRevoked(token)) {
      return res.status(401).json({ message: 'Already logged out' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};


exports.protectEntranceApplicant = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const applicant = await ApplyForEntranceExam.findById(decoded.applicationId);

    if (!applicant || applicant.examId !== decoded.examId || applicant.studentDetails.email !== decoded.email) {
      return res.status(403).json({ message: 'Unauthorized: Invalid applicant' });
    }

    req.applicant = applicant;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
