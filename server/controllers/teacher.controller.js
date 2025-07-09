const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Assignment = require('../models/assignment')
const Attendance = require('../models/Attendance');
const moment = require('moment-timezone');
const Syllabus = require('../models/Syllabus');
const StudyMaterial = require('../models/StudyMaterial');
const { uploadImage } = require('../utils/multer');
const Exams = require('../models/Exams');
const Results = require('../models/Results');
const School = require('../models/School');
const ClassPlan = require('../models/ClassPlan');
const SubmitAssignment = require('../models/SubmitAssignment');
const Lectures = require('../models/Lectures');
const ClassTimetable = require('../models/Timetable');
const RequestExpense = require('../models/RequestExpense');
const ParentExpenses = require('../models/ParentExpenses');
const mongoose = require('mongoose');
const SchoolIncome = require('../models/SchoolIncome');
const OnlineLectures = require('../models/OnlineLectures');
const Notifications = require('../models/Notifications');
const { io } = require('../utils/socket');

//edit teacher profile
exports.editTeacherProfile = async (req, res) => {
    try {
        const updatedData = req.body;

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can edit their profiles.' });
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found with the loggedin id.' });
        }

        const restrictedField = ['salary', 'employeeId', 'class', 'section'];

        let uploadedPhotoUrl = teacher.profile.photo;

        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        };

        for (const key in updatedData) {
            if (teacher.profile.hasOwnProperty(key)) {
                if (restrictedField.includes(key)) {
                    return res.status(403).json({
                        message: 'You are not allowed to change your salary, employeeId, class and section!',
                    });
                }
                teacher.profile[key] = updatedData[key];
            }
        }
        if (updatedData.education && Array.isArray(updatedData.education)) {
            updatedData.education.forEach(edu => {
                const validEducation = edu.university && edu.degree && edu.startDate && edu.endDate && edu.city;
                if (validEducation) {
                    teacher.education.push(edu);
                }
            });
        }

        teacher.profile.photo = uploadedPhotoUrl;

        await teacher.save();

        res.status(200).json({
            message: 'Teacher profile updated successfully.',
            updatedTeacher: teacher,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while updating the teacher profile.',
            error: err.message,
        });
    }
};


exports.deleteEducation = async (req, res) => {
    try {
        const educationId = req.params.educationId;
        const loggedInId = req.user && req.user.id;

        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can edit their profiles.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found with the logged-in id.' });
        }

        const educationIndex = teacher.education.findIndex(edu => edu._id.toString() === educationId);
        if (educationIndex === -1) {
            return res.status(404).json({ message: 'Education record not found with the id.' });
        }

        teacher.education.splice(educationIndex, 1);

        await teacher.save();

        res.status(200).json({
            message: 'Education record deleted successfully.',
            updatedTeacher: teacher,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while deleting the education record.',
            error: err.message,
        });
    }
};

//get all students of teacher class
exports.getStudentsOfTeacher = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only class teachers can get the students list.' });
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found with the loggedin id.' });
        };

        const parents = await Parent.find({ schoolId: teacher.schoolId })
            .populate({
                path: "parentProfile.parentOf",
                model: "Student",
                match: {
                    "schoolId": teacher.schoolId,
                    "studentProfile.class": teacher.profile.class,
                    "studentProfile.section": teacher.profile.section
                }
            })
        const filteredParents = parents.filter(parent => parent.parentProfile.parentOf.length > 0);

        if (filteredParents.length === 0) {
            return res.status(404).json({ message: "No students found for your class." });
        }

        res.status(200).json({
            message: 'Students retrieved successfully.',
            parents: filteredParents
        })
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while retrieving the students list.',
            error: err.message,
        });
    }
};

//assigning assignments for students
exports.assignmentForStudents = async (req, res) => {
    try {
        const { chapterName, classs, section, subject, chapter, startDate, endDate } = req.body;
        if (!classs || !section || !subject || !chapter || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide all the fields.' });
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can assign the assignments to students.' });
        };

        const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId');
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }
        if (!teacher.profile.subjects.length) {
            return res.status(404).json({ message: "You are not allowed to upload assignment." })
        }
        if (!teacher.profile.subjects.includes(req.body.subject)) {
            return res.status(404).json({ message: `You are not allowed to upload assignment with subject - ${subject}` })
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

        const newAssignment = new Assignment({ schoolId: teacher.schoolId, chapterName, teacherName: teacher.profile.fullname, class: classs, section, subject, chapter, startDate, endDate, assignment: uploadedPhotoUrl, createdBy: teacher._id, });
        await newAssignment.save();

        const students = await Student.find({ schoolId: teacher.schoolId._id, 'studentProfile.class': classs, 'studentProfile.section': section }).populate('userId')

        const memberIds = [
            ...students.map(student => ({ memberId: student._id }))
        ]
        const notification = new Notifications({ section: 'assignment', memberIds, text: `A new assignment for the subject - '${subject}' has been assigned.` });
        await notification.save();

        res.status(201).json({ message: 'Assignment created successfully.', newAssignment });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while creating the assignment.', error: err.message, });
    }
};


exports.getAssignment = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied. Only users can access.' });
        };

        let schoolId, className, section, creator, teacherAssignments, classAssignments;

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found with the logged-in id.' });
            }
            schoolId = teacher.schoolId;
            creator = teacher._id;
            className = teacher.profile.class;
            section = teacher.profile.section
        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = student.studentProfile.section;
        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view assignments.',
            });
        };

        teacherAssignments = await Assignment.find({
            schoolId: schoolId,
            createdBy: creator,
        }).sort({ createdAt: -1 });

        classAssignments = await Assignment.find({
            schoolId: schoolId,
            class: className,
            section: section,
        }).sort({ createdAt: -1 });

        if (!teacherAssignments.length && !classAssignments.length) {
            return res.status(200).json({ message: 'No assignments found for the class.' });
        };

        res.status(200).json({
            message: 'Assignment fetched successfully.',
            teacherAssignments,
            classAssignments
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching assignments.',
            error: err.message,
        });
    }
};





exports.getSubmittedAssignments = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
        };

        let teacherAssignments, studentAssignments;

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found with the logged-in id.' });
            }
            teacherAssignments = await SubmitAssignment.findOne({
                assignmentId: id,
                schoolId: teacher.schoolId,
            }).populate({
                path: 'assignmentId',
                model: "Assignment",
                match: { createdBy: teacher._id },
            }).populate('assignmentId submittedBy.studentId').sort({ createdAt: -1 });

            res.status(200).json({
                message: 'Submitted assignments fetched successfully.',
                teacherAssignments,
            });
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            studentAssignments = await SubmitAssignment.find({
                schoolId: student.schoolId,
                class: student.studentProfile.class,
                section: student.studentProfile.section,
                'submittedBy.studentId': student._id,
            }).populate('assignmentId').select({
                'submittedBy': { $elemMatch: { studentId: student._id } }
            }).sort({ createdAt: -1 });

            if (!studentAssignments.length) {
                return res.status(404).json({ message: 'No assignments were submitted by this student.' });
            }

            res.status(200).json({
                message: 'Submitted assignments of student fetched successfully.',
                studentAssignments,
            });
        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view submitted assignments.',
            });
        };
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while creating the assignment.',
            error: err.message,
        });
    }
};


