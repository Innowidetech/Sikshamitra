const Parent = require('../models/Parent');
const User = require('../models/User');
const School = require('../models/School');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Notice = require('../models/Notice');
require('dotenv').config();
const ParentExpenses = require('../models/ParentExpenses');
const Razorpay = require('razorpay');
const SchoolIncome = require('../models/SchoolIncome');
const { uploadImage, deleteImage } = require('../utils/multer');
const ClassTimetable = require('../models/Timetable');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Vehicles = require('../models/Vehicles');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.editParentProfile = async (req, res) => {
  try {
    const updatedData = req.body;
    if (!updatedData && !req.file) {
      return res.status(400).json({ message: 'No new data provided to update.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: "Access denied, only logged-in parents can access." })
    };

    const parent = await Parent.findOne({ userId: loggedInId });
    if (!parent) {
      return res.status(404).json({ message: 'No parent found with the userId.' })
    };

    let uploadedPhotoUrl
    if (parent.parentProfile.photo) {
      uploadedPhotoUrl = parent.parentProfile.photo
    }
    if (req.file) {
      try {
        if (parent.parentProfile.photo) {
          await deleteImage(parent.parentProfile.photo);
        }
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    }

    for (let key in updatedData) {
      if (parent.parentProfile.hasOwnProperty(key)) {
        parent.parentProfile[key] = updatedData[key];
      }
    }
    parent.parentProfile.photo = uploadedPhotoUrl;
    await parent.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      updatedProfile: parent,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};

exports.parentDashboard = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can access their data.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied, only parents can access this.' });
    }

    const parentData = await Parent.findOne({ userId: loggedInId }).populate('userId', 'email').populate({ path: 'schoolId', select: 'schoolLogo' });

    const parent = await Parent.findOne({ userId: loggedInId }).populate('userId parentProfile.parentOf');
    if (!parent) {
      return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
    }

    const studentIds = parent.parentProfile.parentOf.map(student => student._id);

    const studentDataPromises = studentIds.map(async (studentId) => {
      const student = await Student.findOne({
        _id: studentId,
        schoolId: parent.schoolId,
        'studentProfile.childOf': parent.userId._id
      }).populate('userId');

      if (!student) {
        return { studentId, error: 'No student found with the given ID associated with this parent.' };
      }

      const year = req.body.year || new Date().getFullYear() - 1;
      const startDate = new Date(year, 3, 1); // April
      const endDate = new Date(year + 1, 2, 31, 23, 59, 59); // March

      const attendanceRecords = await Attendance.find({
        schoolId: parent.schoolId,
        date: { $gte: startDate, $lte: endDate },
        'attendance.studentId': student._id,
      });

      const statusCounts = { Present: 0, Absent: 0, Holiday: 0 };
      let totalDays = 0;

      const attendanceReport = attendanceRecords.map(record => {
        const studentAttendance = record.attendance.find(
          entry => entry.studentId.toString() === student._id.toString()
        );
        if (studentAttendance) {
          statusCounts[studentAttendance.status] = (statusCounts[studentAttendance.status] || 0) + 1;
          totalDays += 1;
          return { date: record.date, status: studentAttendance.status };
        }
        return null;
      }).filter(entry => entry !== null);

      const percentages = {};
      for (const [status, count] of Object.entries(statusCounts)) {
        percentages[status] = totalDays > 0 ? ((count / totalDays) * 100).toFixed(2) : '0.00';
      }

      const school = await School.findById(parent.schoolId);
      if (!school) {
        return { studentId, error: 'Student is not associated with any school.' };
      }

      const schoolNotices = await Notice.find({ createdBy: school.userId });

      const teacher = await Teacher.findOne({
        schoolId: school._id,
        'profile.class': student.studentProfile.class,
        'profile.section': student.studentProfile.section
      });

      const teacherNotices = teacher ? await Notice.find({ createdBy: teacher._id }) : [];
      const allNotices = [...schoolNotices, ...teacherNotices];

      const notices = allNotices.map(notice => ({
        createdByText: notice.createdBy.equals(school.userId)
          ? 'Notice was created by the school.'
          : 'Notice was created by the class teacher.',
        ...notice._doc,
      }));

      return {
        studentId,
        student,
        totalDays,
        counts: statusCounts,
        percentages,
        notices,
      };
    });

    const studentData = await Promise.all(studentDataPromises);

    const validStudentData = studentData.filter(data => !data.error);

    res.status(200).json({
      message: 'Parent dashboard data fetched successfully.',
      parentData,
      students: validStudentData,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};


exports.getChildrenNames = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can access their data.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied, only parents can access this.' });
    }

    const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf', 'studentProfile.fullname')
    if (!parent) { return res.status(404).json({ message: "No parent found with the logged-in id." }) }

    res.status(200).json({ children: parent.parentProfile.parentOf })
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};


exports.payFees = async (req, res) => {
  try {
    const { studentName, amount, purpose, className, section, reason } = req.body;
    if (!studentName || !amount || !['Fees', 'Others', 'Transportation'].includes(purpose) || !className || !section) { return res.status(400).json({ message: "Provide student name, amount, valid purpose, class and section to pay." }) }

    if (purpose === 'Others' && !reason) {
      return res.status(400).json({ message: "Please specify the reason." });
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can access their data.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied, only parents can access this.' });
    }

    const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf')
    if (!parent) { return res.status(404).json({ message: "No parent found with the logged-in id." }) }

    const student = await Student.findOne({ 'studentProfile.fullname': studentName, schoolId: parent.schoolId, 'studentProfile.childOf': loggedInId });
    if (!student) {
      return res.status(404).json({ message: "No child found with the provided name." });
    }

    const razorpayOrder = await razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: `receipt_${Date.now()}` });

    const existingExpense = await ParentExpenses.findOne({ studentId: student._id, class: className, section: section, purpose: 'Fees', paidBy: parent._id });

    const transportation = await Vehicles.findOne({ schoolId: student.schoolId, 'studentDetails.studentId': student._id });
    if (!transportation) { return res.status(404).json({ message: "No transportation found for the selected student" }) }

    const transportationFee = transportation.studentDetails.find(std => std.studentId.toString() === student._id.toString());

    const newExpense = new ParentExpenses({
      schoolId: parent.schoolId,
      studentId: student._id,
      class: className,
      section: section,
      amount: amount,
      pendingAmount:
        purpose === 'Fees'
          ? existingExpense
            ? existingExpense.pendingAmount  // If existing expense
            : parseFloat(student.studentProfile.fees) + student.studentProfile.additionalFees // If new
          : purpose === 'Transportation'
            ? transportationFee
              ? transportationFee.amountDue : 0
            : '',
      purpose: purpose,
      reason,
      paidBy: parent._id,
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: '',
        status: 'pending',
      },
    });

    await newExpense.save();

    res.status(200).json({ message: 'Payment order created successfully.', newExpense });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message, });
  }
};


