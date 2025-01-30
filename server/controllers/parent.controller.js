const Parent = require('../models/Parent');
const User = require('../models/User');
const School = require('../models/School');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Notice = require('../models/Notice');
const Exam = require('../models/Exams');
const Result = require('../models/Results');


exports.editParentProfile = async(req,res)=>{
    try{
        const {updatedData} = req.body;
        if(!updatedData){
            return res.status(400).json({message:'No new data provided to update.'})
        };

        const loggedInId = req.user && req.user.id;
            if(!loggedInId){
              return res.status(401).json({message:'Unauthorized'})
            };
        
            const loggedInUser = await User.findById(loggedInId);
            if(!loggedInUser || loggedInUser.role!=='parent'){
              return res.status(403).json({message:"Access denied, only logged-in parents can access."})
            };

            const parent = await Parent.findOne({userId:loggedInId});
            if(!parent){
                return res.status(404).json({message:'No parent found with the userId.'})
            };

            const restrictedFields = ['parentOf'];

            for (let key in updatedData){
                if (parent.parentProfile.hasOwnProperty(key)){
                    if(restrictedFields.includes(key)){
                        return res.status(404).json({message:'You are not allowed to change the parentOf field'})
                    };
                    parent.parentProfile[key] = updatedData[key];
                }
            }
            await parent.save();

            res.status(200).json({
                message:'Profile updated successfully',
                updatedProfile:parent,
            });
    }
    catch (err) {
        res.status(500).json({
            message:'Internal server error.',
            error:err.message,
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

    const parentData = await Parent.findOne({userId:loggedInId}).populate('userId')

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

      const schoolNotices = await Notice.find({ createdBy: school.createdBy });

      const teacher = await Teacher.findOne({
        schoolId: school._id,
        'profile.class': student.studentProfile.class,
        'profile.section': student.studentProfile.section
      });

      const teacherNotices = teacher ? await Notice.find({ createdBy: teacher._id }) : [];
      const allNotices = [...schoolNotices, ...teacherNotices];

      const notices = allNotices.map(notice => ({
        createdByText: notice.createdBy.equals(school.createdBy)
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


exports.getResultDetails = async (req,res)=>{
  try{
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can access their data.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied, only parents can access this.' });
    }

    const parent = await Parent.findOne({userId:loggedInId}).populate('userId parentProfile.parentOf');
    if (!parent) {
      return res.status(404).json({ message: 'No parent found with the logged-in ID.' });
    }

    const students = await Student.find({schoolId:parent.schoolId, 'studentProfile.childOf':loggedInId}).select('studentProfile.firstName _id');
    if (!students.length) {
      return res.status(404).json({ message: 'No students found for the parent.' });
    }

    const studentIds = students.map(student => student._id);

    const examResults = await Result.find({
      schoolId: parent.schoolId,
      studentId: { $in: studentIds }
    }).select('examType class section');
    res.status(200).json({students, examResults})
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
}