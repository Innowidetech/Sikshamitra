const School = require('../models/School');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Exams = require('../models/Exams');
const Syllabus = require('../models/Syllabus');
const Books = require('../models/Books');
const { uploadImage } = require('../utils/multer');
const Notice = require('../models/Notice');

//get profile
exports.getProfile = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can get their data.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'No user found with the loggedin Id' })
    };

    let Data, ParentData, StudentUser;

    if (loggedInUser.role === 'admin') {
      const admin = await School.findOne({ createdBy: loggedInId }).populate('createdBy');
      if (!admin) {
        return res.status(404).json({ message: 'No admin or school found with the loggedin Id' })
      };
      Data = admin;
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
      const teacher = await Teacher.findOne({ userId: loggedInId }).populate('userId schoolId');
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the loggedin Id' })
      };
      Data = teacher;
    }

    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId }).populate('userId schoolId');
      if (!student) {
        return res.status(404).json({ message: 'No student found with the loggedin Id' })
      };

      const parent = await Parent.findOne({ userId: student.studentProfile.childOf }).populate('userId')

      Data = student
      ParentData = parent;
    }

    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId }).populate('userId parentProfile.parentOf');
      if (!parent) {
        return res.status(404).json({ message: 'No parent found with the loggedin Id' })
      };
      const studentUser = await User.findOne({ _id: parent.parentProfile.parentOf.userId })
      Data = parent;
      StudentUser = studentUser
    }

    else {
      return res.status(500).json({ message: 'An error occured while fetching the data' })
    };

    res.status(200).json({
      message: 'Profile data fetched successfully.',
      Data,
      ParentData,
      StudentUser,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message
    });
  }
};


//create School by admin
exports.createSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, address, contact, details, applicationFee, paymentDetails } = req.body;
    if (!schoolName || !schoolCode || !address || !contact || !details || !applicationFee || !paymentDetails) {
      return res.status(400).json({ message: 'Please provide all the details to create school.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(404).json({ message: 'Access denied, only admins have access to create school.' });
    };

    const existingSchool = await School.findOne({ createdBy: loggedInId });
    if (existingSchool) {
      return res.status(404).json({ message: 'Admin is already associated with a school.' });
    };

    const school = new School({
      schoolName,
      schoolCode,
      address,
      details,
      contact,
      createdBy: loggedInId,
      email: loggedInUser.email,
      applicationFee,
      paymentDetails,
    });
    await school.save()

    res.status(201).json({
      message: 'School created successfully',
      school
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    })
  }
};

//edit School by admin who created the school
exports.editSchool = async (req, res) => {
  try {
    const id = req.params.id;
    const edit = req.body;
    if (!edit) {
      return res.status(400).json({ message: 'No new data provided to update.' })
    }

    const createdBy = req.user && req.user.id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const school = await School.findById(id);
    if (school.createdBy.toString() !== createdBy) {
      return res.status(403).json({ message: 'Access denied: You are not authorized to manage this school' });
    }

    School.findByIdAndUpdate(id, edit)
      .then((updatedData) => {
        res.status(200).json({
          message: 'School updated successfully',
          school: updatedData,
        });
      })
      .catch((err) => {
        res.send('Error updating school info', err)
      })
  }
  catch (err) {
    res.send('Error', err)
  }
};


//create teacher account by particular school
exports.createTeacher = async (req, res) => {
  try {
    const { username, email, password, employeeType, profile, education } = req.body;

    if (!username || !email || !password || !employeeType || !profile || !education) {
      return res.status(400).json({message:"Please enter all the details to register."})
    };

    if (!profile.subjects) {
      profile.subjects = 'non-teaching'
    };
    if (!profile.class) {
      profile.class = '-'
    };
    if (!profile.section) {
      profile.section = '-'
    };

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const createdBy = req.user && req.user.id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(createdBy);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to create accounts.' });
    };

    const associatedSchool = await School.findOne({ createdBy });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    let uploadedPhotoUrl = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    };

    hpass = bcrypt.hashSync(password, 10);

    const user = new User({
      username,
      email,
      password: hpass,
      role: 'teacher',
      employeeType,
      createdBy
    });

    await user.save();

    const teacher = new Teacher({
      userId: user._id,
      profile: {
        ...profile,
        photo: uploadedPhotoUrl, // Assign the uploaded photo URL
      },
      education,
      createdBy,
      schoolId: associatedSchool._id,
    });
    await teacher.save();

    res.status(201).json({
      message: `Teacher account created successfully.`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        employeeType: user.employeeType,
        profile: teacher.profile,
        education: teacher.education,
        createdBy: user.createdBy,
        schoolId: teacher.schoolId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register teacher.', error: error.message });
  }
};


