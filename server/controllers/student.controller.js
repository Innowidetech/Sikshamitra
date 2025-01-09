const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Exams = require('../models/Exams'); 
const Parent = require('../models/Parent');
const { uploadImage } = require('../utils/multer');

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

        const restrictedFields = ['class', 'section', 'classType', 'rollNumber','childOf', 'registrationNumber', 'fees'];

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


//get timetable for student from teacher controller


//get annual attendance report
exports.attendanceReport = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access' });
        }

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'student') {
            return res.status(403).json({ message: 'Access denied, Only logged-in students have access.' });
        }

        const student = await Student.findOne({ userId: loggedInUser });
        if (!student) {
            return res.status(404).json({ message: 'No student found with the logged-in ID' });
        }

        const year = req.body.year || new Date().getFullYear();
        const startDate = new Date(year, 3, 1); // April
        const endDate = new Date(year + 1, 2, 31, 23, 59, 59); // March

        const attendanceRecords = await Attendance.find({
            schoolId: student.schoolId,
            date: { $gte: startDate, $lte: endDate },
            'attendance.studentId': student._id,
        });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: 'No attendance records found for this student within the annual report period.' });
        }

        const statusCounts = { //initially
            Present: 0,
            Absent: 0,
            Holiday: 0,
            Leave: 0,
            Late: 0,
        };
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

        res.status(200).json({
            message: 'Student annual attendance report fetched successfully',
            totalDays,
            percentages,
            attendanceReport,
            // duration: 'From April till March',
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};


exports.getAdmitCard = async(req,res)=>{
    try{
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser) {
            return res.status(403).json({ message: 'Access denied, Only logged-in users have access.' });
        };

        let studentProfile, examData;

        if(loggedInUser.role === 'student'){
            const student = await Student.findOne({userId:loggedInId});
            if(!student){
                return res.status(404).json({message:'No student found with the logged-in id.'})
            };
            studentProfile = student;

            const exam = await Exams.findOne({
                schoolId:student.schoolId,
                class:student.studentProfile.class,
                section:{$regex:student.studentProfile.section, $options:'i'}
            });
            if(!exam){
                return res.status(404).json({message:'No exams for the student.'})
            };
            examData = exam;
        }
        else if(loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching'){
            const parent = await Parent.findOne({userId:loggedInId});
            if(!parent){
                return res.status(404).json({message:"No parent found with the logged-in id."})
            };
            
            const student = await Student.findById(parent.parentProfile.parentOf);
            if(!student){
                return res.status(404).json({message:"No student found."})
            };

            studentProfile = student;

            const exam = await Exams.findOne({
                class:student.studentProfile.class,
                section:{$regex:student.studentProfile.section, $options:'i'}
            });
            if(!exam){
                return res.status(404).json({message:'No exams for the student.'})
            };
            examData = exam;
        }
        else{
            return res.status(404).json({message:"Only logged-in students and parents have access."})
        };

        res.status(200).json({
            message:"Admit card of student:",
            studentProfile,
            examData,
        });
    }
    catch(err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};
