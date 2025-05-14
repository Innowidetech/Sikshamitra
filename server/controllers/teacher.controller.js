const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Assignment = require('../models/assignment')
const assignmentTemplate = require('../utils/assignmentTemplate');
const Attendance = require('../models/Attendance');
const moment = require('moment-timezone');
const Syllabus = require('../models/Syllabus');
const StudyMaterial = require('../models/StudyMaterial');
const cloudinary = require('cloudinary').v2;
const { uploadImage } = require('../utils/multer');
const Exams = require('../models/Exams');
const Results = require('../models/Results');
const School = require('../models/School');
const Book = require('../models/Books');
const BookRequests = require('../models/BookRequests');
const ClassPlan = require('../models/ClassPlan');
const SubmitAssignment = require('../models/SubmitAssignment');
const Lectures = require('../models/Lectures');
const ClassTimetable = require('../models/Timetable');
const ClassExpenses = require('../models/ClassExpenses');
const ParentExpenses = require('../models/ParentExpenses');
const { sendEmail } = require('../utils/sendEmail');



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
            return res.status(404).json({ message: "No students found for this school, class, and section." });
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
        const { assignmentName, classs, section, subject, chapter, startDate, endDate } = req.body;
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

        const newAssignment = new Assignment({
            schoolId: teacher.schoolId,
            assignmentName,
            teacherName: teacher.profile.fullname,
            class: classs,
            section,
            subject,
            chapter,
            startDate,
            endDate,
            assignment: uploadedPhotoUrl,
            createdBy: teacher._id,
        });

        await newAssignment.save();

        schoolName = teacher.schoolId.schoolName
        teacherEmail = loggedInUser.email
        teacherName = teacher.profile.fullname

        const students = await Student.find({ schoolId: teacher.schoolId._id, 'studentProfile.class': classs, 'studentProfile.section': section }).populate('userId')

        for (let student of students) {
            studentsEmails = student.userId.email
            studentName = student.studentProfile.fullname
            await sendEmail(studentsEmails, teacherEmail, `New Assignment - ${subject}`, assignmentTemplate(studentName, assignmentName, subject, teacherName, chapter, startDate, endDate))
        }

        res.status(201).json({
            message: 'Assignment created successfully.',
            newAssignment,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while creating the assignment.',
            error: err.message,
        });
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

// exports.markAndUpdateAttendance = async (req, res) => {
//     try {
//         const { date, status, studentId } = req.body;
//         // const {studentId} = req.params

//         if (!date || !status || !studentId) {
//             return res.status(400).json({ message: 'Date, status, and studentId are required to mark attendance.' });
//         }

//         const loggedInId = req.user && req.user.id;
//         if (!loggedInId) {
//             return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
//         }

//         const loggedInUser = await User.findById(loggedInId);
//         if (!loggedInUser || loggedInUser.role !== 'teacher') {
//             return res.status(403).json({ message: 'Access denied. Only class teachers can mark attendance.' });
//         }

//         const teacher = await Teacher.findOne({ userId: loggedInId });
//         if (!teacher) {
//             return res.status(404).json({ message: 'Teacher not found.' });
//         }

//         const students = await Student.find({
//             schoolId:teacher.schoolId,
//             'studentProfile.class': teacher.profile.class,
//             'studentProfile.section': teacher.profile.section,
//         });
//         if (!students.length) {
//             return res.status(404).json({ message: 'No students found for the class.' })
//         };

//         const validStudent = students.find(s => s._id.toString() === studentId);
//         if (!validStudent) {
//             return res.status(400).json({ message: 'Invalid studentId for this class and section.' });
//         }

//         const existingAttendance = await Attendance.findOne({
//             schoolId:teacher.profile.schoolId,
//             date: new Date(date),
//             teacherId: teacher._id,
//             class: teacher.profile.class,
//             section: teacher.profile.section,
//         });

//         if (existingAttendance) {
//             const attendanceIndex = existingAttendance.attendance.findIndex(a => a.studentId.toString() === studentId);

//             if (attendanceIndex !== -1) {
//                 existingAttendance.attendance[attendanceIndex].status = status;
//             }
//             await existingAttendance.save();
//             return res.status(200).json({ message: 'Attendance updated successfully.', attendance: existingAttendance });
//         } 
//         else {
//             const newAttendance = new Attendance({
//                 schoolId:teacher.profile.schoolId,
//                 date: new Date(date),
//                 teacherId: teacher._id,
//                 class: teacher.profile.class,
//                 section: teacher.profile.section,
//                 attendance: students.map(student => ({
//                     studentId: student._id,
//                     status: student._id.toString() === studentId ? status : 'Absent',
//                 })),
//             });

