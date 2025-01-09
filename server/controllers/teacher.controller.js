const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Assignment = require('../models/assignment')
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const Syllabus = require('../models/Syllabus');
const StudyMaterial = require('../models/StudyMaterial');
const cloudinary = require('cloudinary').v2;
const { uploadImage } = require('../utils/multer');
const Exams = require('../models/Exams');
const Results = require('../models/Results');
const School = require('../models/School');
const Book = require('../models/Books');
const Library = require('../models/Library');


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

        const restrictedField = ['salary', 'employeeId'];

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
                        message: 'You are not allowed to change your salary nor employeeId!',
                    });
                }
                teacher.profile[key] = updatedData[key];
            }
        };
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

        const students = await Student.find({
            schoolId: teacher.schoolId,
            'studentProfile.class': teacher.profile.class,
            'studentProfile.section': { $regex: teacher.profile.section, $options: 'i' },
        });

        if (students.length === 0) {
            return res.status(200).json({ message: 'No students found for this class and section.' });
        }

        res.status(200).json({
            message: 'Students retrieved successfully.',
            students: students,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while retrieving the students list.',
            error: err.message,
        });
    }
};


//assigning assignments to students
exports.assignmentForStudents = async (req, res) => {
    try {
        const { title, work } = req.body;
        if (!title || !work) {
            return res.status(400).json({ message: 'Invalid input. `title` and `work` are required fields.' });
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in teachers can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Only teachers can assign the assignments to students.' });
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        };

        const students = await Student.find({
            schoolId: teacher.schoolId,
            'studentProfile.class': teacher.profile.class,
            'studentProfile.section': { $regex: teacher.profile.section, $options: 'i' }, // To ignore case sensitivity
        });

        if (students.length === 0) {
            return res.status(200).json({ message: 'No students found in the same school, class, and section.' });
        };

        const studentData = students.map(student => ({
            id: student._id,
            firstName: student.studentProfile.firstName,
            lastName: student.studentProfile.lastName,
        }));

        const studentIds = students.map(student => student._id);

        const assignment = new Assignment({
            title,
            work,
            createdBy: teacher._id,
            assignedTo: studentIds,
        });

        await assignment.save();

        res.status(201).json({
            message: 'Assignment created successfully.',
            assignment: {
                title: assignment.title,
                work: assignment.work,
                teacher: {
                    id: teacher._id,
                    firstName: teacher.profile.firstName,
                    lastName: teacher.profile.lastName,
                },
                assignedTo: studentData,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while creating the assignment.',
            error: err.message,
        });
    }
};


//mark daily attendance of students
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

        const { schoolId, profile: { class: teacherClass, section: teacherSection } } = teacher;

        const students = await Student.find({
            schoolId,
            'studentProfile.class': teacherClass,
            'studentProfile.section': { $regex: teacherSection, $options: 'i' },
        });
        if (!students.length) {
            return res.status(404).json({ message: 'No students found for the class.' })
        };

        const studentIds = students.map(student => student._id.toString());

        const validAttendanceRecords = attendanceRecords.filter(record => studentIds.includes(record.studentId));

        if (validAttendanceRecords.length === 0) {
            return res.status(200).json({ message: 'No attendance records found for the students.' });
        }

        const existingAttendance = await Attendance.findOne({
            date: new Date(date),
            teacherId: teacher._id,
            class: teacherClass,
            section: teacherSection,
        });

        if (existingAttendance) {
            existingAttendance.attendance = validAttendanceRecords;
            await existingAttendance.save();
            res.status(200).json({ message: 'Attendance updated successfully.' });
        } else {
            const attendance = new Attendance({
                date: new Date(date),
                teacherId: teacher._id,
                schoolId,
                class: teacherClass,
                section: teacherSection,
                attendance: validAttendanceRecords,
            });

            await attendance.save();
            res.status(201).json({ message: 'Attendance marked successfully.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while marking attendance.', error: err.message });
    }
};