exports.markAndUpdateAttendance = async (req, res) => {
    try {
        const { date, attendanceRecords } = req.body;
        if (!date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({ message: 'Invalid input, date and attendanceRecords are required.' });
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can mark attendance.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }
        if (!teacher.profile.class || !teacher.profile.section) { return res.status(404).json({ message: "Only class teachers can mark attendance." }) }


        const students = await Student.find({
            schoolId: teacher.schoolId,
            'studentProfile.class': teacher.profile.class,
            'studentProfile.section': teacher.profile.section,
        });
        if (!students.length) {
            return res.status(404).json({ message: 'No students found for the class.' })
        };

        if (attendanceRecords.length !== students.length) {
            return res.status(400).json({ message: 'The number of attendance records does not match the number of students in the class.' });
        }

        const studentIds = students.map(student => student._id.toString());

        const validAttendanceRecords = attendanceRecords.filter(record => studentIds.includes(record.studentId));

        if (validAttendanceRecords.length === 0) {
            return res.status(200).json({ message: 'No attendance records found for the students.' });
        }

        const existingAttendance = await Attendance.findOne({
            schoolId: teacher.schoolId,
            date: new Date(date),
            class: teacher.profile.class,
            section: teacher.profile.section,
            teacherId: teacher._id,
        });

        if (existingAttendance) {
            existingAttendance.attendance = validAttendanceRecords;
            await existingAttendance.save();
            res.status(201).json({ message: 'Attendance updated successfully.', existingAttendance });
        } else {
            const attendance = new Attendance({
                schoolId: teacher.schoolId,
                date: new Date(date),
                class: teacher.profile.class,
                section: teacher.profile.section,
                teacherId: teacher._id,
                attendance: validAttendanceRecords,
            });

            await attendance.save();
            res.status(201).json({ message: 'Attendance marked successfully.', attendance });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while marking attendance.', error: err.message });
    }
};


exports.autoMarkHoliday = async () => {
    try {
        const now = moment().tz("Asia/Kolkata");
        if (now.hour() !== 18) return;

        const today = now.startOf('day').toDate();
        const schools = await School.find();

        for (const school of schools) {
            const teachers = await Teacher.find({ schoolId: school._id });

            for (const teacher of teachers) {
                const students = await Student.find({
                    schoolId: school._id,
                    'studentProfile.class': teacher.profile.class,
                    'studentProfile.section': teacher.profile.section,
                });

                if (!students.length) continue;

                const existingAttendance = await Attendance.findOne({
                    schoolId: school._id,
                    date: today,
                    class: teacher.profile.class,
                    section: teacher.profile.section,
                });

                if (!existingAttendance) {
                    const newAttendance = new Attendance({
                        schoolId: school._id,
                        date: today,
                        teacherId: teacher._id,
                        class: teacher.profile.class,
                        section: teacher.profile.section,
                        attendance: students.map(student => ({
                            studentId: student._id,
                            status: 'Holiday',
                        })),
                    });
                    await newAttendance.save();
                }
            }
        }
        res.status(200).json({ message: 'Attendance auto-marked as "Holiday" for all students.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message })
    }
};


//get monthly attendance of students
exports.viewAttendance = async (req, res) => {
    try {
        const { month, year, date } = req.query;

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can view attendance.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        let startDate, endDate;

        if (date) {
            startDate = new Date(date);
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (year) {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (month) {
            const currentYear = new Date().getFullYear();
            startDate = new Date(currentYear, month - 1, 1);
            endDate = new Date(currentYear, month, 0);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (month && year) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
        }
        else if (!date && !month && !year) {
            const today = new Date();
            startDate = new Date(today.setHours(0, 0, 0, 0));
            endDate = new Date(today.setHours(23, 59, 59, 999));
        }

        const attendance = await Attendance.find({
            schoolId: teacher.schoolId,
            class: teacher.profile.class,
            section: teacher.profile.section,
            date: { $gte: startDate, $lte: endDate },
        })
        if (!attendance.length) {
            return res.status(404).json({ message: 'No attendance record found.' })
        };

        const attendanceWithParentDetails = [];
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalHoliday = 0;
        let totalStudents = 0;

        for (let record of attendance) {
            const studentRecords = record.attendance;
            const studentWithParents = [];

            for (let studentRecord of studentRecords) {
                const studentId = studentRecord.studentId
                const studentDetails = await Student.findById(studentId).select('studentProfile');
                const parent = await Parent.findOne({ 'parentProfile.parentOf': studentId })

                studentWithParents.push({
                    student: studentDetails,
                    status: studentRecord.status,
                    parentProfile: parent.parentProfile
                });

                totalStudents++;
                if (studentRecord.status === "Present") {
                    totalPresent++;
                } else if (studentRecord.status === "Absent") {
                    totalAbsent++;
                } else if (studentRecord.status === "Holiday") {
                    totalHoliday++;
                }
            }
            attendanceWithParentDetails.push({
                date: record.date,
                studentAttendance: studentWithParents,
            });
        }

        const presentPercentage = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

        res.status(200).json({
            message: 'Attendance fetched successfully.',
            attendance: attendanceWithParentDetails,
            summary: {
                total: totalStudents,
                present: totalPresent,
                absent: totalAbsent,
                holiday: totalHoliday,
                presentPercentage: presentPercentage.toFixed(2),
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while fetching attendance.', error: err.message });
    }
};


exports.createOrUpdateTimetable = async (req, res) => {
    try {
        const { monday, tuesday, wednesday, thursday, friday, saturday } = req.body;
        const loggedInId = req.user && req.user.id;

        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can create or update timetables.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const teacherSubjects = teacher.profile.subjects;
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        for (let day of days) {
            if (req.body[day]) {
                for (let periodData of req.body[day]) {
                    let { startTime, endTime, subject, class: className, section } = periodData;

                    if (!teacherSubjects.includes(subject)) {
                        return res.status(403).json({ message: `You are not allowed to create/update timetable for ${subject}.` });
                    }

                    const conflictLecture = await Lectures.findOne({
                        schoolId: teacher.schoolId,
                        teacher: { $ne: teacher._id },
                        [`timetable.${day}`]: {
                            $elemMatch: { class: className, section, startTime, endTime }
                        }
                    }).populate('teacher', 'profile.fullname');

                    if (conflictLecture) {
                        return res.status(400).json({
                            message: `Conflict: ${conflictLecture.teacher.profile.fullname} has a class from ${startTime} to ${endTime} in ${className}${section} on ${day}.`
                        });
                    }

                    const classTimetable = await ClassTimetable.findOne({
                        schoolId: teacher.schoolId,
                        class: className,
                        section: section.toUpperCase(),
                        [`timetable.${day}`]: {
                            $ne: teacher._id
                        }
                    });

                    if (classTimetable) {
                        const dayPeriods = classTimetable.timetable[day] || [];
                        const existingIndex = dayPeriods.findIndex(p =>
                            p.startTime == startTime &&
                            p.endTime == endTime
                        );

                        if (existingIndex > -1) {
                            dayPeriods[existingIndex].subject = subject;
                        } else {
                            dayPeriods.push({
                                startTime,
                                endTime,
                                subject,
                                teacher: teacher._id,
                                class: className,
                                section: section.toUpperCase()
                            });
                        }

                        classTimetable.timetable[day] = dayPeriods;
                        await classTimetable.save();
                    } else {
                        await ClassTimetable.create({
                            schoolId: teacher.schoolId,
                            class: className,
                            section: section.toUpperCase(),
                            timetable: {
                                monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [],
                                [day]: [{
                                    startTime,
                                    endTime,
                                    subject,
                                    teacher: teacher._id
                                }]
                            }
                        });
                    }

                    let teacherTimetable = await Lectures.findOne({ schoolId: teacher.schoolId, teacher: teacher._id });

                    if (!teacherTimetable) {
                        teacherTimetable = new Lectures({
                            teacher: teacher._id,
                            schoolId: teacher.schoolId,
                            timetable: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
                        });
                    }

                    let teacherDayPeriods = teacherTimetable.timetable[day] || [];
                    const teacherIndex = teacherDayPeriods.findIndex(p =>
                        p.startTime == startTime &&
                        p.endTime == endTime &&
                        p.class == className &&
                        p.section == section.toUpperCase()
                    );

                    const newPeriodData = {
                        startTime,
                        endTime,
                        subject,
                        class: className,
                        section: section.toUpperCase()
                    };

                    if (teacherIndex > -1) {
                        teacherDayPeriods[teacherIndex] = newPeriodData;
                    } else {
                        teacherDayPeriods.push(newPeriodData);
                    }

                    teacherTimetable.timetable[day] = teacherDayPeriods;
                    await teacherTimetable.save();
                }
            }
        }

        res.status(200).json({ message: 'Timetable created/updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating or updating the timetable.',
            error: err.message,
        });
    }
};


// compare 12-hour AM/PM format
function compareTimes(a, b) {
    const aDate = convertToDate(a);
    const bDate = convertToDate(b);
    return aDate - bDate;
}

// convert 12-hour AM/PM to Date
function convertToDate(time) {
    const [timePart, modifier] = time.split(' ');  // AM/PM
    const [hours, minutes] = timePart.split(':').map(Number);

    let hours24 = hours;

    if (modifier === 'PM' && hours !== 12) {
        hours24 += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours24 = 0;
    }

    const date = new Date();
    date.setHours(hours24);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}


exports.deleteTimetablePeriod = async (req, res) => {
    try {
        const { periodId } = req.params;
        if (!periodId) { return res.status(400).json({ message: "Provide the period id to delete it." }) }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can create or update timetables.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const teacherSubjects = teacher.profile.subjects;

        const teacherTimetable = await Lectures.findOne({ teacher: teacher._id });
        if (!teacherTimetable) {
            return res.status(404).json({ message: 'Teacher timetable not found.' });
        }

        let foundPeriod = null;
        let foundDay = null;

        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        for (const day of daysOfWeek) {
            const dayTimetable = teacherTimetable.timetable[day];
            const periodIndex = dayTimetable.findIndex(period => period._id.toString() === periodId);
            if (periodIndex !== -1) {
                foundPeriod = dayTimetable[periodIndex];
                foundDay = day;
                dayTimetable.splice(periodIndex, 1);
                break;
            }
        }

        if (!foundPeriod) {
            return res.status(404).json({ message: `Period not found in teacher's timetable.` });
        }

        if (!teacherSubjects.includes(foundPeriod.subject)) {
            return res.status(403).json({ message: `The subject ${foundPeriod.subject} is not part of your teaching subjects.` });
        }

        const { class: className, section, subject } = foundPeriod;

        const classTimetable = await ClassTimetable.findOne({
            schoolId: teacherTimetable.schoolId,
            class: className,
            section: section
        });

        if (!classTimetable) {
            return res.status(404).json({ message: 'Class timetable not found.' });
        }

        const classDayTimetable = classTimetable.timetable[foundDay];
        const classPeriodIndex = classDayTimetable.findIndex(period =>
            period.subject === subject && period.teacher.toString() === teacher._id.toString()
        );

        if (classPeriodIndex === -1) {
            return res.status(404).json({ message: `Period not found in class timetable.` });
        }

        classDayTimetable.splice(classPeriodIndex, 1);

        await teacherTimetable.save();
        await classTimetable.save();

        res.status(200).json({ message: `Period deleted successfully from teacher's and class's timetable.` });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error.", error: err.message })
    }
};


exports.createOnlineLectures = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only logged-in teachers can access.' });
        };

        const { subject, topic, className, section, startDate, startTime, endDate, endTime } = req.body;
        if (!subject || !topic || !className || !section || !startDate || !startTime || !endDate || !endTime) {
            return res.status(400).json({ message: "Please provide all the details to create online lecture." })
        }
        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
        if (!teacher.profile.subjects || teacher.profile.subjects.length === 0 || !teacher.profile.subjects.includes(subject)) {
            return res.status(409).json({ message: `You are not permitted to create online lecture for ${subject} subject` });
        }
        const school = await School.findById(teacher.schoolId);
        if (!school) { return res.status(404).json({ message: 'The teacher is not associated with any school.' }); };

        const students = await Student.find({ schoolId: teacher.schoolId, 'studentProfile.class': className, 'studentProfile.section': section })
        if (!students.length) { return res.status(400).json({ message: "No students found in the selected class and section." }); }

        function generateMeetingLink() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomPart = '';
            for (let i = 0; i < 20; i++) {
                randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return `https://onlinelecture.shikshamitra.com/${randomPart}`;
        }
        const meetingLink = generateMeetingLink();

        const connect = students.map(student => ({ attendant: student._id }));

        const onlineLecture = new OnlineLectures({ schoolId: teacher.schoolId, subject, topic, teacherName: teacher.profile.fullname, class: className, section, startDate, startTime, endDate, endTime, meetingLink, connect, createdBy: teacher._id });
        await onlineLecture.save();

        connect.forEach(att => {
            io().to(`user_${att.attendant}`).emit('onlineLecture:new', {
                meetingId: onlineLecture._id, subject, topic, meetingLink
            });
        });

        let memberIds = students.map(s => ({ memberId: s._id, }));

        const notification = new Notifications({ section: 'onlineLectures', memberIds, text: `New online lecture scheduled for subject - '${subject}'` });
        await notification.save();

        res.status(201).json({ message: `Online lecture for class ${className} ${section} created successfully.`, onlineLecture });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};

function getLectureStatus(lecture) {
    const now = new Date();
    if (!lecture.startDate || !lecture.endDate) return 'Upcoming';

    const start = new Date(lecture.startDate);
    const end = new Date(lecture.endDate);

    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Ongoing';
    return 'Ended';
}

exports.getOnlineLecturesAndTimetable = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let schoolId, teacherClass, teacherSection, socketUserId, studentClass, studentSection, teacherTimetable, classTimetable, onlineLectures;

        const todayIST = moment().tz('Asia/Kolkata').startOf('day').toDate();

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }
            if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }

            schoolId = teacher.schoolId,
                socketUserId = teacher._id,
                teacherClass = teacher.profile.class,
                teacherSection = teacher.profile.section

            onlineLectures = await OnlineLectures.find({ schoolId, createdBy: teacher._id, endDate: { $gte: todayIST } }).select('-connect').sort({ startDate: 1 });

            await OnlineLectures.deleteMany({ endDate: { $lt: todayIST } });

            teacherTimetable = await Lectures.findOne({ schoolId, teacher: socketUserId });

        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            if (!student.schoolId) { return res.status(404).json({ message: 'Student is not associated with any school.' }) }
            schoolId = student.schoolId
            studentClass = student.studentProfile.class,
                studentSection = student.studentProfile.section,
                socketUserId = student._id;

            onlineLectures = await OnlineLectures.find({ schoolId, class: studentClass, section: studentSection, endDate: { $gte: todayIST } }).select('-connect').sort({ startDate: 1 });

        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view the timetable.',
            });
        } const normalizedLectures = onlineLectures.map(lecture => {
            const obj = lecture.toObject();
            obj.status = getLectureStatus(lecture);
            return obj;
        });

        io().to(`user_${socketUserId}`).emit('onlineLecturesUpdated', normalizedLectures);

        classTimetable = await ClassTimetable.findOne({
            $or: [
                { schoolId, class: studentClass, section: studentSection },
                { schoolId, class: teacherClass, section: teacherSection }
            ]
        })
            .populate('timetable.monday.teacher', 'profile.fullname')
            .populate('timetable.tuesday.teacher', 'profile.fullname')
            .populate('timetable.wednesday.teacher', 'profile.fullname')
            .populate('timetable.thursday.teacher', 'profile.fullname')
            .populate('timetable.friday.teacher', 'profile.fullname')
            .populate('timetable.saturday.teacher', 'profile.fullname');

        if (teacherTimetable) {
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach(day => {
                teacherTimetable.timetable[day]?.sort((a, b) => compareTimes(a.startTime, b.startTime));
            });
        }

        if (classTimetable) {
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach(day => {
                classTimetable.timetable[day]?.sort((a, b) => compareTimes(a.startTime, b.startTime));
            });
        }

        if (!teacherTimetable && !classTimetable) { return res.status(200).json({ message: "No timetable found, please create." }) }
        if (!classTimetable) { return res.status(200).json({ message: 'No timetable found for the class.' }) }

        res.status(200).json({
            message: 'Online Lectures and Timetable fetched successfully.', onlineLectures: normalizedLectures, teacherTimetable, classTimetable,
        });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while fetching the timetable.', error: err.message, });
    }
};