//             await newAttendance.save();
//             return res.status(201).json({ message: 'Attendance marked successfully.', attendance: newAttendance });
//         }
//     } catch (err) {
//         res.status(500).json({ message: 'An error occurred while marking attendance.', error: err.message });
//     }
// };


// exports.autoMarkHoliday = async () => {
//     try {
//         const now = moment().tz("Asia/Kolkata");
//         if (now.hour() !== 18) return;

//         const today = now.startOf('day').toDate();
//         const schools = await School.find();

//         for (const school of schools) {
//             const teachers = await Teacher.find({ schoolId: school._id });

//             for (const teacher of teachers) {
//                 const students = await Student.find({
//                     schoolId: school._id,
//                     'studentProfile.class': teacher.profile.class,
//                     'studentProfile.section': teacher.profile.section,
//                 });

//                 if (!students.length) continue;

//                 const existingAttendance = await Attendance.findOne({
//                     schoolId: school._id,
//                     date: today,
//                     class: teacher.profile.class,
//                     section: teacher.profile.section,
//                 });

//                 if (!existingAttendance) {
//                     const newAttendance = new Attendance({
//                         schoolId: school._id,
//                         date: today,
//                         teacherId: teacher._id,
//                         class: teacher.profile.class,
//                         section: teacher.profile.section,
//                         attendance: students.map(student => ({
//                             studentId: student._id,
//                             status: 'Holiday',
//                         })),
//                     });
//                     await newAttendance.save();
//                 }
//             }
//         }
//         res.status(200).json({ message: 'Attendance auto-marked as "Holiday" for all students.' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error.', error: err.message })
//     }
// };


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
        let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let classTimetableUpdate = {};
        let teacherTimetableUpdate = {};

        for (let day of days) {
            if (req.body[day]) {
                for (let periodData of req.body[day]) {
                    let { startTime, endTime, subject, class: className, section } = periodData;

                    if (!teacherSubjects.includes(subject)) {
                        return res.status(403).json({ message: `You are not allowed to create/update timetable for ${subject} subject.` });
                    }

                    let existingLecture = await Lectures.findOne({
                        schoolId: teacher.schoolId,
                        [`timetable.${day}`]: {
                            $elemMatch: { class: className, section, startTime, endTime }
                        }
                    }).populate('teacher', 'profile.fullname');

                    if (existingLecture) {
                        return res.status(400).json({
                            message: `Conflict: ${existingLecture.teacher.profile.fullname} teacher has already scheduled a class from ${startTime} to ${endTime} in ${className} section ${section} on ${day}.`
                        });
                    }

                    let classTimetable = await ClassTimetable.findOne({
                        schoolId: teacher.schoolId,
                        class: className,
                        section: section.toUpperCase()
                    });

                    if (classTimetable) {
                        for (let period of classTimetable.timetable[day]) {
                            if (period.startTime === startTime && period.endTime === endTime) {
                                return res.status(400).json({
                                    message: `Conflict: This time slot is already booked for class ${className} section ${section} on ${day}.`
                                });
                            }
                        }
                    }

                    if (!classTimetableUpdate[day]) {
                        classTimetableUpdate[day] = [];
                    }

                    classTimetableUpdate[day].push({
                        startTime,
                        endTime,
                        subject,
                        teacher: teacher._id,
                        class: className,
                        section: section.toUpperCase()
                    });

                    if (!teacherTimetableUpdate[day]) {
                        teacherTimetableUpdate[day] = [];
                    }

                    teacherTimetableUpdate[day].push({
                        startTime,
                        endTime,
                        subject,
                        class: className,
                        section: section.toUpperCase()
                    });
                }
            }
        }

        for (let day of days) {
            if (classTimetableUpdate[day] && classTimetableUpdate[day].length > 0) {
                for (let periodData of classTimetableUpdate[day]) {
                    let { class: className, section } = periodData;

                    let classTimetable = await ClassTimetable.findOne({
                        schoolId: teacher.schoolId,
                        class: className,
                        section: section.toUpperCase()
                    });

                    if (!classTimetable) {
                        classTimetable = new ClassTimetable({
                            schoolId: teacher.schoolId,
                            class: className,
                            section: section.toUpperCase(),
                            timetable: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
                        });
                    }

                    classTimetable.timetable[day].push(periodData);
                    await classTimetable.save();
                }
            }
        }

        let teacherTimetable = await Lectures.findOne({ schoolId: teacher.schoolId, teacher: teacher._id });

        if (!teacherTimetable) {
            teacherTimetable = new Lectures({
                teacher: teacher._id,
                schoolId: teacher.schoolId,
                timetable: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
            });
        }

        for (let day of days) {
            if (teacherTimetableUpdate[day] && teacherTimetableUpdate[day].length > 0) {
                let dayTimetable = teacherTimetable.timetable[day] || [];

                for (let periodData of teacherTimetableUpdate[day]) {
                    const { startTime, endTime, class: className, section } = periodData;

                    let existingPeriod = dayTimetable.find(
                        (period) =>
                            period.startTime === startTime &&
                            period.endTime === endTime &&
                            period.class === className &&
                            period.section === section.toUpperCase()
                    );

                    if (existingPeriod) {
                        Object.assign(existingPeriod, periodData);
                    } else {
                        dayTimetable.push(periodData);
                    }
                }

                teacherTimetable.timetable[day] = dayTimetable;
            }
        }
        await teacherTimetable.save();

        res.status(200).json({ message: 'Timetable created/updated successfully.' });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while creating or updating the timetable.',
            error: err.message,
        });
    }
};