//get monthly attendance of students
exports.viewMonthlyAttendance = async (req, res) => {
    try {
        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required.' });
        }

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

        const { schoolId, profile: { class: teacherClass, section: teacherSection } } = teacher;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendance = await Attendance.find({
            schoolId,
            class: teacherClass,
            section: teacherSection,
            date: { $gte: startDate, $lte: endDate },
        }).populate('attendance.studentId', 'studentProfile.firstName studentProfile.lastName');
        if (!attendance.length) {
            return res.status(404).json({ message: 'No attendance found.' })
        };

        res.status(200).json({ message: 'Attendance fetched successfully.', attendance });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while fetching attendance.', error: err.message });
    }
};


//create timetable for class
exports.createOrUpdateTimetable = async (req, res) => {
    try {
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

        const { schoolId, profile: { class: teacherClass, section: teacherSection } } = teacher;

        let timetable = await Timetable.findOne({
            schoolId,
            class: teacherClass,
            section: teacherSection,
        });

        if (!timetable) {
            timetable = new Timetable({
                createdBy: teacher._id,
                schoolId,
                class: teacherClass,
                section: teacherSection,
                timetable: {
                    monday: [{ period: '1', timing: '', subject: '' }],
                    tuesday: [{ period: '1', timing: '', subject: '' }],
                    wednesday: [{ period: '1', timing: '', subject: '' }],
                    thursday: [{ period: '1', timing: '', subject: '' }],
                    friday: [{ period: '1', timing: '', subject: '' }],
                    saturday: [{ period: '1', timing: '', subject: '' }],
                },
            });
        }

        // Update the timetable with the new periods and subjects (if provided)
        const { monday, tuesday, wednesday, thursday, friday, saturday } = req.body;

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const timetableUpdate = {};

        days.forEach(day => {
            if (req.body[day]) {
                timetableUpdate[day] = req.body[day].map((periodData, index) => ({
                    period: `${index + 1}`,
                    timing: periodData.timing || '',
                    subject: periodData.subject || '',
                }));
            }
        });

        timetable.timetable = {
            ...timetable.timetable,
            ...timetableUpdate,
        };

        await timetable.save();

        res.status(200).json({
            message: 'Timetable created/updated successfully.',
            timetable,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while creating or updating the timetable.',
            error: err.message,
        });
    }
};


//get timetable data
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

        let schoolId, className, section;

        if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }

            schoolId = teacher.schoolId;
            className = teacher.profile.class;
            section = { $regex: teacher.profile.section, $options: 'i' };
        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }

            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = { $regex: student.studentProfile.section, $options: 'i' };
        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view the timetable.',
            });
        }

        const timetable = await Timetable.findOne({
            schoolId: schoolId,
            class: className,
            section: section,
        });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found for the specified class and section.' });
        }

        res.status(200).json({
            message: 'Timetable fetched successfully.',
            timetable,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching the timetable.',
            error: err.message,
        });
    }
};