exports.verifyFeesPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const paymentRecord = await ParentExpenses.findOne({ 'paymentDetails.razorpayOrderId': razorpayOrderId });
    if (!paymentRecord) {
      return res.status(404).json({ message: 'Payment record not found.' });
    }

    if (paymentRecord.paymentDetails.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed or failed.' });
    }

    const amountPaid = paymentRecord.amount;
    paymentRecord.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    paymentRecord.paymentDetails.status = 'success';

    if (['Fees', 'Transportation'].includes(paymentRecord.purpose)) {
      paymentRecord.pendingAmount = Math.max((paymentRecord.pendingAmount || 0) - amountPaid, 0);
    }

    await paymentRecord.save();

    if (paymentRecord.purpose === 'Transportation') {
      const vehicle = await Vehicles.findOne({
        schoolId: paymentRecord.schoolId,
        'studentDetails.studentId': paymentRecord.studentId
      });

      if (vehicle) {
        const studentDetail = vehicle.studentDetails.find(std =>
          std.studentId.toString() === paymentRecord.studentId.toString()
        );

        if (studentDetail) {
          studentDetail.amountPaid += amountPaid;
          studentDetail.amountDue = Math.max(studentDetail.totalFee - studentDetail.amountPaid, 0);
          await vehicle.save();
        }
      }
    }
    res.status(200).json({ message: "Payment verified successfully", paymentRecord });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error during payment verification.', error: err.message });
  }
};



exports.getExpenses = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can access their data.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied, only parents can access this.' });
    }

    const parent = await Parent.findOne({ userId: loggedInId })
    if (!parent) { return res.status(404).json({ message: "No parent found with the logged-in id." }) }

    const parentFees = await ParentExpenses.find({ schoolId: parent.schoolId, paidBy: parent._id }).populate('studentId', 'studentProfile.fullname').populate('paidBy', 'parentProfile.fatherName parentProfile.motherName').sort({ createdAt: -1 });
    const parentExpenseFromSchoolIncomeForm = await SchoolIncome.find({ paidBy: parent._id }).populate({ path: 'paidBy', select: 'parentProfile.fatherName parentProfile.motherName' }).sort({ date: -1 });

    const expenses = parentFees.concat(parentExpenseFromSchoolIncomeForm)
    if (!expenses.length) { return res.status(404).json({ message: "No expenses found." }) }
    res.status(200).json({ expenses })
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};


exports.getFeesReceipts = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can access their data.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied, only parents can access this.' });
    }

    const parent = await Parent.findOne({ userId: loggedInId })
    if (!parent) { return res.status(404).json({ message: "No parent found with the logged-in id." }) }

    const feesReceipts = await ParentExpenses.find({ schoolId: parent.schoolId, paidBy: parent._id, purpose: 'Fees' }).populate('studentId', 'studentProfile.fullname').sort({ createdAt: -1 })
    if (!feesReceipts.length) { return res.status(200).json({ message: "No fees paid to get receipts." }) }
    res.status(200).json({ feesReceipts })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


exports.getTeacherNamesForQuery = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: "Access denied, only logged-in parents can access." });
    }

    const parent = await Parent.findOne({ userId: loggedInId });
    if (!parent) {
      return res.status(404).json({ message: 'No parent found with the logged-in id.' });
    }

    let teacherInfoSet = new Set();


    const timetables = await Promise.all(
      parent.parentProfile.parentOf.map(async (sid) => {
        const student = await Student.findById(sid);

        const timetable = await ClassTimetable.findOne({
          class: student.studentProfile.class,
          section: student.studentProfile.section,
          schoolId: student.schoolId
        })
          .populate('timetable.monday.teacher', 'profile.fullname')
          .populate('timetable.tuesday.teacher', 'profile.fullname')
          .populate('timetable.wednesday.teacher', 'profile.fullname')
          .populate('timetable.thursday.teacher', 'profile.fullname')
          .populate('timetable.friday.teacher', 'profile.fullname')
          .populate('timetable.saturday.teacher', 'profile.fullname');

        return timetable
      })
    )

    for (const timetable of timetables) {
      if (!timetable) continue;

      for (const day of Object.keys(timetable.timetable)) {
        for (const slot of timetable.timetable[day]) {
          const teacherName = slot.teacher?.profile?.fullname;
          const subject = slot.subject;

          if (teacherName && subject) {
            teacherInfoSet.add(`${teacherName}-${subject}`);
          }
        }
      }
    }

    const teacherList = Array.from(teacherInfoSet);
    res.status(200).json({ teachers: teacherList });
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};