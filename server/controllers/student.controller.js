const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Exams = require('../models/Exams');
const { uploadImage } = require('../utils/multer');
const Assignment = require('../models/assignment');
const SubmitAssignment = require('../models/SubmitAssignment');
const Books = require('../models/Books');
const BookRequest = require('../models/BookRequests');
const School = require('../models/School');
const Teacher = require('../models/Teacher');
const Notifications = require('../models/Notifications');
const Vehicles = require('../models/Vehicles');
const Parent = require('../models/Parent');
const moment = require('moment');


//edit student profile
exports.editStudentProfile = async (req, res) => {
    try {
        const updatedData = req.body;

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in students can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Only students can edit their profiles.' });
        };

        const student = await Student.findOne({ userId: loggedInId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found with the provided id.' });
        };

        const restrictedFields = ['class', 'section', 'classType', 'rollNumber', 'childOf', 'registrationNumber', 'fees', 'additionalFees'];

        let uploadedPhotoUrl = student.studentProfile.photo;

        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        };

        for (const key in updatedData) {
            if (student.studentProfile.hasOwnProperty(key)) {
                if (restrictedFields.includes(key)) {
                    return res.status(403).json({
                        message: 'You are not allowed to change it!',
                    });
                }
                student.studentProfile[key] = updatedData[key];
            }
        };
        student.studentProfile.photo = uploadedPhotoUrl;

        await student.save();

        res.status(200).json({
            message: 'Student profile updated successfully.',
            updatedProfile: student,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while updating the student profile.',
            error: err.message,
        });
    }
};