exports.getTimetable = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let schoolId, teacherId, teacherClass, teacherSection, studentId, studentClass, studentSection, teacherTimetable, classTimetable;

        if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }
            schoolId = teacher.schoolId,
                teacherId = teacher._id,
                teacherClass = teacher.profile.class,
                teacherSection = teacher.profile.section

        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            schoolId = student.schoolId
            studentId = student._id,
                studentClass = student.studentProfile.class,
                studentSection = student.studentProfile.section

        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view the timetable.',
            });
        }

        teacherTimetable = await Lectures.findOne({ schoolId, teacher: teacherId });

        if (teacherTimetable) {
            teacherTimetable.timetable.monday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            teacherTimetable.timetable.tuesday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            teacherTimetable.timetable.wednesday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            teacherTimetable.timetable.thursday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            teacherTimetable.timetable.friday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            teacherTimetable.timetable.saturday.sort((a, b) => compareTimes(a.startTime, b.startTime));
        }

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

        if (classTimetable) {
            classTimetable.timetable.monday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            classTimetable.timetable.tuesday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            classTimetable.timetable.wednesday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            classTimetable.timetable.thursday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            classTimetable.timetable.friday.sort((a, b) => compareTimes(a.startTime, b.startTime));
            classTimetable.timetable.saturday.sort((a, b) => compareTimes(a.startTime, b.startTime));
        }
        if (!teacherTimetable && !classTimetable) { return res.status(200).json({ message: "No timetable found, please create." }) }
        if (!classTimetable) { return res.status(200).json({ message: 'No timetable found for the class.' }) }

        res.status(200).json({
            message: 'Timetable fetched successfully.',
            teacherTimetable,
            classTimetable,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching the timetable.',
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
            return res.status(404).json({ message: `Period with ID ${periodId} not found in teacher's timetable.` });
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
            return res.status(404).json({ message: `Period with ID ${periodId} not found in class timetable.` });
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
            const school = await School.findOne({ createdBy: loggedInId });
            if (!school) {
                return res.status(404).json({ message: "Admin is not associated with any school." });
            }
            syllabus = await Syllabus.find({ schoolId: school._id });
            syllabus.sort((a, b) => (a.class) - (b.class));

        } else {
            if (loggedInUser.role === 'teacher') {
                const teacher = await Teacher.findOne({ userId: loggedInId });
                if (!teacher) {
                    return res.status(404).json({ message: 'No teacher found with the logged-in ID.' });
                }
                syllabus = await Syllabus.findOne({ schoolId: teacher.schoolId, class: teacher.profile.class });
                syllabus = syllabus ? [syllabus] : [];
            } else if (loggedInUser.role === 'student') {
                const student = await Student.findOne({ userId: loggedInId });
                if (!student) {
                    return res.status(404).json({ message: 'No student found with the logged-in ID.' });
                }
                syllabus = await Syllabus.findOne({ schoolId: student.schoolId, class: student.studentProfile.class });
                syllabus = syllabus ? [syllabus] : [];
            } else if (loggedInUser.role === 'parent') {
                const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf');
                if (!parent) {
                    return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
                }

                let childSyllabus = [];

                for (let child of parent.parentProfile.parentOf) {
                    const student = await Student.findById(child);

                    const syllabuss = await Syllabus.findOne({
                        schoolId: student.schoolId,
                        class: student.studentProfile.class,
                    }).sort({ createdAt: -1 });

                    if (syllabuss) {
                        childSyllabus = childSyllabus.concat(syllabuss);
                    }
                }
                syllabus = childSyllabus;
            }
        }

        syllabus = Array.isArray(syllabus) ? syllabus : [];
        syllabus = syllabus.filter(item => item !== null);

        if (syllabus.length === 0) {
            return res.status(404).json({ message: 'No syllabus yet.' });
        }

        return res.status(200).json({
            message: 'Syllabus fetched successfully.',
            syllabus,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
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

        const studyMaterial = new StudyMaterial({
            schoolId: teacher.schoolId,
            teacherName: teacher.profile.fullname,
            subject,
            chapter,
            class: classs,
            section,
            material: uploadedPhotoUrl,
            createdBy: teacher._id,
        });

        await studyMaterial.save();

        res.status(201).json({
            message: 'Study material uploaded successfully.',
            studyMaterial,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
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
            if (student.userId.isActive == 'false') {
                return res.status(404).json({ message: "Please contact your class teacher or admin to get data." })
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
        const { examType, examDuration, fromDate, toDate, numberOfSubjects, exam } = req.body;
        if (!examType || !examDuration || !fromDate || !toDate || !numberOfSubjects || !exam.length) {
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

        let exams = new Exams({
            schoolId: teacher.schoolId,
            examType,
            examDuration,
            fromDate,
            toDate,
            numberOfSubjects,
            class: teacher.profile.class,
            section: teacher.profile.section,
            exam,
            createdBy: teacher._id,
        });
        if (!exams.class || !exams.section) {
            return res.status(404).json({ message: "Only class teachers can create exams." })
        }

        await exams.save();

        res.status(201).json({
            message: 'Exams created successfully.',
            exams,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
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
            const school = await School.findOne({ createdBy: loggedInId });
            if (!school) {
                return res.status(404).json({ message: "Admin is not associated with any school." });
            }
            exams = await Exams.find({ schoolId: school._id, toDate: { $gte: currentDate } }).sort({ toDate: 1 });
        }
        else if (loggedInUser.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with logged-in id.' });
            }
            schoolId = teacher.schoolId;
            className = teacher.profile.class;
            section = teacher.profile.section;
            exams = await Exams.find({
                schoolId: schoolId,
                class: className,
                section: section,
                toDate: { $gte: currentDate },
            }).sort({ toDate: 1 });
        }

        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'No student found with logged-in id.' });
            }
            if (student.userId.isActive == 'false') {
                return res.status(404).json({ message: "Please contact your class teacher or admin to get exams data." })
            }
            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = student.studentProfile.section;
            exams = await Exams.find({
                schoolId: schoolId,
                class: className,
                section: section,
                toDate: { $gte: currentDate },
            }).sort({ toDate: 1 });
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
                    schoolId: student.schoolId,
                    class: student.studentProfile.class,
                    section: student.studentProfile.section,
                    toDate: { $gte: currentDate },
                }).sort({ toDate: 1 });

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
            const teacher = await Teacher.findOne({ userId: loggedInId })
            if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }

            const targetClass = req.params.className || teacher.profile.class;
            const targetSection = req.params.section || teacher.profile.section;

            classPlan = await ClassPlan.findOne({ schoolId: teacher.schoolId, class: targetClass, section: targetSection })
            if (!classPlan) {
                return res.status(404).json({ message: "No class plan found for the specified class and section." });
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
        let sectionis = section.toUpperCase()

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized!' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only loggedin teachers can access.' })
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the loggedin id.' })
        };

        const existingExam = await Exams.findOne({
            examType: exam,
            schoolId: teacher.schoolId,
            class: classs,
            section: sectionis
        });

        if (!existingExam) {
            return res.status(404).json({ message: 'No exam found.' })
        };

        for (let r of result) {
            const subject = existingExam.exam.find(e => e.subject.toLowerCase() === r.subject.toLowerCase());
            if (!subject) {
                return res.status(400).json({ message: `No subject found in the exam to post results for ${r.subject}.` });
            }

            if (!teacher.profile.subjects.includes(r.subject)) {
                return res.status(404).json({ message: `You are not allowed to post marks for ${r.subject} subject.` });
            }

            r.subjectCode = subject.subjectCode;
            r.createdBy = teacher._id;
        }

        const existingStudent = await Student.findOne({
            'studentProfile.fullname': student,
            schoolId: existingExam.schoolId,
            'studentProfile.class': existingExam.class,
            'studentProfile.section': existingExam.section
        });
        if (!existingStudent) {
            return res.status(404).json({ message: 'No student found in this class.' })
        };

        let results = await Results.findOne({
            schoolId: existingStudent.schoolId,
            class: classs,
            section: section,
            exam: existingExam._id,
            student: existingStudent._id
        });

        if (!results) {
            results = new Results({
                schoolId: existingStudent.schoolId,
                class: classs,
                section: section,
                exam: existingExam._id,
                student: existingStudent._id,
                result: [],
                total: '-',
                totalPercentage: '-'
            });
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

        // function calculateGrade(marksObtained, totalMarks) {
        //     const percentage = (marksObtained / totalMarks) * 100;
        //     if (percentage >= 90) return 'A+';
        //     if (percentage >= 80) return 'A';
        //     if (percentage >= 70) return 'B+';
        //     if (percentage >= 60) return 'B';
        //     if (percentage >= 50) return 'C+';
        //     if (percentage >= 40) return 'C';
        //     return 'F';
        // }

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

        res.status(201).json({
            message: 'Results submitted successfully.',
            results,
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        })
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

        let result, banner

        if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ createdBy: loggedInId })
            banner = school.schoolBanner
            result = await Results.find({ schoolId: school._id, total: { $ne: '-'}, totalPercentage: { $ne: '-' } })
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

            result = await Results.find({
                result: {
                    $elemMatch: { createdBy: teacher._id }
                }
            }).populate('student').populate('exam', 'examType').sort({ createdAt: -1 });
            if (result.length === 0) {
                return res.status(404).json({ message: 'No results found for the class.' })
            };
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId }).populate('schoolId', 'schoolBanner').populate('userId', 'isActive')
            if (!student) {
                return res.status(404).json({ message: "No student found with the logged-in id." })
            }
            if (student.userId.isActive == 'false') {
                return res.status(404).json({ message: "Please contact your class teacher or admin to get exams data." })
            }
            banner = student.schoolId.schoolBanner
            result = await Results.find({ student: student._id }).populate('student').populate('exam', 'examType fromDate toDate').sort({ createdAt: -1 })
            if (!result.length) { return res.status(404).json({ message: "No results yet." }) }
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

        res.status(200).json({
            message: 'Results fetched successfully.',
            banner,
            result

        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        })
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

            result = await Results.findOne({
                _id: resultId,
                schoolId: teacher.schoolId,
                class: teacher.profile.class,
                section: teacher.profile.section,
            }).populate('student').populate('exam', 'examType').sort({ createdAt: -1 });
            if (result.length === 0) {
                return res.status(404).json({ message: 'No results found for the class.' })
            };
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId }).populate('schoolId').populate('userId', 'isActive')
            if (!student) {
                return res.status(404).json({ message: "No student found with the logged-in id." })
            }
            if (student.userId.isActive == 'false') {
                return res.status(404).json({ message: "Please contact your class teacher or admin to get exams data." })
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
            result = await Results.findOne({ _id: resultId, student: selectedStudent._id }).populate('student', 'studentProfile').populate('exam', 'examType')
        }
        else {
            res.status(404).json({ message: 'You are not allowed to access this.' })
        }
        res.status(200).json({
            message: 'Result data fetched successfully.',
            result,
            banner
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        })
    }
};