//create syllabus
exports.createOrUpdateSyllabus = async (req, res) => {
    try {
        const { syllabusData } = req.body;

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only loggedin users can access this.' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(404).json({
                message: 'Access denied, only teachers have access.'
            })
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the logged-in id' })
        };


        if (!syllabusData || !syllabusData.subjects) {
            return res.status(400).json({ message: 'Please provide all the data.' });
        }

        let syllabus = await Syllabus.findOne({
            schoolId: teacher.schoolId,
            createdBy: teacher._id,
            class: teacher.profile.class,
            section: { $regex: teacher.profile.section, $options: 'i' },
        });

        if (syllabus) {
            syllabus.syllabus.subjects = syllabusData.subjects;
            syllabus = await syllabus.save();
            return res.status(200).json({
                message: "Syllabus updated successfully",
                syllabus,
            });
        }

        //new
        syllabus = new Syllabus({
            schoolId: teacher.schoolId,
            createdBy: teacher._id,
            class: teacher.profile.class,
            section: teacher.profile.section,
            syllabus: syllabusData,
        });

        await syllabus.save();

        res.status(200).json({
            message: 'Syllabys created/updated successfully.',
            syllabus,
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};


//get syllabus
exports.getSyllabus = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can access this.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found.' });
        };

        let schoolId, className, section;

        if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the logged-in ID.' });
            }
            schoolId = teacher.schoolId;
            className = teacher.profile.class;
            section = { $regex: teacher.profile.section, $options: 'i' };

        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'No student found with the logged-in ID.' });
            }
            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = { $regex: student.studentProfile.section, $options: 'i' };

        } else if (loggedInUser.role === 'parent') {
            const parent = await Parent.findOne({ userId: loggedInId });
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
            }
            const student = await Student.findById(parent.parentProfile.parentOf);
            if (!student) {
                return res.status(404).json({ message: 'Student associated with the parent not found' });
            };

            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = { $regex: student.studentProfile.section, $options: 'i' };
        }
        else {
            return res.status(403).json({
                message: 'Access denied, only teachers, students and parents can access this.',
            });
        };

        const syllabus = await Syllabus.findOne({
            schoolId: schoolId,
            class: className,
            section: section,
        });

        if (!syllabus) {
            return res.status(404).json({ message: 'No syllabus found for the class.' });
        };

        res.status(200).json({
            message: 'Syllabus fetched successfully.',
            syllabus,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};


//create study material
exports.uploadStudyMaterial = async (req, res) => {
    try {
        const { subject, chapter, description } = req.body;
        const files = req.files;
        if (!subject || !chapter || !files) {
            return res.status(400).json({ message: 'Provide all the details and required file.' })
        };

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files provided.' });
        }

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

        const uploadedFiles = await uploadImage(files);

        const material = uploadedFiles.map((fileUrl) => ({
            url: fileUrl,
        }));

        const studyMaterial = new StudyMaterial({
            schoolId: teacher.schoolId,
            createdBy: teacher._id,
            class: teacher.profile.class,
            section: teacher.profile.section,
            subject,
            chapter,
            description,
            material: material,
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

        let schoolId, className, section;

        if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found.' });
            }

            schoolId = teacher.schoolId;
            className = teacher.profile.class;
            section = { $regex: teacher.profile.section, $options: 'i' };
        } else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }

            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = { $regex: student.studentProfile.section, $options: 'i' }
        } else {
            return res.status(403).json({
                message: 'Access denied. Only teachers and students can view study materials.',
            });
        }

        const studyMaterial = await StudyMaterial.find({
            schoolId: schoolId,
            class: className,
            section: section,
        })
            .sort({ createdAt: -1 });

        if (!studyMaterial.length) {
            return res.status(404).json({ message: 'Study materials not found for the specified class and section.' });
        };

        res.status(200).json({
            message: 'Study materials fetched successfully.',
            studyMaterial,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching the study materials.',
            error: err.message,
        });
    }
};


//delete study matrial
exports.deleteStudyMaterial = async (req, res) => {
    try {
        const { materialId } = req.params;

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

        const studyMaterial = await StudyMaterial.findOne({
            createdBy: teacher._id,
            'material._id': materialId,
        });

        if (!studyMaterial) {
            return res.status(404).json({ message: 'Material not found or access denied.' });
        }

        const materialToDelete = studyMaterial.material.find((m) => String(m._id) === materialId);
        if (!materialToDelete) {
            return res.status(404).json({ message: 'Material object not found.' });
        }

        const publicId = materialToDelete.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        studyMaterial.material = studyMaterial.material.filter((m) => String(m._id) !== materialId);

        if (studyMaterial.material.length === 0) {
            await studyMaterial.deleteOne();
            return res.status(200).json({
                message: 'Material deleted successfully and study material record removed as it is now empty.',
            });
        } else {
            await studyMaterial.save();
            return res.status(200).json({
                message: 'Material deleted successfully.',
            });
        }
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
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only loggedin teachers can access.' })
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the loggedin id' })
        };

        const { schedule, examType } = req.body;
        if (!schedule || !examType) {
            return res.status(404).json({ message: 'Provide all the data to submit' })
        };

        let exams = new Exams({
            schoolId: teacher.schoolId,
            createdBy: teacher._id,
            class: teacher.profile.class,
            section: teacher.profile.section,
            examType,
            schedule,
        });
        await exams.save();

        res.status(201).json({
            message: 'Exams created successfully',
            exams,
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        })
    }
};


