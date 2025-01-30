const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Exams = require('../models/Exams'); 
const Parent = require('../models/Parent');
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


//get annual attendance report
exports.attendanceReport = async (req, res) => {
    try {
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

        const year = req.body.year || new Date().getFullYear() - 1;
        const startDate = new Date(year, 3, 1); // April 1
        const endDate = new Date(year + 1, 2, 31, 23, 59, 59); // March 31

        const attendanceRecords = await Attendance.find({
            schoolId: associatedSchool,
            date: { $gte: startDate, $lte: endDate },
            'attendance.studentId': studentId,
        });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: 'No attendance records found for this student within the annual report period.' });
        }

        let totalDays = 0;
        let presentCount = 0;

        const monthlyAttendance = Array(12).fill(null).map(() => ({
            totalDays: 0,
            presentDays: 0,
        }));

        attendanceRecords.forEach(record => {
            const studentAttendance = record.attendance.find(
                entry => entry.studentId.toString() === studentId.toString()
            );

            if (studentAttendance) {
                const month = new Date(record.date).getMonth();

                monthlyAttendance[month].totalDays++;
                totalDays++;

                if (studentAttendance.status === 'Present' || studentAttendance.status === 'Late') {
                    monthlyAttendance[month].presentDays++;
                    presentCount++;
                }
            }
        });

        const monthlyAttendanceReport = monthlyAttendance.map((monthData, index) => {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' 
            ];

            const percentage = monthData.totalDays > 0
                ? ((monthData.presentDays / monthData.totalDays) * 100).toFixed(2)
                : '0.00';

            return {
                month: monthNames[index],
                totalDays: monthData.totalDays,
                presentDays: monthData.presentDays,
                presentPercentage: `${percentage}%`,
            };
        });

        const presentPercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : '0.00';

        res.status(200).json({
            message: 'Student annual and monthly attendance report fetched successfully',
            totalDays,
            presentPercentage: `${presentPercentage}%`,
            monthlyAttendance: monthlyAttendanceReport,
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
                section:student.studentProfile.section
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
                section:student.studentProfile.section
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


exports.submitAssignment = async(req,res)=>{
    try{
        const {submittedBy} = req.body;
        const {assignmentId} = req.params
        if(!assignmentId || !submittedBy){
            return res.status(400).json({message:"Provide the assignment id and student details."})
        }

        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only logged-in users can have access' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !=='student') {
            return res.status(403).json({ message: 'Access denied, Only logged-in users have access.' });
        };

        const student = await Student.findOne({userId:loggedInId});
        if(!student){
            return res.status(404).json({message:'No student found with the logged-in id.'})
        }

        const assignment = await Assignment.findById(assignmentId);
        if(!assignment){
            return res.status(404).json({message:"No assignment found with the id."})
        }

        const Submit = new SubmitAssignment({
            
        })
    }
    catch(err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
}