exports.getSyllabus = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can access this.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let syllabus = [];

        if (loggedInUser.role === 'admin') {

            var classIs = 1;
            const { className } = req.params;
            if (className) { classIs = className }

            const school = await School.findOne({ userId: loggedInId });
            if (!school) {
                return res.status(404).json({ message: "Admin is not associated with any school." });
            }
            syllabus = await Syllabus.find({ schoolId: school._id, class: classIs });

        } else {
            if (loggedInUser.role === 'teacher') {
                const teacher = await Teacher.findOne({ userId: loggedInId });
                if (!teacher) {
                    return res.status(404).json({ message: 'No teacher found with the logged-in ID.' });
                }

                var classIs = teacher.profile.class;
                const { className } = req.params;
                if (className) { classIs = className }

                const subjectsLower = teacher.profile.subjects.map(subject => subject.toLowerCase());

                syllabus = await Syllabus.find({ schoolId: teacher.schoolId, class: classIs, subject: { $in: subjectsLower } });
            } else if (loggedInUser.role === 'student') {
                const student = await Student.findOne({ userId: loggedInId });
                if (!student) {
                    return res.status(404).json({ message: 'No student found with the logged-in ID.' });
                }
                syllabus = await Syllabus.find({ schoolId: student.schoolId, class: student.studentProfile.class });
            } else if (loggedInUser.role === 'parent') {
                const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf');
                if (!parent) {
                    return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
                }

                let childSyllabus = [];

                for (let child of parent.parentProfile.parentOf) {
                    const student = await Student.findById(child);

                    const syllabuss = await Syllabus.find({ schoolId: student.schoolId, class: student.studentProfile.class });

                    if (syllabuss) {
                        childSyllabus = childSyllabus.concat(syllabuss);
                    }
                }
                syllabus = childSyllabus;
            }
        }

        if (syllabus.length === 0) {
            return res.status(404).json({ message: 'No syllabus found.' });
        }

        return res.status(200).json({ message: 'Syllabus fetched successfully.', syllabus, });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.', error: err.message, });
    }
};