//create student and parent account by the teacher or school/admin
exports.createStudentAndParent = async (req, res) => {
  try {
    const {
      username,
      parentUsername,
      email,
      parentEmail,
      password,
      parentPassword,
      studentProfile,
      parentProfile,
    } = req.body;

    if (!username || !parentUsername || !email || !parentEmail || !studentProfile || !parentProfile || !parentPassword || !password) {
      return res.status(400).json({ message: 'Please provide all the required details.' });
    };

    let createdBy, associatedSchool;

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins or teachers can create accounts.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Only admins or teachers can create student accounts.' });
    };

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId })
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in user.' })
      };
      createdBy = loggedInId;
      associatedSchool = school._id;
    };

    if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found.' })
      };
      createdBy = teacher._id;
      associatedSchool = teacher.schoolId;
    };

    const existingStudent = await User.findOne({ $or: [{ username }, { email }] });
    if (existingStudent) {
      return res.status(400).json({
        message: `Student's username or email already exist, try again with different username or email.`,
      });
    };

    const existingParent = await User.findOne({ $or: [{ parentUsername }, { parentEmail }] });
    if (existingParent) {
      return res.status(400).json({
        message: `Parent's username or email already exist, try again with different username or email.`,
      });
    };

    let uploadedPhotoUrl = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    } else {
      return res.status(400).json({ message: 'Student photo is required.' });
    };

    const shashedPassword = bcrypt.hashSync(password, 10);
    const phashedPassword = bcrypt.hashSync(parentPassword, 10);

    const studentUser = new User({
      username,
      email,
      password: shashedPassword,
      role: 'student',
      createdBy,

    });
    const savedStudentUser = await studentUser.save();

    const parentUser = new User({
      username: parentUsername,
      email: parentEmail,
      password: phashedPassword,
      role: 'parent',
      createdBy,

    });
    const savedParentUser = await parentUser.save();

    const student = new Student({
      userId: savedStudentUser._id,
      studentProfile: {
        ...studentProfile,
        childOf: savedParentUser._id,
        photo: uploadedPhotoUrl,
      },
      createdBy,
      schoolId: associatedSchool,
    });
    const savedStudent = await student.save();

    const parent = new Parent({
      userId: savedParentUser._id,
      parentProfile: {
        ...parentProfile,
        parentOf: savedStudent._id,
      },
      createdBy,
      schoolId: associatedSchool,
    });
    const savedParent = await parent.save();

    res.status(201).json({
      message: 'Student and parent accounts created successfully.',
      student: {
        id: savedStudentUser._id,
        username: savedStudentUser.username,
        email: savedStudentUser.email,
        role: savedStudentUser.role,
        profile: student.studentProfile,
        schoolId: student.schoolId,
      },
      parent: {
        id: savedParentUser._id,
        username: savedParentUser.username,
        email: savedParentUser.email,
        role: savedParentUser.role,
        profile: savedParent.parentProfile,
        schoolId: parent.schoolId,

      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create student and parent accounts.',
      error: error.message,
    });
  }
};

//change student status
exports.changeStudentStatus = async (req, res) => {
  try {
    const { isActive, id } = req.params;

    const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : null;
    if (isActiveBoolean === null) {
      return res.status(400).json({ message: 'Only boolean is allowed (true or false)' })
    };

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can change student status.' });
    };

    const student = await Student.findById(id).populate('schoolId userId');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    };
    if (!student.schoolId) {
      return res.status(404).json({ message: 'No school found for this student.' });
    }
    const associatedSchool = student.schoolId;
    const associatedUser = student.userId;

    if (associatedSchool.createdBy.toString() !== adminUser._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to change this student\'s status.',
      });
    }

    if (associatedUser.role !== 'student') {
      return res.status(400).json({
        message: 'You are only allowed to change students activation status'
      })
    };

    associatedUser.isActive = isActive;
    await associatedUser.save();

    res.status(200).json({
      message: `Student activation status successfully updated to '${isActive}'.`,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'An error occured while updating the student activation status',
      error: err.message
    });
  }
};