//get exams
exports.getExams = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, only loggedin users can access.' })
        };

        let schoolId, className, section;

        if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
            const teacher = await Teacher.findOne({ userId: loggedInId })
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the loggedin id.' })
            }
            schoolId = teacher.schoolId;
            className = teacher.profile.class;
            section = { $regex: teacher.profile.section, $options: 'i' };
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'No student found with the loggedin id' })
            };

            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = { $regex: student.studentProfile.section, $options: 'i' };

        }
        else if (loggedInUser.role === 'parent') {

            const parent = await Parent.findOne({ userId: loggedInId });
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with the loggedin id' })
            };

            const student = await Student.findById(parent.parentProfile.parentOf)

            schoolId = student.schoolId;
            className = student.studentProfile.class;
            section = { $regex: student.studentProfile.section, $options: 'i' };
        }
        else {
            return res.status(404).json({ message: 'You are not allowed to perform this action.' })
        }
        let exams = await Exams.findOne({
            schoolId: schoolId,
            class: className,
            section: section,
        })
            .sort({ createdAt: -1 });

        if (!exams) {
            return res.status(404).json({ message: 'No exams found for the class' })
        };

        res.status(200).json({
            message: 'Exams schedule fetched successfully',
            exams,
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        })
    }
}


exports.createResults = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied, only loggedin teachers can access.' })
        };

        const teacher = await Teacher.findOne({ userId: loggedInId });
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found with the loggedin id' })
        };

        const { result } = req.body;
        const { examId, studentId } = req.params;

        if (!result || !examId || !studentId) {
            return res.status(404).json({ message: 'Provide all the data to submit result of student.' })
        };

        const exam = await Exams.findOne({
            _id: examId,
            schoolId: teacher.schoolId,
            class: teacher.profile.class,
            section: { $regex: teacher.profile.section, $options: 'i' }
        }).sort({ createdAt: -1 });

        if (!exam) {
            return res.status(404).json({ message: 'No exam found with the id in this school.' })
        };

        if (exam.schedule.length !== result.length) {
            return res.status(400).json({ message: 'The number of marks in the result does not match the number of subjects of exam schedule.' });
        }

        const examSubjects = exam.schedule.map(s => s.subject.toLowerCase());
        const resultSubjects = result.map(r => r.subject.toLowerCase());

        for (let subject of resultSubjects) {
            if (!examSubjects.includes(subject)) {
                return res.status(400).json({ message: `Subject mismatch: '${subject}' is not in the exam schedule.` });
            }
        }

        const student = await Student.findOne({
            _id: studentId,
            schoolId: exam.schoolId,
            'studentProfile.class': exam.class,
            'studentProfile.section': { $regex: exam.section, $options: 'i' }
        });
        if (!student) {
            return res.status(404).json({ message: 'No student found with the id in this school.' })
        };

        let totalMarks = 0, totalOutOfMarks = 0;

        result.forEach(r => {
            totalMarks += Number(r.marks);
            totalOutOfMarks += Number(r.outOfMarks);
        });

        const total = `${totalMarks}/${totalOutOfMarks}`;

        const results = new Results({
            schoolId: teacher.schoolId,
            createdBy: teacher._id,
            class: teacher.profile.class,
            section: teacher.profile.section,
            examType: exam.examType,
            examId,
            studentId,
            result,
            total
        });
        await results.save();

        res.status(201).json({
            message: 'Results submitted successfully.',
            results,
        })
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

        let result;

        if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
            const teacher = await Teacher.findOne({ userId: loggedInId });
            if (!teacher) {
                return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
            };

            const results = await Results.find({
                schoolId: teacher.schoolId,
                createdBy: teacher._id,
                class: teacher.profile.class,
                section: { $regex: teacher.profile.section, $options: 'i' },
            }).populate('studentId').sort({ createdAt: -1 });
            if (results.length === 0) {
                return res.status(200).json({ message: 'No results found for the class.' })
            };

            result = results;
        }
        else if (loggedInUser.role === 'admin') {
            const school = await School.findOne({ createdBy: loggedInId });
            if (!school) {
                return res.status(404).json({ message: 'No admin found with the logged-in id.' })
            };

            const results = await Results.find({ schoolId: school._id }).populate('studentId').sort({ createdAt: -1 });
            if (results.length === 0) {
                return res.status(200).json({ message: 'No results found for the school.' })
            };

            result = results;
        }
        else if (loggedInUser.role === 'student') {
            const student = await Student.findOne({ userId: loggedInId });
            if (!student) {
                return res.status(404).json({ message: 'No student found with the logged-in id.' })
            };

            const results = await Results.find({
                schoolId: student.schoolId,
                studentId: student._id,
            }).populate('studentId').sort({ createdAt: -1 });
            if (results.length === 0) {
                return res.status(200).json({ message: 'No results found for the student.' })
            };

            result = results;
        }
        else if (loggedInUser.role === 'parent') {
            const parent = await Parent.findOne({ userId: loggedInId });
            if (!parent) {
                return res.status(404).json({ message: 'No parent found with the logged-in id.' })
            };

            const results = await Results.find({
                schoolId: parent.schoolId,
                studentId: parent.parentProfile.parentOf,
            }).populate('studentId').sort({ createdAt: -1 });
            if (results.length === 0) {
                return res.status(200).json({ message: 'No results found for the student.' })
            };

            result = results;
        }
        else {
            res.status(404).json({ message: 'You are not allowed to access this.' })
        }

        res.status(200).json({
            message: 'Results fetched successfully.',
            result,
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        })
    }
};