//create study material
exports.uploadStudyMaterial = async (req, res) => {
    try {
        const { subject, chapter, classs, section } = req.body;
        if (!subject || !chapter || !classs || !section) {
            return res.status(400).json({ message: 'Provide all the details and files to upload study material.' })
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can access this.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({
                message: 'Access denied, only teachers have access.',
            });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in id' });
        }
        if (!teacher.profile.subjects.length) {
            return res.status(404).json({ message: "You are not allowed to upload study material." })
        }
        if (!teacher.profile.subjects.includes(req.body.subject)) {
            return res.status(404).json({ message: `You are not allowed to upload study material with subject - ${subject}` })
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

        const studyMaterial = new StudyMaterial({ schoolId: teacher.schoolId, teacherName: teacher.profile.fullname, subject, chapter, class: classs, section, material: uploadedPhotoUrl, createdBy: teacher._id, });
        await studyMaterial.save();


        const students = await Student.find({ schoolId: teacher.schoolId, 'studentProfile.class': classs, 'studentProfile.section': section });
        const memberIds = [
            ...students.map(student => ({ memberId: student._id }))
        ]
        const notification = new Notifications({ section: 'studyMaterial', memberIds, text: `A new study material for the subject '${subject}' has been provided.` });
        await notification.save();

        res.status(201).json({ message: 'Study material uploaded successfully.', studyMaterial });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

//get study material
exports.getStudyMaterial = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can access this.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let schoolId, className, section, creator, teacherMaterial, classMaterial;

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }
            schoolId = teacher.schoolId;
            creator = teacher._id;
            className = teacher.profile.class;
            section = teacher.profile.section
        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId }).populate('userId');
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = student.studentProfile.section;
        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view study materials.',
            });
        };

        teacherMaterial = await StudyMaterial.find({
            schoolId: schoolId,
            createdBy: creator,
        }).sort({ createdAt: -1 });

        classMaterial = await StudyMaterial.find({
            schoolId: schoolId,
            class: className,
            section: section,
        }).sort({ createdAt: -1 });

        if (!teacherMaterial.length && !classMaterial.length) {
            return res.status(404).json({ message: 'Study materials not found.' });
        };

        res.status(200).json({
            message: 'Study materials fetched successfully.',
            teacherMaterial,
            classMaterial,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching the study materials.',
            error: err.message,
        });
    }
};


exports.editStudyMaterial = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can access this.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({
                message: 'Access denied, only teachers have access.',
            });
        }

        const { materialId } = req.params;
        if (!materialId) { return res.status(400).json({ message: "Please provide material id to edit it." }) }

        const updatedData = req.body;
        if (!updatedData.subject && !updatedData.chapter && !updatedData.class && !updatedData.section && !req.file) {
            return res.status(400).json({ message: 'Please provide valid data to update.' })
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in ID.' });
        }

        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                updatedData.material = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        };

        const studyMaterial = await StudyMaterial.findOneAndUpdate({ createdBy: teacher._id, _id: materialId }, updatedData, { new: true });
        if (!studyMaterial) {
            return res.status(404).json({ message: "No material found with the id." })
        }

        res.status(200).json({ message: "Material updated successfully.", studyMaterial })

    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};