exports.attendanceReport = async (req, res) => {
    try {
        const { month, year } = req.params;
        const currentDate = new Date();

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied, only logged-in students have access.' });
        }

        const student = await Student.findOne({ userId: loggedInId });
        if (!student) {
            return res.status(404).json({ message: 'No student found with the logged-in ID' });
        }

        const studentId = student._id;
        const associatedSchool = student.schoolId;
        if (!associatedSchool) { return res.status(404).json({ message: "Student is not associated with any school." }) }

        const reportMonth = month || currentDate.getMonth() + 1;
        const reportYear = year || currentDate.getFullYear();
        const studentClass = student.studentProfile.class;

        let startDate, endDate;

        if (month && year) {
            startDate = new Date(reportYear, reportMonth - 1, 1);
            endDate = new Date(reportYear, reportMonth, 0);
        } else {
            startDate = new Date(0);
            endDate = new Date();
        }

        const query = {
            schoolId: associatedSchool,
            class: studentClass,
            date: { $gte: startDate, $lte: endDate },
            'attendance.studentId': studentId,
        };

        const attendanceRecords = await Attendance.find(query);
        if (!attendanceRecords.length) {
            return res.status(404).json({ message: 'No attendance records found for this student within the annual report period.' });
        }

        let totalDays = 0;
        let presentCount = 0;
        let absentCount = 0;
        let holidayCount = 0;

        attendanceRecords.forEach(record => {
            const studentAttendance = record.attendance.find(
                entry => entry.studentId.toString() === studentId.toString()
            );

            if (studentAttendance) {
                totalDays++;
                if (studentAttendance.status === 'Present' || studentAttendance.status === 'Late') {
                    presentCount++;
                } else if (studentAttendance.status === 'Absent') {
                    absentCount++;
                } else if (studentAttendance.status === 'Holiday') {
                    holidayCount++;
                }
            }
        });

        const presentPercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : '0.00';

        const today = new Date();
        const todayFormatted = today.toLocaleDateString();

        const todayAttendance = await Attendance.findOne({
            schoolId: associatedSchool,
            date: { $gte: new Date(today.setHours(0, 0, 0, 0)), $lte: new Date(today.setHours(23, 59, 59, 999)) },
            'attendance.studentId': studentId,
        });

        let todaysStatus = 'No record';
        if (todayAttendance) {
            const todaysRecord = todayAttendance.attendance.find(entry => entry.studentId.toString() === studentId.toString());
            if (todaysRecord) {
                todaysStatus = todaysRecord.status;
            }
        }
        res.status(200).json({
            message: 'Student attendance report fetched successfully',
            monthlySummary: {
                totalDays,
                present: presentCount,
                absent: absentCount,
                holiday: holidayCount,
                presentPercentage: `${presentPercentage}%`,
            },
            todayDate: todayFormatted,
            todayAttendance: todaysStatus,
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


exports.getAdmitCard = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, Only logged-in users have access.' });
        };

        let admitCard, student;
        const currentDate = new Date();

        if (loggedInUser.role === 'student') {
            student = await Student.findOne({ userId: loggedInId }).populate('schoolId', 'schoolBanner').populate('userId', 'isActive');
            if (!student) {
                return res.status(404).json({ message: 'No student found with the logged-in id.' })
            };
            if (!student.schoolId || !student.schoolId._id) { return res.status(404).json({ message: "Student is not associated with any school." }) }

            admitCard = await Exams.findOne({
                schoolId: student.schoolId,
                class: student.studentProfile.class,
                section: student.studentProfile.section,
                toDate: { $gte: currentDate }
            }).sort({ toDate: 1 }).limit(1);
            if (!admitCard) {
                return res.status(404).json({ message: 'No exams for the student.' })
            };
        }
        else {
            return res.status(404).json({ message: "Only logged-in students have access." })
        };
        res.status(200).json({
            message: "Admit card of student:",
            student,
            admitCard,
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        if (!assignmentId) {
            return res.status(400).json({ message: "Provide the assignment id to submit." });
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied, Only logged-in students have access.' });
        };

        const student = await Student.findOne({ userId: loggedInId });
        if (!student) {
            return res.status(404).json({ message: 'No student found with the logged-in id.' });
        }
        if (!student.schoolId) { return res.status(404).json({ message: "Student is not associated with any school." }) }

        let uploadedPhotoUrl = '';
        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        };

        const assignment = await Assignment.findOne({ schoolId: student.schoolId, _id: assignmentId, class: student.studentProfile.class, section: student.studentProfile.section });
        if (!assignment) {
            return res.status(404).json({ message: "No assignment found with the id." });
        }

        const existingSubmission = await SubmitAssignment.findOne({ schoolId: student.schoolId, assignmentId: assignmentId, class: student.studentProfile.class, section: student.studentProfile.section });

        if (existingSubmission) {
            existingSubmission.submittedBy.push({
                studentId: student._id,
                assignmentWork: uploadedPhotoUrl
            });

            await existingSubmission.save();
            return res.status(200).json({ message: "Assignment submitted successfully.", submit: existingSubmission });
        } else {
            const newSubmission = new SubmitAssignment({
                schoolId: student.schoolId,
                class: student.studentProfile.class,
                section: student.studentProfile.section,
                assignmentId: assignment._id,
                submittedBy: [{
                    studentId: student._id,
                    assignmentWork: uploadedPhotoUrl
                }]
            });
            await newSubmission.save();

            let memberIds = []
            memberIds.push({ memberId: assignment.createdBy });
            const notification = new Notifications({ section: 'assignment', memberIds, text: `An assignment of subject - '${assignment.subject}' has been submitted by '${student.studentProfile.fullname}'` });
            await notification.save();

            return res.status(201).json({ message: "Assignment submitted successfully.", submit: newSubmission });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


exports.requestBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({ message: "Provide the book id to request book." });
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied, Only logged-in students have access.' });
        };

        const student = await Student.findOne({ userId: loggedInId });
        if (!student) {
            return res.status(404).json({ message: 'No student found with the logged-in id.' });
        }
        if (!student.schoolId) { return res.status(404).json({ message: "Student is not associated with any school." }) }

        const book = await Books.findOne({ schoolId: student.schoolId, _id: bookId, });
        if (!book) {
            return res.status(404).json({ message: "No book found with the id." });
        }

        if (book.availableBooks <= 0) {
            return res.status(409).json({ message: "The book is not available to borrow." })
        }

        const bookRequest = new BookRequest({ schoolId: student.schoolId, book: book._id, requestedBy: student._id })
        await bookRequest.save();

        let memberIds = [];

        const school = await School.findById(student.schoolId);
        if (school && school.userId) {
            memberIds.push({ memberId: school.userId });
        }

        const teachers = await Teacher.find({ schoolId: student.schoolId }).populate('userId');

        const librarian = teachers.find(t => t.userId && t.userId.employeeType === 'librarian')
        if (librarian) {
            memberIds.push({ memberId: librarian._id });
        }

        const notification = new Notifications({ section: 'library', memberIds: memberIds, text: `New book request received from student - ${student.studentProfile.fullname} of class ${student.studentProfile.class}${student.studentProfile.section}` });
        await notification.save()

        res.status(201).json({ message: "Book requested successfully. Please wait until the librarian confirms." })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message, });
    }
};