exports.issueBook = async (req, res) => {
    try {
        const { bookId, studentId } = req.params;
        if (!bookId || !studentId) {
            return res.status(400).json({ message: 'Please provide the issued to student id and bookId' })
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher' || loggedInUser.employeeType !== 'non-teaching') {
            return res.status(403).json({ message: 'Access denied. Only logged-in librarians have the access to issue book to students.' });
        };

        const employee = await Teacher.findOne({ userId: loggedInId });
        if (!employee) {
            return res.status(404).json({ message: 'No employee found with the logged-in id.' })
        };

        const school = await School.findById(employee.schoolId);
        if (!school) {
            return res.status(404).json({ message: 'No school is associated with the logged-in user.' })
        };

        const book = await Book.findOne({ _id: bookId, schoolId: employee.schoolId });
        if (!book) {
            return res.status(404).json({ message: 'No book found with the id in this school.' })
        };

        if (!book.book.availability) {
            return res.status(400).json({ message: 'The book is already issued to another student.' });
        }

        const student = await Student.findOne({ _id: studentId, schoolId: employee.schoolId });
        if (!student) {
            return res.status(404).json({ message: 'No student found with the id in this school.' })
        };

        let issuedOn = new Date();
        let returnDate = new Date();
        returnDate.setDate(issuedOn.getDate() + 7);

        const library = new Library({
            schoolId: employee.schoolId,
            bookId,
            issuedBy: employee._id,
            issuedTo: studentId,
            issuedOn,
            returnDate: returnDate
        });

        await library.save();

        book.book.availability = false;
        await book.save();

        res.status(200).json({
            message: 'Book issued to the student successfully.',
            library,
            book,
            student
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};


exports.setBookAvailabilityTrue = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({ message: 'Please provide the bookId' })
        };

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher' || loggedInUser.employeeType !== 'non-teaching') {
            return res.status(403).json({ message: 'Access denied. Only logged-in librarians have the access to issue book to students.' });
        };

        const employee = await Teacher.findOne({ userId: loggedInId });
        if (!employee) {
            return res.status(404).json({ message: 'No employee found with the logged-in id.' })
        };

        const school = await School.findById(employee.schoolId);
        if (!school) {
            return res.status(404).json({ message: 'No school is associated with the logged-in user.' })
        };

        const book = await Book.findOne({ _id: bookId, schoolId: employee.schoolId });
        if (!book) {
            return res.status(404).json({ message: 'No book found with the id in this school.' })
        };

        if (book.book.availability) {
            return res.status(404).json({ message: 'Book is not issued to any student.' })
        };

        book.book.availability = true;
        book.save();

        const library = await Library.findOne({ bookId }).sort({ createdAt: -1 });
        library.returnedOn = new Date();
        library.save();

        res.status(200).json({
            message: 'Book is returned and the book availability is now set to true',
            book,
            library,
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message,
        });
    }
};