//delete study matrial
exports.deleteStudyMaterial = async (req, res) => {
    try {
        const { materialId } = req.params;
        if (!materialId) { return res.status(400).json({ message: "Please provide material id to delete it." }) }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can access this.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({
                message: 'Access denied, only teachers have access.',
            });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in ID.' });
        }

        const studyMaterial = await StudyMaterial.findOneAndDelete({ schoolId: teacher.schoolId, createdBy: teacher._id, _id: materialId });
        if (!studyMaterial) {
            return res.status(404).json({ message: "No material found with the id." })
        }

        res.status(200).json({ message: "Material deleted successfully." })

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


//create exam
exports.createExams = async (req, res) => {
    try {
        const { examType, fromDate, toDate, numberOfSubjects, exam } = req.body;
        if (!examType || !fromDate || !toDate || !numberOfSubjects || !exam.length) {
            return res.status(400).json({ message: 'Provide all the data to create exam.' });
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only logged-in teachers can access.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in ID' });
        }

        if (exam.length > numberOfSubjects || exam.length < numberOfSubjects) {
            return res.status(404).json({ message: `Only ${numberOfSubjects} subjects are allowed to create exam, or change the number to create exam.x` })
        }

        let exams = new Exams({ schoolId: teacher.schoolId, examType, fromDate, toDate, numberOfSubjects, class: teacher.profile.class, section: teacher.profile.section, exam, createdBy: teacher._id, });
        if (!exams.class || !exams.section) {
            return res.status(404).json({ message: "Only class teachers can create exams." })
        }
        await exams.save();

        const students = await Student.find({ schoolId: teacher.schoolId, 'studentProfile.class': teacher.profile.class, 'studentProfile.section': teacher.profile.section })
        const parentUserIds = students.map(student => student.studentProfile.childOf);
        const parents = await Parent.find({ userId: { $in: parentUserIds }, schoolId: teacher.schoolId });

        const uniqueParentIds = [...new Set(parents.map(parent => parent._id.toString()))];

        const memberIds = [
            ...students.map(student => ({ memberId: student._id })),
            ...uniqueParentIds.map(id => ({ memberId: new mongoose.Types.ObjectId(id) })),
        ];
        const notification = new Notifications({ section: 'exams', memberIds, text: `${examType} has been scheduled from ${fromDate}.` });
        await notification.save();

        res.status(201).json({ message: 'Exams created successfully.', exams });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


exports.getExams = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized!' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied!' });
        };

        let schoolId, className, section, exams;
        const currentDate = new Date();

        if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ userId: loggedInId });
            if (!school) {
                return res.status(404).json({ message: "Admin is not associated with any school." });
            }
            exams = await Exams.find({ schoolId: school._id, toDate: { $gte: currentDate } }).sort({ fromDate: 1 });
        }
        else if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with logged-in id.' });
            }
            schoolId = teacher.schoolId;
            className = teacher.profile.class;
            section = teacher.profile.section;
            exams = await Exams.find({ schoolId: schoolId, class: className, section: section, toDate: { $gte: currentDate }, }).sort({ fromDate: 1 });
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'No student found with logged-in id.' });
            }
            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = student.studentProfile.section;
            exams = await Exams.find({ schoolId: schoolId, class: className, section: section, toDate: { $gte: currentDate }, }).sort({ fromDate: 1 });
        }
        else if (loggedInUser.role === 'parent') {
            const parent = await Parent.findOne({ userId: loggedInId });
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with logged-in id.' });
            }

            let allExams = [];
            for (let child of parent.parentProfile.parentOf) {
                const student = await Student.findById(child);

                const childExams = await Exams.find({
                    schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section, toDate: { $gte: currentDate },
                }).sort({ fromDate: 1 });
                allExams = allExams.concat(childExams);
            }
            if (allExams.length === 0) {
                return res.status(404).json({ message: 'No exams found for your children.' });
            }
            return res.status(200).json({ message: 'Exams fetched:', allExams });
        }
        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'No exams found.' });
        }
        return res.status(200).json({ message: 'Exams fetched:', exams });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


exports.editExam = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized!' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Only logged-in teachers have access.' });
        };

        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ message: "Please provide a valid id to edit exam." }) }

        const newData = req.body;
        if (!newData.examType && !newData.fromDate && !newData.toDate && !newData.numberOfSubjects && (!newData.exam || !newData.exam.length)) {
            return res.status(400).json({ message: "Please provide a valid data to update exam." })
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
        if (!teacher.profile.class) { return res.status(403).json({ message: "Only class teachers can edit exam." }) }

        const exam = await Exams.findOneAndUpdate({ _id: id, schoolId: teacher.schoolId, createdBy: teacher._id }, newData, { new: true });
        if (!exam) { return res.status(404).json({ message: "No exam found with the id." }) }

        res.status(201).json({ message: "Exam data updated successfully.", exam });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


exports.deleteExam = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized!' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Only logged-in teachers have access.' });
        };

        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ message: "Please provide a valid id to delete exam." }) }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
        if (!teacher.profile.class) { return res.status(403).json({ message: "Only class teachers can delete exam." }) }

        const exam = await Exams.findOneAndDelete({ _id: id, schoolId: teacher.schoolId, createdBy: teacher._id });
        if (!exam) { return res.status(404).json({ message: "No exam found with the id." }) }

        res.status(200).json({ message: "Exam data delete successfully." });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.createOrUpdateClassPlan = async (req, res) => {
    try {
        const { plan } = req.body;
        if (!plan || !plan.length) {
            return res.status(400).json({ message: 'Provide the data to create class plan.' });
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only logged-in teachers can access.' });
        }

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in ID' });
        }

        let existingPlan = await ClassPlan.findOne({
            schoolId: teacher.schoolId,
            class: teacher.profile.class,
            section: teacher.profile.section,
        });

        if (existingPlan) {
            existingPlan.plan = plan;
            await existingPlan.save();

            return res.status(200).json({
                message: 'Class plan updated successfully.',
                updatedPlan: existingPlan,
            });
        } else {
            let newPlan = new ClassPlan({
                schoolId: teacher.schoolId,
                class: teacher.profile.class,
                section: teacher.profile.section,
                plan,
                createdBy: teacher._id,
            });
            if (!newPlan.class || !newPlan.section) {
                return res.status(404).json({ message: "Only class teachers can create class plan." })
            }

            await newPlan.save();
            res.status(201).json({
                message: 'Class plan created successfully.',
                newPlan,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};

exports.getClassAndSectionFor = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only logged-in teachers can access.' });
        }
        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: "No teacher found with the logged-in id." });
        }

        const timetables = await ClassTimetable.find({ schoolId: teacher.schoolId });

        const assigned = new Set();

        for (const timetable of timetables) {
            const days = Object.keys(timetable.timetable);

            for (const day of days) {
                const slots = timetable.timetable[day];

                if (slots.some(slot => slot.teacher?.toString() === teacher._id.toString())) {
                    assigned.add(`${timetable.class}__${timetable.section}`);
                }
            }
        }

        if (assigned.size === 0) {
            return res.status(404).json({ message: "No class or section class plans found for the teacher." });
        }

        const results = Array.from(assigned).map(entry => {
            const [className, section] = entry.split('__');
            return { class: className, section };
        });

        return res.status(200).json({ assignedClasses: results });

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