//get all teacher of that particular school
exports.getAllTeachersOfSchool = async (req, res) => {
  try {

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get the teachers data.' });
    };

    const school = await School.findOne({ createdBy: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    if (school.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Access denied. You do not have access to manage this school.' });
    };

    const teachers = await Teacher.find({ schoolId: school._id, createdBy: adminId })
      .populate({
        path: 'userId',
        select: 'email username role',
      });

    if (teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found for this school.' });
    };

    res.status(200).json({
      message: 'Teachers retrieved successfully.',
      teachers,
    });

  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while retrieving teachers.',
      error: err.message,
    });
  }
};

//get all students of that particular school
exports.getAllStudentsOfSchool = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can get the students data.' });
    };

    let schoolId;

    if (loggedInUser.role === 'admin') {

      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school associated with the logged-in user.' });
      };

      schoolId = school._id;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'non-teaching') {

      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) {
        return res.status(404).json({ message: 'No employee found with the logged-in id.' })
      };

      const school = await School.findById(employee.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'No school associated with the logged-in user.' });
      };

      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const studentsWithTeachers = [];

    const students = await Parent.find({ schoolId: schoolId })
      .select('-createdBy -schoolId -timestamps -createdAt -updatedAt')
      .populate('parentProfile.parentOf');
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this school.' });
    };

    for (let student of students) {
      const teacher = await Teacher.findOne({
        schoolId: schoolId,
        'profile.class': student.parentProfile.parentOf.studentProfile.class,
        'profile.section': { $regex: student.parentProfile.parentOf.studentProfile.section, $options: 'i' }
      }).select('profile.firstName profile.lastName');

      studentsWithTeachers.push({
        student,
        teacher
      });
    }

    res.status(200).json({
      message: 'Students retrieved successfully.',
      studentsWithTeachers
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while retrieving students.',
      error: err.message,
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: 'Please provide student Id.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can get the students data.' });
    };

    let studentData;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school associated with the logged-in user.' });
      };

      const student = await Student.findOne({ _id: studentId, schoolId: school._id }).populate('userId');
      if (!student) {
        return res.status(404).json({ message: 'Student not found or not associated with this school.' })
      };
      studentData = student;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      const school = await School.findById(teacher.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'The teacher is not associated with the school.' })
      };
      const student = await Student.findOne({
        _id: studentId,
        schoolId: teacher.schoolId,
        'studentProfile.class': teacher.profile.class,
        'studentProfile.section': { $regex: teacher.profile.section, $options: 'i' },
      }).populate('userId');

      if (!student) {
        return res.status(404).json({ message: 'No student found.' })
      };
      studentData = student;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to access this data.' })
    };

    res.status(200).json({
      message: 'Student data by Id is fetched successfully.',
      studentData,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'An error occurred while retrieving students.',
      error: err.message,
    });
  }
};


