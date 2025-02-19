const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Exams = require('../models/Exams');
const { uploadImage } = require('../utils/multer');
const Assignment = require('../models/assignment');
const SubmitAssignment = require('../models/SubmitAssignment')

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

        const restrictedFields = ['class', 'section', 'classType', 'rollNumber', 'childOf', 'registrationNumber', 'fees'];

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
                        message: 'You are not allowed to change your class nor section nor roll number nor registrationNumber nor fees!',
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


//get annual attendance report
exports.attendanceReport = async (req, res) => {
    try {
        const { month, year } = req.body;
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
            startDate = new Date(reportYear, reportMonth - 1, 1);  // First day of the month
            endDate = new Date(reportYear, reportMonth, 0);        // Last day of the month
        } else {
            // Fetch all records for the student (no date range filtering)
            startDate = new Date(0); // January 1st, 1970, the earliest possible date
            endDate = new Date();    // Current date
        }

        const query = {
            schoolId: associatedSchool,
            class: studentClass, // Filter by the student's class
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
            todayDate:todayFormatted,
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

        if (loggedInUser.role === 'student') {
            student = await Student.findOne({ userId: loggedInId }).populate('schoolId','schoolBanner');
            if (!student) {
                return res.status(404).json({ message: 'No student found with the logged-in id.' })
            };

            admitCard = await Exams.findOne({
                schoolId: student.schoolId,
                class: student.studentProfile.class,
                section: student.studentProfile.section
            }).sort({createdAt:-1});
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