exports.getBookRequests = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied, Only logged-in students have access.' });
        };

        const student = await Student.findOne({ userId: loggedInId });
        if (!student) { return res.status(404).json({ message: 'No student found with the logged-in id.' }); }
        const associatedSchool = await School.findById(student.schoolId);
        if (!associatedSchool) { return res.status(404).json({ message: "Logged-in student is not associated with any school." }) }

        const bookRequests = await BookRequest.find({ schoolId: student.schoolId, requestedBy: student._id }).populate('book').sort({ createdAt: -1 });

        let libraryFineAmount = associatedSchool.libraryFineAmount || '-';

        res.status(200).json({ libraryFineAmount, bookRequests })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message, });
    }
};


exports.getTransportationDetails = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, Only logged-in users have access.' });
        };

        if (loggedInUser.role === 'student' || loggedInUser.role === 'parent' || (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'driver')) {
            const student = await Student.findOne({ userId: loggedInId });
            const parent = !student ? await Parent.findOne({ userId: loggedInId }) : null;
            const driver = (!student && !parent) ? loggedInUser : null

            const user = student || parent || driver;

            if (!user) {
                return res.status(404).json({ message: 'No user found with the logged-in id.' });
            }

            let vehicleQuery = { schoolId: user.schoolId };

            if (student) {
                vehicleQuery['studentDetails.studentId'] = user._id;
            } else if (parent) {
                vehicleQuery.$or = [
                    { 'studentDetails.studentId': { $in: parent.parentProfile.parentOf } }
                ];
            } else if (driver) {
                vehicleQuery['driverDetails.userId'] = loggedInId;
            }

            const vehicle = await Vehicles.findOne(vehicleQuery)
                .populate({
                    path: 'studentDetails.studentId',
                    select: 'studentProfile.fullname studentProfile.class studentProfile.section studentProfile.childOf',
                })
                .populate({ path: 'driverDetails.userId', select: 'email', });

            if (!vehicle) { return res.status(404).json({ message: 'No vehicle found.' }) }

            populatedVehicle = vehicle.toObject();

            populatedVehicle.routeDetails.sort((a, b) => {
                const timeA = moment(a.timing, 'hh:mm A').toDate();
                const timeB = moment(b.timing, 'hh:mm A').toDate();
                return timeA - timeB;
            });

            for (let studentDetail of populatedVehicle.studentDetails) {
                const childOfUserId = studentDetail?.studentId?.studentProfile?.childOf;
                if (childOfUserId) {
                    const parent = await Parent.findOne({ userId: childOfUserId }).select('parentProfile.fatherName parentProfile.motherName parentProfile.fatherPhoneNumber parentProfile.motherPhoneNumber parentProfile.parentAddress');
                    studentDetail.parent = parent ? parent.parentProfile : null;
                }
            }
            return res.status(200).json({ vehicle: populatedVehicle });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message, });
    }
};