exports.getParentsOfSchool = async (req, res) => {
  try {
    const { studentName, classs} = req.body;

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get parents data.' });
    };

    const school = await School.findOne({ createdBy: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    let parentsList = [];

    const parents = await Parent.find({
      schoolId: school._id,
    }).populate('parentProfile.parentOf userId');

    if (!parents.length) {
      return res.status(404).json({ message: 'No parents found for the school.' });
    };

    if(!studentName && !classs){
      return res.status(200).json({message:'Parents list.', parents});
    }    
    else if(studentName && classs){

    for (let parent of parents) {
      if (
        parent.parentProfile.parentOf.studentProfile.class === classs &&
        parent.parentProfile.parentOf.studentProfile.firstName === studentName
      ) {
        const parentDetails = {
          fatherName: parent.parentProfile.fatherName,
          fatherOccupation: parent.parentProfile.fatherOccupation,
          fatherAddress: parent.parentProfile.fatherAddress,
          fatherPhoneNumber: parent.parentProfile.fatherPhoneNumber,
          parentEmail: parent.userId ? parent.userId.parentEmail : null,
        };

        parentsList.push(parentDetails);
      }
    };
    if(!parentsList.length){
      return res.status(200).json({ message: 'No parents.' });
    };

    res.status(200).json({
      message: 'Parents of the student and class fetched successfully.',
      parentsList,
    });
  }
  }
  catch (err) {
    res.status(500).json({
      message: 'An error occurred while retrieving parents.',
      error: err.message,
    });
  }
};


exports.numberOfSPT = async (req, res) => { // students, parents, teachers
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get parents data.' });
    };

    const school = await School.findOne({ createdBy: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    if (school.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Access denied. You do not manage this school.' });
    };

    const studentCount = await Student.countDocuments({ schoolId: school._id });
    const parentCount = await Parent.countDocuments({ schoolId: school._id });
    const teacherCount = await Teacher.countDocuments({ schoolId: school._id });

    res.status(200).json({
      message: 'Total count of students, teachers, and parents of the school',
      students: studentCount,
      parents: parentCount,
      teachers: teacherCount
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'An error occurred while retrieving parents.',
      error: err.message,
    });
  }
};


//get active or inactive students ratio
exports.getStudentsIsActiveRatio = async (req, res) => {
  try {
    const { schoolId } = req.params

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get the isActive data of students.' });
    };

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    if (school.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Access denied. You do not manage this school.' });
    };

    const students = await Student.find({ schoolId: school._id }).populate({
      path: 'userId',
      select: 'isActive',
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this school.' });
    }

    let activeCount = 0;
    let inactiveCount = 0;

    students.forEach(student => {
      if (student.userId && student.userId.isActive) {
        activeCount += 1;
      } else {
        inactiveCount += 1;
      }
    });

    // Calculate ratios
    const total = activeCount + inactiveCount;
    const activeRatio = total > 0 ? ((activeCount / total) * 100).toFixed(2) : 0;
    const inactiveRatio = total > 0 ? ((inactiveCount / total) * 100).toFixed(2) : 0;

    res.status(200).json({
      message: 'Active and inactive student counts retrieved successfully.',
      activeCount,
      inactiveCount,
      activeRatio,
      inactiveRatio,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};

//get students gender ratio
exports.getStudentsGenderRatio = async (req, res) => {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get the students gender ratio.' });
    };

    const school = await School.findOne({ createdBy: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    const classPrimary = await Student.find({
      'studentProfile.classType': 'primary',
      schoolId: school._id,
    });
    const classSecondary = await Student.find({
      'studentProfile.classType': 'secondary',
      schoolId: school._id,
    });

    const students = await Student.find({ schoolId: school._id })
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this school.' });
    };

    let male = 0;
    let female = 0;
    let primaryMale = 0;
    let primaryFemale = 0;
    let secondaryMale = 0;
    let secondaryFemale = 0;

    students.forEach((student) => {
      const gender = student.studentProfile.gender;
      if (gender == 'male') {
        male += 1;
      } else if (gender == 'female') {
        female += 1;
      }
    });

    classPrimary.forEach((student) => {
      const gender = student.studentProfile.gender;
      if (gender == 'male') {
        primaryMale += 1;
      } else if (gender == 'female') {
        primaryFemale += 1;
      }
    });

    classSecondary.forEach((student) => {
      const gender = student.studentProfile.gender;
      if (gender == 'male') {
        secondaryMale += 1;
      } else if (gender == 'female') {
        secondaryFemale += 1;
      }
    });

    // Calculate ratios
    const total = male + female;
    const maleRatio = total > 0 ? ((male / total) * 100).toFixed(2) : 0;
    const femaleRatio = total > 0 ? ((female / total) * 100).toFixed(2) : 0;

    const primaryTotal = primaryMale + primaryFemale;
    const primaryMaleRatio = primaryTotal > 0 ? ((primaryMale / primaryTotal) * 100).toFixed(2) : 0;
    const primaryFemaleRatio = primaryTotal > 0 ? ((primaryFemale / primaryTotal) * 100).toFixed(2) : 0;

    const secondaryTotal = secondaryMale + secondaryFemale;
    const secondaryMaleRatio = secondaryTotal > 0 ? ((secondaryMale / secondaryTotal) * 100).toFixed(2) : 0;
    const secondaryFemaleRatio = secondaryTotal > 0 ? ((secondaryFemale / secondaryTotal) * 100).toFixed(2) : 0;

    res.status(200).json({
      message: 'Students gender ratio retrieved successfully.',
      totalStudents: total,
      male,
      female,
      maleRatio,
      femaleRatio,
      primaryStudents: primaryTotal,
      primaryMale,
      primaryFemale,
      primaryMaleRatio,
      primaryFemaleRatio,
      secondaryStudents: secondaryTotal,
      secondaryMale,
      secondaryFemale,
      secondaryMaleRatio,
      secondaryFemaleRatio,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'An error occurred while retrieving student data.',
      error: err.message,
    });
  }
};


//promote students to next class and section
exports.promoteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { newClass, newSection, newRollNumber, newFees, } = req.body;

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get the students gender ratio.' });
    };

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    };

    const school = await School.findById(student.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School associated with the student not found.' });
    };

    if (school.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Access denied. You do not manage this school.' });
    };

    student.studentProfile.rollNumber = newRollNumber || student.studentProfile.rollNumber;
    student.studentProfile.class = newClass || student.studentProfile.class;
    student.studentProfile.section = newSection || student.studentProfile.section;
    student.studentProfile.fees = newFees || student.studentProfile.fees;

    await student.save();

    res.status(200).json({
      message: 'Student promoted successfully.',
      updatedStudent: student,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'An error occurred while promoting the student.',
      error: err.message,
    });
  }
};