exports.getBookRequests = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied. Only logged-in users have the access to issue book to students.' });
        };

        let schoolId;

        if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ createdBy: loggedInId })
            if (!school) { return res.status(404).json({ message: "No school is associated with the logged-in admin." }) }
            schoolId = school._id
        }
        else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
            };
            schoolId = teacher.schoolId
        }
        else { return res.status(403).json({ message: "Only logged-in admins and librarians have access to issue book." }) }

        const bookRequests = await BookRequests.find({ schoolId }).populate('book').populate('requestedBy', '-studentProfile.previousEducation').sort({ createdAt: -1 });
        if (!bookRequests || !bookRequests.length) {
            return res.status(404).json({ message: 'No book requests found.' })
        };

        res.status(200).json({ bookRequests });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};

exports.issueBook = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied. Only logged-in users have the access to issue book to students.' });
        };

        const { requestId } = req.params;
        if (!requestId) {
            return res.status(400).json({ message: 'Please provide requestId.' })
        };

        const { status, dueOn } = req.body;
        if (!status) { return res.status(400).json({ message: "Please provide status to update book issue." }) }

        let schoolId;

        if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ createdBy: loggedInId })
            if (!school) { return res.status(404).json({ message: "No school is associated with the logged-in admin." }) }
            schoolId = school._id
        }
        else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
            };
            schoolId = teacher.schoolId
        }
        else { return res.status(403).json({ message: "Only logged-in admins and librarians have access to issue book." }) }

        const bookRequest = await BookRequests.findOne({ _id: requestId, schoolId }).populate('book');
        if (!bookRequest) {
            return res.status(404).json({ message: 'No book request found.' })
        };

        if (status == 'accepted' || status == 'rejected') {
            bookRequest.status = status
            await bookRequest.save()
            return res.status(200).json({ message: "Response sent to student successfully.", bookRequest })
        }

        const book = await Book.findOne({ _id: bookRequest.book._id, schoolId });
        if (book.availability == false) {
            return res.status(400).json({ message: 'The book is already issued to another student.' });
        }

        if (status == 'issued') {
            if (!dueOn) {
                return res.status(400).json({ message: "Please provide due date to issue book." })
            }
        }
        book.availability = false;
        await book.save();

        bookRequest.status = status;
        bookRequest.borrowedOn = new Date();
        bookRequest.dueOn = dueOn;
        await bookRequest.save();

        res.status(200).json({
            message: 'Book issued to the student successfully.',
            bookRequest
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};


exports.returnBook = async (req, res) => {
    try {
        const { requestId } = req.params;
        if (!requestId) {
            return res.status(400).json({ message: 'Please provide a requestId' })
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied. Only logged-in users have the access.' });
        };

        let schoolId, fineAmount;

        if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ createdBy: loggedInId });
            if (!school) {
                return res.status(404).json({ message: 'No school is associated with the logged-in admin.' })
            }
            schoolId = school._id
        }
        else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {
            const employee = await Teacher.findOne({ userId: loggedInId });
            if (!employee) {
                return res.status(404).json({ message: 'No employee found with the logged-in id.' })
            };
            schoolId = employee.schoolId
        }
        else { return res.status(403).json({ message: "Only logged-in admins and librarians have access to edit book availability." }) }

        const bookRequest = await BookRequests.findOne({ _id: requestId, schoolId }).populate('book');
        if (!bookRequest) {
            return res.status(404).json({ message: 'No book request found.' })
        };

        const book = await Book.findOne({ _id: bookRequest.book._id, schoolId });
        if (!book) {
            return res.status(404).json({ message: 'No book found.' })
        };

        if (book.availability) {
            return res.status(404).json({ message: 'Book is not issued to any student.' })
        };

        bookRequest.returnedOn = new Date().toISOString().split('T')[0];
        if (bookRequest.returnedOn > bookRequest.dueOn) {
            fineAmount = req.body.fine;

            if (fineAmount) {
                bookRequest.fine = fineAmount;
            } else {
                return res.status(400).json({ message: "'Fine' amount is required for late returns." });
            }
        }
        bookRequest.status = 'returned'
        bookRequest.save();

        book.availability = true;
        book.save();

        const student = await Student.findById(bookRequest.requestedBy);
        student.studentProfile.additionalFees += fineAmount
        await student.save()
        res.status(200).json({
            message: 'Book is returned and the book availability is now set to true.',
            bookRequest
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
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
        if (!item || !purpose) {
            return res.status(400).json({ message: 'Please provide item name and purpose to request.' })
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

        const newExpense = new ClassExpenses({
            schoolId: teacher.schoolId, item, purpose, class: teacher.profile.class, section: teacher.profile.section, createdBy: teacher._id
        });
        await newExpense.save()

        res.status(201).json({ message: "Item request created successfully, please wait until the management confirms.", newExpense })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};


exports.getItemRequests = async (req, res) => {
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

        const teacherRequests = await ClassExpenses.find({ schoolId: teacher.schoolId, createdBy: teacher._id }).sort({ createdAt: -1 })
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


exports.getClassAccounts = async (req, res) => {
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

        let expenses = await ClassExpenses.find({
            schoolId: teacher.schoolId,
            class: teacher.profile.class,
            section: teacher.profile.section,
            status: 'success'
        });

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

        let incomes = await ParentExpenses.find({
            schoolId: teacher.schoolId,
            class: teacher.profile.class,
            section: teacher.profile.section,
            purpose: "Fees",
            'paymentDetails.status': "success"
        });

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
            classExpense: monthlyData[key].classExpense,
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