//get class and sections for filter from - teacher lectures
exports.getClassPlan = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, only logged-in users can access.' });
        }

        let classPlan;

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: "No teacher found with the logged-in id." });
            }

            const className = req.params.className;
            const section = req.params.section?.toUpperCase();

            if (!className || !section) {
                const targetClass = teacher.profile.class;
                const targetSection = teacher.profile.section;

                classPlan = await ClassPlan.findOne({ schoolId: teacher.schoolId, class: targetClass, section: targetSection });
                if (!classPlan) {
                    return res.status(404).json({ message: "No class plan found for the teacher's assigned class and section." });
                }

            } else {
                const timetable = await ClassTimetable.findOne({ schoolId: teacher.schoolId, class: className, section: section });
                if (!timetable) {
                    return res.status(404).json({ message: "You can't access, as you are not assigned to the specified class and section." });
                }

                const isTeacherAssigned = Object.values(timetable.timetable).some(day =>
                    day.some(slot => slot.teacher?.toString() === teacher._id.toString())
                );

                if (!isTeacherAssigned) {
                    return res.status(403).json({ message: "You can't access, as you are not assigned to the specified class and section." });
                }

                classPlan = await ClassPlan.findOne({ schoolId: teacher.schoolId, class: className, section: section });
                if (!classPlan) {
                    return res.status(404).json({ message: "No class plan found for the specified class and section." });
                }
            }
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId })
            if (!student) { return res.status(404).json({ message: "No student found with the logged-in id." }) }

            classPlan = await ClassPlan.findOne({ schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section })
            if (!classPlan) {
                return res.status(404).json({ message: "No class plan found for the class." });
            }
        }
        else if (loggedInUser.role === 'parent') {
            const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf');
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
            }

            let childClassPlans = [];

            for (let child of parent.parentProfile.parentOf) {
                const student = await Student.findOne({ schoolId: parent.schoolId, _id: child });
                if (!student) {
                    return res.status(404).json({ message: `No children found for the logged-in parent` });
                }

                const childClassPlan = await ClassPlan.findOne({
                    schoolId: student.schoolId,
                    class: student.studentProfile.class,
                    section: student.studentProfile.section,
                });

                if (childClassPlan) {
                    childClassPlans.push(childClassPlan);
                }
            }
            if (childClassPlans.length === 0) {
                return res.status(200).json({ message: "No class plan found for any child." });
            }
            classPlan = childClassPlans;
        }

        res.status(200).json({
            message: 'Class Plan fetched successfully.',
            classPlan,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


exports.getStudentsAndExams = async (req, res) => { // to post results
    try {
        const { classs, section } = req.query;
        if (!classs || !section) {
            return res.status(400).json({ message: "Provide the class and section." })
        }
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser && loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only logged-in teachers can access.' });
        }
        const teacher = await Teacher.findOne({ userId: loggedInId })
        if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }

        if (!teacher.profile.subjects) {
            return res.status(404).json({ message: "You are not allowed to post results." })
        }

        const students = await Student.find({ schoolId: teacher.schoolId, 'studentProfile.class': classs, 'studentProfile.section': section }).select('studentProfile.fullname')
        if (!students.length) {
            res.status(404).json({ message: "No students found in the class." })
        }

        const exams = await Exams.find({ schoolId: teacher.schoolId, class: classs, section: section }).select('examType fromDate toDate').sort({ createdAt: -1 })
        if (!exams.length) {
            res.status(404).json({ message: "No exams found for this class." })
        }
        res.status(200).json({ exams, students })
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


exports.createResults = async (req, res) => {
    try {
        const { classs, section, exam, student, result } = req.body;
        if (!classs || !section || !exam || !student || !result) {
            return res.status(404).json({ message: 'Provide all the data to post result for student.' })
        };
        let sectionIs = section.toUpperCase()

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized!' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only loggedin teachers can access.' })
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) { return res.status(404).json({ message: 'No teacher found with the logged-in id.' }) };

        const existingExam = await Exams.findOne({ examType: exam, schoolId: teacher.schoolId, class: classs, section: sectionIs });
        if (!existingExam) { return res.status(404).json({ message: 'No exam found with the exam type.' }) };

        for (let r of result) {
            const subject = existingExam.exam.find(e => e.subject.toLowerCase() === r.subject.toLowerCase());
            if (!subject) { return res.status(400).json({ message: `No subject found in the exam to post results for ${r.subject}.` }); }

            if (!teacher.profile.subjects.includes(r.subject)) {
                return res.status(404).json({ message: `You are not allowed to post marks for ${r.subject} subject.` });
            }
            r.subjectCode = subject.subjectCode;
            r.createdBy = teacher._id;
        }

        let memberIds = [];

        const existingStudent = await Student.findOne({ 'studentProfile.fullname': student, schoolId: existingExam.schoolId, 'studentProfile.class': existingExam.class, 'studentProfile.section': existingExam.section });
        if (!existingStudent) {
            return res.status(404).json({ message: 'No student found in this class.' })
        };

        let results = await Results.findOne({ schoolId: existingStudent.schoolId, class: classs, section: section, exam: existingExam._id, student: existingStudent._id });
        if (!results) {
            results = new Results({ schoolId: existingStudent.schoolId, class: classs, section: section, exam: existingExam._id, student: existingStudent._id, result: [], total: '-', totalPercentage: '-' });
        }

        if (results.result.length === existingExam.numberOfSubjects) {
            return res.status(400).json({ message: 'All subject results have already been posted. No more results can be added.' });
        }

        for (let r of result) {
            const existingSubject = results.result.find(existing => existing.subject.toLowerCase() === r.subject.toLowerCase());
            if (existingSubject) {
                return res.status(400).json({ message: `Result for ${r.subject} has already been posted.` });
            }
            results.result.push(r);
        }

        if (results.result.length === existingExam.numberOfSubjects) {
            let marksObtained = 0, totalMarks = 0;

            results.result.forEach(r => {
                marksObtained += r.marksObtained;
                totalMarks += r.totalMarks;
            });
            const totalPercentage = totalMarks > 0 ? ((marksObtained / totalMarks) * 100).toFixed(2) + '%' : '-';
            results.total = `${marksObtained}/${totalMarks}`;
            results.totalPercentage = totalPercentage;
        }
        await results.save();

        const parent = await Parent.findOne({ userId: existingStudent.studentProfile.childOf, schoolId: teacher.schoolId });
        memberIds.push({ memberId: parent._id });
        memberIds.push({ memberId: existingStudent._id })

        const notification = new Notifications({ section: 'results', memberIds, text: `Result for '${exam}' has been posted.` });
        await notification.save();

        res.status(201).json({ message: 'Results submitted successfully.', results });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message })
    }
};