//change teachers salary
exports.changeTeacherSalary = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { newSalary } = req.body;
    if (!newSalary) {
      return res.status(400).json({ message: 'Please provide salary to update.' })
    }

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can change teachers salary.' });
    };

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    };

    const school = await School.findById(teacher.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School associated with the teacher not found.' });
    };

    if (school.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Access denied. You do not manage this school.' });
    };

    teacher.profile.salary = newSalary;
    await teacher.save();

    res.status(200).json({
      message: 'Teacher salary updated successfully.',
      updatedTeacher: teacher,
    });
  }
  catch (err) {
    res.status(500).json({
      message: "An error occurred while changing the Teacher'\s salary.",
      error: err.message,
    });
  }
};


//new admission of students
exports.newAdmission = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied, only loggedin admins have access.' })
    };

    const school = await School.findOne({ createdBy: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'No school is associated to the loggedin user' })
    };

    const year = new Date().getFullYear();
    const startDate = new Date(year, 3, 1); //april
    const endDate = new Date(year + 1, 2, 31, 23, 59, 59); //march

    const students = await Student.find({
      schoolId: school._id,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 })

    if (!students.length) {
      return res.status(404).json({ message: 'No admissions for this session.' })
    };

    res.status(200).json({
      message: 'Data of new session of students.',
      students,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
};


//get Curriculum (all exams and syllabus)
exports.getCurriculum = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied, only loggedin admins have access.' })
    };

    const school = await School.findOne({ createdBy: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'No school is associated to the loggedin user' })
    };

    const exams = await Exams.find({ schoolId: school._id }).sort({ createdAt: -1 });

    const syllabus = await Syllabus.find({ schoolId: school._id }).sort({ createdAt: -1 });

    if (syllabus.length === 0 && exams.length === 0) {
      return res.status(404).json({ message: 'No syllabus and exams found for the school.' })
    };

    res.status(200).json({
      message: 'All exams and syllabus of the school fetched successfully',
      exams,
      syllabus,
    })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    })
  }
};


