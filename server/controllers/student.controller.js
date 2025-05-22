const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Exams = require('../models/Exams');
const { uploadImage } = require('../utils/multer');
const Assignment = require('../models/assignment');
const SubmitAssignment = require('../models/SubmitAssignment');
const Books = require('../models/Books');
const BookRequest = require('../models/BookRequests');

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
            // if (student.userId.isActive == false) {
            //     return res.status(404).json({ message: "Please contact your class teacher or admin to get exams data." })
            // }

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

        let uploadedPhotoUrl = '';
        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        };

        const assignment = await Assignment.findOne({
            schoolId: student.schoolId,
            _id: assignmentId,
            class: student.studentProfile.class,
            section: student.studentProfile.section
        });

        if (!assignment) {
            return res.status(404).json({ message: "No assignment found with the id." });
        }

        const existingSubmission = await SubmitAssignment.findOne({
            schoolId: student.schoolId,
            assignmentId: assignmentId,
            class: student.studentProfile.class,
            section: student.studentProfile.section
        });

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
            return res.status(201).json({ message: "Assignment submitted successfully.", submit: newSubmission });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
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

        const book = await Books.findOne({ schoolId: student.schoolId, _id: bookId, });
        if (!book) {
            return res.status(404).json({ message: "No book found with the id." });
        }

        if (book.availability == false) {
            return res.status(409).json({ message: "The book is borrowed by someone else and it is unavailable." })
        }

        const bookRequest = new BookRequest({ schoolId: student.schoolId, book: book._id, requestedBy: student._id })
        await bookRequest.save();
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
        if (!student) {
            return res.status(404).json({ message: 'No student found with the logged-in id.' });
        }
        const bookRequests = await BookRequest.find({ requestedBy: student._id }).populate('book');
        if (!bookRequests || !bookRequests.length) { return res.status(404).json({ message: "No book requests found for the student." }) }

        res.status(200).json(bookRequests)
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message, });
    }
};