exports.getResults = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, only loggedin users can access.' })
        };

        let result, banner, totalExams, attendedExams, pendingExams, examsPercentage, attendance, present, absent, attendancePercentage, totalMarks, marksObtained, remainingMarks, marksPercentage, performancePercentage

        if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ userId: loggedInId })
            banner = school.schoolBanner
            result = await Results.find({ schoolId: school._id, total: { $ne: '-' }, totalPercentage: { $ne: '-' } })
                .populate('student exam').sort({ createdAt: -1 })
            if (!result.length) { res.status(404).json({ message: "No results found" }) }
        }
        else if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId', 'schoolBanner');
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
            };
            banner = teacher.schoolId.schoolBanner;
            if (!teacher.profile.class || !teacher.profile.section) {
                return res.status(404).json({ message: "You do not have access to get results." })
            }

            result = await Results.find({ schoolId: teacher.schoolId, result: { $elemMatch: { createdBy: teacher._id } } }).populate('student').populate('exam', 'examType').sort({ createdAt: -1 });
            if (result.length === 0) {
                return res.status(404).json({ message: 'No results found for the class.' })
            };
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId }).populate('schoolId', 'schoolBanner').populate('userId', 'isActive')
            if (!student) {
                return res.status(404).json({ message: "No student found with the logged-in id." })
            }
            banner = student.schoolId.schoolBanner
            result = await Results.find({ schoolId: student.schoolId, student: student._id }).populate('student').populate('exam', 'examType').sort({ createdAt: -1 })
            if (!result.length) { return res.status(404).json({ message: "No results yet." }) }

            totalExams = await Exams.countDocuments({ schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section });
            attendedExams = await Results.countDocuments({ total: { $ne: '-' }, schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section, student: student._id });
            pendingExams = totalExams - attendedExams;
            examsPercentage = ((attendedExams / totalExams) * 100).toFixed(2);

            let marks = await Results.find({ total: { $ne: '-' }, schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section, student: student._id });
            totalMarks = 0, marksObtained = 0;
            for (let mark of marks) {
                let parts = mark.total.split('/');
                if (parts.length === 2) {
                    let numerator = parseFloat(parts[0])
                    let denominator = parseFloat(parts[1]);

                    marksObtained += numerator;
                    totalMarks += denominator;
                }
            }
            remainingMarks = totalMarks - marksObtained
            marksPercentage = ((marksObtained / totalMarks) * 100).toFixed(2);

            attendance = await Attendance.countDocuments({
                schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section,
                attendance: { $elemMatch: { studentId: student._id } }
            });
            present = await Attendance.countDocuments({
                schoolId: student.schoolId, class: student.studentProfile.class, section: student.studentProfile.section,
                attendance: { $elemMatch: { studentId: student._id, status: 'Present' } }
            });
            absent = attendance - present;
            attendancePercentage = ((present / attendance) * 100).toFixed(2);

            performancePercentage = ((Number(examsPercentage) + Number(marksPercentage) + Number(attendancePercentage)) / 3).toFixed(2);
        }
        else if (loggedInUser.role === 'parent') {
            const parent = await Parent.findOne({ userId: loggedInId }).populate('schoolId', 'schoolBanner');
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
            }
            banner = parent.schoolId.schoolBanner

            const { studentName } = req.params;
            const students = await Student.find({ _id: { $in: parent.parentProfile.parentOf } });

            let selectedStudent;
            if (studentName) {
                selectedStudent = students.find(student => student.studentProfile.fullname === studentName);
                if (!selectedStudent) {
                    return res.status(404).json({ message: 'No student found with the provided name.' });
                }
            } else {
                selectedStudent = students[0];
            }
            result = await Results.find({ student: selectedStudent._id }).populate('student', 'studentProfile').populate('exam', 'examType fromDate toDate').sort({ createdAt: -1 });
            if (result.length === 0) {
                return res.status(200).json({ message: 'No results found for the student.' });
            }
        }
        else {
            res.status(404).json({ message: 'You are not allowed to access this.' })
        }
        res.status(200).json({ message: 'Results fetched successfully.', totalExams, attendedExams, pendingExams, examsPercentage, attendance, present, absent, attendancePercentage, totalMarks, marksObtained, remainingMarks, marksPercentage, performancePercentage, banner, result });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message, })
    }
};


exports.getResultById = async (req, res) => {
    try {
        const { resultId } = req.params
        if (!resultId) {
            return res.status(400).json({ message: "Provide result id to get data." })
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, only loggedin users can access.' })
        };

        let result, banner

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId');
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
            };
            if (!teacher.profile.class || !teacher.profile.section) {
                return res.status(404).json({ message: "You do not have access to get results." })
            }
            banner = teacher.schoolId.schoolBanner

            result = await Results.findOne({ _id: resultId, schoolId: teacher.schoolId, class: teacher.profile.class, section: teacher.profile.section, }).populate('student').populate('exam', 'examType');
            if (result.length === 0) {
                return res.status(404).json({ message: 'No results found for the class.' })
            };
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId }).populate('schoolId').populate('userId', 'isActive')
            if (!student) {
                return res.status(404).json({ message: "No student found with the logged-in id." })
            }
            banner = student.schoolId.schoolBanner;

            result = await Results.findOne({ _id: resultId, student: student._id }).populate('student').populate('exam', 'examType')
            if (!result) { return res.status(404).json({ message: "No result data found." }) }
        }
        else if (loggedInUser.role === 'parent') {
            const parent = await Parent.findOne({ userId: loggedInId }).populate('schoolId');
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
            }
            banner = parent.schoolId.schoolBanner

            const { studentName } = req.params;
            const students = await Student.find({ _id: { $in: parent.parentProfile.parentOf } });

            let selectedStudent;
            if (studentName) {
                selectedStudent = students.find(student => student.studentProfile.fullname === studentName);
                if (!selectedStudent) {
                    return res.status(404).json({ message: 'No student found with the provided name.' });
                }
            } else {
                selectedStudent = students[0];
            }
            result = await Results.findOne({ _id: resultId, student: selectedStudent._id }).populate('student', 'studentProfile').populate('exam', 'examType');
        }
        else {
            res.status(404).json({ message: 'You are not allowed to access this.' })
        }
        res.status(200).json({ message: 'Result data fetched successfully.', result, banner });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        })
    }
};


exports.editResult = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' })
        };
        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only logged-in teachers can access.' })
        };

        let resultIs
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ message: "Please provide a valid id to edit result." }) }

        const { classs, section, exam, student, result } = req.body;
        if (!classs && !section && !exam && !student && !result) {
            return res.status(404).json({ message: 'Please provide new data to edit result of student.' })
        };
        let sectionIs;
        if (section) sectionIs = section.toUpperCase();
        const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId', 'schoolBanner');
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
        };

        resultIs = await Results.findOne({ _id: id, schoolId: teacher.schoolId, result: { $elemMatch: { createdBy: teacher._id } } }).populate('student').populate('exam', 'examType');
        if (!resultIs) { return res.status(404).json({ message: 'No result found with the id.' }) };

        if (classs) resultIs.class = classs;
        if (section) resultIs.section = sectionIs;

        let examToUse = await Exams.findById(resultIs.exam);

        if (exam) {
            examToUse = await Exams.findOne({
                examType: exam,
                schoolId: teacher.schoolId,
                class: classs || resultIs.class,
                section: sectionIs || resultIs.section,
            });
            if (!examToUse) {
                return res.status(404).json({ message: 'No exam found with the provided exam type.' });
            }
            resultIs.exam = examToUse._id;
        }

        if (student) {
            const existingStudent = await Student.findOne({
                'studentProfile.fullname': student,
                schoolId: teacher.schoolId,
                'studentProfile.class': classs || resultIs.class,
                'studentProfile.section': sectionIs || resultIs.section
            });

            if (!existingStudent) {
                return res.status(404).json({ message: 'No student found matching the provided data.' });
            }

            resultIs.student = existingStudent._id;
        }
        if (Array.isArray(result) && result.length > 0) {
            for (let newRes of result) {
                const examSubject = examToUse.exam.find(
                    e => e.subject.toLowerCase() === newRes.subject.toLowerCase()
                );
                if (!examSubject) {
                    return res.status(400).json({ message: `Subject ${newRes.subject} not found in the exam.` });
                }
                if (!teacher.profile.subjects.includes(newRes.subject)) {
                    return res.status(403).json({ message: `You are not allowed to edit results for ${newRes.subject}.` });
                }
                const existingIndex = resultIs.result.findIndex(
                    r => r.subject.toLowerCase() === newRes.subject.toLowerCase()
                );
                if (existingIndex === -1) {
                    return res.status(404).json({ message: `Result for ${newRes.subject} not found to update.` });
                }
                if (resultIs.result[existingIndex].createdBy.toString() !== teacher._id.toString()) {
                    return res.status(403).json({ message: `You are not allowed to edit result for ${newRes.subject}.` });
                }
                resultIs.result[existingIndex].marksObtained = newRes.marksObtained ?? resultIs.result[existingIndex].marksObtained;
                resultIs.result[existingIndex].totalMarks = newRes.totalMarks ?? resultIs.result[existingIndex].totalMarks;
                resultIs.result[existingIndex].grade = newRes.grade ? newRes.grade.toUpperCase() : resultIs.result[existingIndex].grade;
                resultIs.result[existingIndex].subjectCode = examSubject.subjectCode;
            }
            if (resultIs.result.length === examToUse.numberOfSubjects) {
                let marksObtained = 0, totalMarks = 0;
                resultIs.result.forEach(r => {
                    marksObtained += r.marksObtained;
                    totalMarks += r.totalMarks;
                });
                const totalPercentage = totalMarks > 0
                    ? ((marksObtained / totalMarks) * 100).toFixed(2) + '%'
                    : '-';
                resultIs.total = `${marksObtained}/${totalMarks}`;
                resultIs.totalPercentage = totalPercentage;
            }
        }
        await resultIs.save();
        res.status(200).json({
            message: 'Results updated successfully.',
            result: resultIs
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message
        });
    }
};