exports.createBook = async (req, res) => {
  try {
    const { book } = req.body;
    if (!book) {
      return res.status(400).json({ message: 'Please provide all the details.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin admin can access." })
    };

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in admin.' })
      };

      schoolId = school._id;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'non-teaching') {

      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) {
        return res.status(404).json({ message: 'No employee found with the logged-in id.' })
      };

      const school = await School.findById(employee.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in employee.' })
      };

      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const newBook = new Books({
      schoolId,
      book,
    });

    await newBook.save();

    res.status(201).json({
      message: "Book data created successfully.",
      newBook,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


exports.getBooks = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin admin or employee can access." })
    };

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in admin.' })
      };

      schoolId = school._id;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'non-teaching') {

      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) {
        return res.status(404).json({ message: 'No employee found with the logged-in id.' })
      };

      const school = await School.findById(employee.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in employee.' })
      };

      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const books = await Books.find({ schoolId: schoolId }).sort({ createdAt: -1 });
    if (!books.length) {
      return res.status(404).json({ message: 'Books not found.' })
    };

    res.status(201).json({
      message: "Books data fetched successfully.",
      books,
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;;
    if (!bookId) {
      return res.status(400).json({ message: 'Please select the book to delete.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin admin or employee can access." })
    };

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in admin.' })
      };

      schoolId = school._id;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'non-teaching') {

      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) {
        return res.status(404).json({ message: 'No employee found with the logged-in id.' })
      };

      const school = await School.findById(employee.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in employee.' })
      };

      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const book = await Books.findOne({ _id: bookId, schoolId: schoolId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' })
    };

    await Books.deleteOne({ _id: bookId });

    res.status(201).json({
      message: "Book deleted successfully.",
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


exports.createNotice = async (req, res) => {
  try {
    const { title, noticeMessage } = req.body;
    if (!noticeMessage) {
      return res.status(400).json({ message: 'Please enter the notice message that you wanted to post!' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin admin can access." })
    };

    let associatedSchool, creator;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.stats(404).json({ message: 'No school is associated with the logged-in user.' })
      };

      associatedSchool = school._id;
      creator = loggedInId;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      const school = await School.findOne({ _id: teacher.schoolId });
      if (!school) {
        return res.status(404).json({ message: "Teacher is not associated with any school." })
      };

      associatedSchool = school._id;
      creator = teacher._id;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to access this.' })
    };

    const newNotice = new Notice({
      schoolId: associatedSchool,
      createdBy: creator,
      title,
      noticeMessage
    });

    await newNotice.save();

    res.status(201).json({
      message: 'Notice created successfully.',
      newNotice
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.getNotice = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin admin can access." })
    };

    let theNotice;

    if (loggedInUser.role === 'admin') {
      const notice = await Notice.find({ createdBy: loggedInId });
      if (!notice.length) {
        return res.status(404).json({ message: "No notices were created by the school." })
      };

      theNotice = notice;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      const school = await School.findById(teacher.schoolId);
      if (!school) {
        return res.status(404).json({ message: "Teacher is not associated with any school." })
      };

      const notice = await Notice.find({
        $or: [
          { createdBy: school.createdBy },
          { createdBy: teacher._id }
        ]
      });
      if (!notice.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      theNotice = notice;
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId });
      if (!student) {
        return res.status(404).json({ message: 'No student found with the logged-in id.' })
      };

      const school = await School.findById(student.schoolId);
      if (!school) {
        return res.status(404).json({ message: "Student is not associated with any school." })
      };

      const teacher = await Teacher.findOne({
        schoolId: school._id,
        'profile.class': student.studentProfile.class,
        'profile.section': { $regex: student.studentProfile.section, $options: 'i' },
      });

      const notice = await Notice.find({
        $or: [
          { createdBy: teacher ? teacher._id : school.createdBy },
          { createdBy: school.createdBy }
        ]
      });
      if (!notice.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      theNotice = notice;
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId });
      if (!parent) {
        return res.status(404).json({ message: 'No parent found with the logged-in id.' })
      };

      const school = await School.findById(parent.schoolId);
      if (!school) {
        return res.status(404).json({ message: "Student is not associated with any school." })
      };

      const student = await Student.findById(parent.parentProfile.parentOf);
      if (!student) {
        return res.status(404).json({ message: 'No student is associated with the parent.' })
      };

      const teacher = await Teacher.findOne({
        schoolId: school._id,
        'profile.class': student.studentProfile.class,
        'profile.section': { $regex: student.studentProfile.section, $options: 'i' },
      });

      const notice = await Notice.find({
        $or: [
          { createdBy: teacher ? teacher._id : school.createdBy },
          { createdBy: school.createdBy }
        ]
      });
      if (!notice.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      theNotice = notice;
    }

    res.status(200).json({
      theNotice
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


exports.deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    if (!noticeId) {
      return res.status(400).json({ message: 'Provide the notice id to delete.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin admin or teacher can access." })
    };

    if (loggedInUser.role === 'admin') {
      const notice = await Notice.findOne({
        _id: noticeId,
        createdBy: loggedInId
      });
      if (!notice) {
        return res.status(404).json({ message: 'No notice found or you have no access to delete this notice.' })
      };
      await Notice.deleteOne(notice)
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'teaching') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      const notice = await Notice.findOne({
        _id: noticeId,
        createdBy: teacher._id,
      });
      if (!notice) {
        return res.status(404).json({ message: 'No notice found or you have no access to delete this notice.' })
      };
      await Notice.deleteOne(notice)
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to access this.' })
    }

    res.status(200).json({ message: 'Notice delete successfull.' })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.attendanceSummary = async (req, res) => {
  try {

  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}