exports.getTeacherDashboard = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only logged-in teachers have access.' });
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
        };

        const students = await Student.find({ schoolId: teacher.schoolId, 'studentProfile.class': teacher.profile.class, 'studentProfile.section': teacher.profile.section }).populate('userId');
        if (!students.length) {
            return res.status(404).json({ message: 'No students found in the class.' })
        };

        let male = 0, female = 0, active = 0, inactive = 0;

        for (let student of students) {
            if (student.studentProfile.gender == 'male') { male += 1 }
            else { female += 1 }
            if (student.userId.isActive) { active += 1 }
            else { inactive += 1 }
        }

        const exams = await Exams.find({ schoolId: teacher.schoolId, class: teacher.profile.class, section: teacher.profile.section });
        if (!exams.length) {
            return res.status(404).json({ message: 'No exams found for this class.' })
        };

        res.status(200).json({
            message: 'Teacher dashboard data:',
            totalStudents: students.length,
            totalExams: exams.length,
            male,
            female,
            active,
            inactive
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};


exports.requestExpense = async (req, res) => {
    try {
        const { item, purpose } = req.body;
        if (!purpose) {
            return res.status(400).json({ message: 'Please provide purpose to request.' })
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        };
        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(404).json({ message: "Access denied, only logged-in class teachers have access." })
        }

        const teacher = await Teacher.findOne({ userId: loggedInId })
        if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
        if (!teacher.profile.class || !teacher.profile.section) { return res.status(404).json({ message: "Only class teachers have access." }) }


        const newExpense = new RequestExpense({
            schoolId: teacher.schoolId, item, purpose, class: teacher.profile.class, section: teacher.profile.section, createdBy: teacher._id
        });
        await newExpense.save()

        let memberIds = [];

        const school = await School.findById(teacher.schoolId);
        if (school && school.userId) {
            memberIds.push({ memberId: school.userId });
        }

        const teachers = await Teacher.find({ schoolId: teacher.schoolId }).populate('userId');

        const accountant = teachers.find(t => t.userId && t.userId.employeeType === 'accountant')
        if (accountant) {
            memberIds.push({ memberId: accountant._id });
        }

        const notification = new Notifications({ section: 'expenseRequest', memberIds: memberIds, text: `You have received a New expense request from teacher - ${teacher.profile.fullname}` });
        await notification.save()

        res.status(201).json({ message: "Item request created successfully, please wait until the management confirms.", newExpense })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};


exports.getTeacherExpenseRequests = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can edit their profiles.' });
        };

        const teacher = await Teacher.findOne({ userId: loggedInId })
        if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }

        const teacherRequests = await RequestExpense.find({ schoolId: teacher.schoolId, createdBy: teacher._id }).sort({ createdAt: -1 })
        if (!teacherRequests.length) { return res.status(200).json({ message: "No requests yet." }) }

        res.status(200).json({ teacherRequests })
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        })
    }
};


exports.editTeacherExpenseRequests = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can edit their profiles.' });
        };

        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ message: "Please provide a valid id to edit expense request." }) }

        const { item, purpose } = req.body;
        if (!item && !purpose) { return res.status(400).json({ message: "Please provide item name or purpose to edit expense request." }) }

        const teacher = await Teacher.findOne({ userId: loggedInId })
        if (!teacher) { return res.status(404).json({ message: "No employee found with the logged-in id." }) }

        const expenseRequest = await RequestExpense.findOne({ _id: id, schoolId: teacher.schoolId, createdBy: teacher._id });
        if (!expenseRequest) { return res.status(200).json({ message: "No expense found with the id." }) }
        if (expenseRequest.status !== 'pending') {
            return res.status(403).json({ message: "The status of your request has already been updated, now you are not allowed to edit it." })
        }
        if (item) { expenseRequest.item = item }
        if (purpose) { expenseRequest.purpose = purpose }
        await expenseRequest.save();

        res.status(200).json({ message: "Expense request updated successfully.", expenseRequest })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};

exports.getTeacherAccounts = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(404).json({ message: "Access denied, only logged-in class teachers have access." });
        }
        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: "No teacher found with the logged-in id." });
        }
        if (!teacher.profile.class || !teacher.profile.section) {
            return res.status(404).json({ message: "Only class teachers have access." });
        }

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        let monthlyData = {};

        let expenses = await RequestExpense.find({ schoolId: teacher.schoolId, createdBy: teacher._id, status: 'success' });

        for (let expense of expenses) {
            const expenseDate = new Date(expense.createdAt);
            const monthName = months[expenseDate.getMonth()];
            const year = expenseDate.getFullYear();
            const monthYear = `${monthName} ${year}`;

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { classIncome: 0, classExpense: 0 };
            }
            monthlyData[monthYear].classExpense += expense.amount;
        }

        let income1 = await ParentExpenses.find({ schoolId: teacher.schoolId, class: teacher.profile.class, section: teacher.profile.section, purpose: "Fees", 'paymentDetails.status': "success" });
        let income2 = await SchoolIncome.find({ schoolId: teacher.schoolId, purpose: 'Fees' });
        let incomes = income1.concat(income2)

        for (let income of incomes) {
            const incomeDate = new Date(income.createdAt);
            const monthName = months[incomeDate.getMonth()];
            const year = incomeDate.getFullYear();
            const monthYear = `${monthName} ${year}`;

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { classIncome: 0, classExpense: 0 };
            }
            monthlyData[monthYear].classIncome += income.amount;
        }

        const result = Object.keys(monthlyData).map(key => ({
            monthYear: key,
            classIncome: monthlyData[key].classIncome,
            teacherExpense: monthlyData[key].classExpense,
        })).sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

        res.status(200).json({ accounts: result });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};

