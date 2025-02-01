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
const Class = require('../models/classes');
const Calendar = require('../models/Calendar');
const ClassWiseFees = require('../models/ClassWiseFees');

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

    let Data, ParentData;

    if (loggedInUser.role === 'admin') {
      const admin = await School.findOne({ createdBy: loggedInId }).populate('createdBy');
      if (!admin) {
        return res.status(404).json({ message: 'No admin or school found with the loggedin Id' })
      };
      Data = admin;
    }

    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId }).populate('userId');
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the loggedin Id' })
      };
      Data = teacher;
    }

    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId }).populate('userId');
      if (!student) {
        return res.status(404).json({ message: 'No student found with the loggedin Id' })
      };

      const parent = await Parent.findOne({ userId: student.studentProfile.childOf }).populate('userId')

      Data = student
      ParentData = parent;
    }
    res.status(200).json({
      message: 'Profile data fetched successfully.',
      Data,
      ParentData,
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
    const { schoolName, schoolCode, address, contact, details, paymentDetails } = req.body;
    if (!schoolName || !schoolCode || !address || !contact || !details || !paymentDetails) {
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

    let uploadedPhotoUrl;
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    };

    const existingSchool = await School.findOne({ createdBy: loggedInId });
    if (existingSchool) {
      return res.status(404).json({ message: 'Admin is already associated with a school.' });
    };

    const school = new School({
      schoolName,
      schoolCode,
      schoolBanner: uploadedPhotoUrl,
      address,
      details,
      contact,
      createdBy: loggedInId,
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
    const { newSchoolName, newSchoolCode, newApplicationFee } = req.body;
    const edit = req.body;

    const createdBy = req.user && req.user.id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const school = await School.findOne({ createdBy: createdBy });
    if (!school) {
      return res.status(404).json({ message: "No school is associated with the admin." })
    }

    let uploadedPhotoUrl = school.schoolBanner;
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    };

    school.schoolBanner = uploadedPhotoUrl;
    school.schoolName = newSchoolName || school.schoolName;
    school.schoolCode = newSchoolCode || school.schoolCode;
    school.applicationFee = newApplicationFee || school.applicationFee;

    for (const key in edit) {
      if (school.address.hasOwnProperty(key) || school.contact.hasOwnProperty(key) || school.details.hasOwnProperty(key) || school.paymentDetails.hasOwnProperty(key)) {
        school.address[key] = edit[key];
        school.contact[key] = edit[key];
        school.details[key] = edit[key];
        school.paymentDetails[key] = edit[key];
      }
    };

    await school.save();

    return res.status(200).json({
      message: 'School updated successfully',
      school,
    });
  }
  catch (err) {
    return res.status(500).json({ message: 'Internal server', err })
  }
};


exports.createClass = async (req, res) => {
  try {
    const { classType, classs, section, teacherName } = req.body;

    if (!classType || !classs || !section) {
      return res.status(400).json({ message: "Please enter all the details to create class." })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const associatedSchool = await School.findOne({ createdBy: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    if (teacherName) {
      const teacher = await Teacher.findOne({ 'profile.fullname': teacherName, schoolId: associatedSchool._id })
      if (!teacher) {
        return res.status(404).json({ message: "The teacher is not associated with the admins school." })
      }
    }

    const existingClass = await Class.findOne({ class: classs, section, schoolId: associatedSchool._id })
    if (existingClass) {
      return res.status(404).json({ message: `Class ${classs} ${section} already exist.` })
    }

    const newClass = new Class({
      schoolId: associatedSchool._id,
      classType,
      class: classs,
      section,
      teacher: teacherName,
      createdBy: loggedInId
    });

    await newClass.save();

    res.status(201).json({
      message: `Class created successfully.`,
      newClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

exports.editClass = async (req, res) => {
  try {
    const { newTeacher } = req.body
    const { classId } = req.params;

    if (!newTeacher || !classId) {
      return res.status(400).json({ message: "Please provide new teacher name and class Id to update class details." })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can edit class.' });
    };

    const associatedSchool = await School.findOne({ createdBy: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    if (newTeacher) {
      const teacher = await Teacher.findOne({ 'profile.fullname': newTeacher, schoolId: associatedSchool._id })
      if (!teacher) {
        return res.status(404).json({ message: "The teacher is not associated with the admins school." })
      }
    }

    const existingClass = await Class.findOne({ _id: classId, schoolId: associatedSchool._id })
    if (!existingClass) {
      return res.status(404).json({ message: `No class found with the id in this school.` })
    }

    existingClass.teacher = newTeacher

    await existingClass.save();

    res.status(201).json({
      message: `Class teacher updated successfully.`,
      existingClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.getClasses = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const associatedSchool = await School.findOne({ createdBy: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    const classes = await Class.find({ schoolId: associatedSchool._id })
    if (!classes.length) {
      return res.status(404).json({ message: `No classes found in this school.` })
    }

    const classData = await Promise.all(classes.map(async (classs) => {
      const studentCount = await Student.countDocuments({
        schoolId: associatedSchool._id,
        'studentProfile.class': classs.class,
        'studentProfile.section': classs.section
      });

      return {
        classType: classs.classType,
        class: classs.class,
        section: classs.section,
        teacher: classs.teacher,
        studentCount
      };
    }));
    res.status(200).json({
      message: `Classes fetched successfully.`,
      classData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.createClassWiseFees = async(req,res)=>{
  try{
    const {className, tutionFees, admissionFees, examFees} = req.body;
    if(!className || !tutionFees || !admissionFees || !examFees){
      return res.status(400).json({message:"Provide all the details to create fees for class."})
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const school = await School.findOne({createdBy:loggedInId})
    if(!school){
      return res.status(404).json({message:"The admin is not associated with any school."})
    }

    const classFees = await ClassWiseFees.findOne({schoolId:school._id, class:className})
    if(classFees){
      return res.status(404).json({message:`The class wise fees for class - ${className} has already created.`})
    }

    const total = Number(tutionFees)+Number(admissionFees)+Number(examFees);

    const newFees = new ClassWiseFees({ schoolId:school._id, class:className, tutionFees, admissionFees, examFees, totalFees:total, createdBy:loggedInId})
    await newFees.save()

    res.status(201).json({message:`Fees for class ${className} has been created.`, newFees})
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.getClassWiseFees = async(req,res)=>{
  try{
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const school = await School.findOne({createdBy:loggedInId})
    if(!school){
      return res.status(404).json({message:"The admin is not associated with any school."})
    }

    const classwisefees = await ClassWiseFees.find({schoolId:school._id, createdBy:loggedInId})
    if(!classwisefees.length){
      return res.status(404).json({message:"No class wise fees found for the school."})
    }

    res.status(200).json(classwisefees)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.editClassWiseFees = async(req,res)=>{
  try{
    const {classWiseFessId} = req.params;
    if(!classWiseFessId){
      return res.status(400).json({message:"Provide the id to edit."})
    }
    const {newTutionFees, newAdmissionFees, newExamFees} = req.body
    if(!newTutionFees && !newAdmissionFees && !newExamFees){
      return res.status(400).json({message:"Provide atlease 1 data to update class wise fees!"})
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const classwisefees = await ClassWiseFees.findOne({_id:classWiseFessId, createdBy:loggedInId})
    if(!classwisefees){
      return res.status(404).json({message:"No class wise fees found with the id for the school."})
    }

    classwisefees.schoolId = classwisefees.schoolId
    classwisefees.createdBy = classwisefees.createdBy
    classwisefees.class = classwisefees.class 
    classwisefees.tutionFees = newTutionFees || classwisefees.tutionFees 
    classwisefees.admissionFees = newAdmissionFees || classwisefees.admissionFees 
    classwisefees.examFees = newExamFees || classwisefees.examFees
    newTotalFees = Number(classwisefees.tutionFees)+Number(classwisefees.admissionFees)+Number(classwisefees.examFees)
    classwisefees.totalFees = newTotalFees

    await classwisefees.save()
    res.status(201).json({message:"Class wise fees updated successfully",classwisefees})
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


//create teacher account by particular school
exports.createTeacher = async (req, res) => {
  try {
    const { email, password, employeeType, profile, education } = req.body;

    if (!email || !password || !employeeType || !profile || !education.length) {
      return res.status(400).json({ message: "Please enter all the details to register." })
    };

    if (employeeType === 'teaching') {
      if (!profile.class || !profile.section || !profile.subjects.length) {
        return res.status(400).json({ message: "Provide class, section and subjects for the teacher." })
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const createdBy = req.user && req.user.id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(createdBy);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to create teacher accounts.' });
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
        photo: uploadedPhotoUrl,
      },
      education,
      createdBy,
      schoolId: associatedSchool._id,
    });
    await teacher.save();

    res.status(201).json({
      message: `Teacher account created successfully.`,
      teacher,
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
      email,
      parentEmail,
      password,
      parentPassword,
      studentProfile,
      parentProfile,
    } = req.body;

    if (!email || !parentEmail || !parentPassword || !password || !studentProfile || !parentProfile) {
      return res.status(400).json({ message: 'Please provide all the required details.' });
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins or teachers can create accounts.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Only admins or teachers can create student accounts.' });
    };

    let createdBy, associatedSchool;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId })
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in user.' })
      };
      createdBy = loggedInId;
      associatedSchool = school._id;
    };

    if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found.' })
      };
      createdBy = teacher._id;
      associatedSchool = teacher.schoolId;
    };

    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        message: `Student's email already exist, try again with different email.`,
      });
    };

    const existingParent = await User.findOne({ parentEmail });
    if (existingParent) {
      return res.status(400).json({
        message: `Parent's email already exist, try again with different email.`,
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
    }

    const shashedPassword = bcrypt.hashSync(password, 10);
    const phashedPassword = bcrypt.hashSync(parentPassword, 10);

    const classWiseFees = await ClassWiseFees.findOne({
      schoolId: associatedSchool,
      class: studentProfile.class,
    });
    if (!classWiseFees) {
      return res.status(404).json({ message: 'Class-wise fee details not found for the selected class.' });
    }

    const studentFees = classWiseFees.tutionFees

    const studentUser = new User({
      email,
      password: shashedPassword,
      role: 'student',
      createdBy,
    });
    const savedStudentUser = await studentUser.save();

    const parentUser = new User({
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
        fees: studentFees,
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
    await parent.save();

    res.status(201).json({
      message: 'Student and parent accounts created successfully.',
      student,
      parent,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create student and parent accounts.',
      error: error.message,
    });
  }
};


exports.addStudentToExistingParent = async (req, res) => {
  try {
    const {
      parentEmail, // the existing parent's email
      email,
      password,
      studentProfile,
    } = req.body;

    if (!parentEmail || !email || !studentProfile || !password) {
      return res.status(400).json({ message: 'Please provide all the required details to register the student.' });
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins or teachers can create accounts.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Only logged-in admins or teachers can create student accounts.' });
    }

    let associatedSchool, creator;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: "No school is associated with the logged-in user." })
      }
      creator = loggedInId;
      associatedSchool = school._id;
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the logged-in id." })
      }
      creator = loggedInId;
      associatedSchool = teacher.schoolId;
    }

    const parentUser = await User.findOne({ email: parentEmail });
    if (!parentUser) {
      return res.status(404).json({ message: 'Parent does not exist, please enter correct parent email or create new account.' });
    }

    const parent = await Parent.findOne({ userId: parentUser._id, schoolId: associatedSchool });
    if (!parent) {
      return res.status(404).json({ message: 'No parent profile found for this user.' });
    }

    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student's email already exists, try again with a different email.",
      });
    }

    let uploadedPhotoUrl = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    };

    const hashedPassword = bcrypt.hashSync(password, 10);

    const classWiseFees = await ClassWiseFees.findOne({
      schoolId: associatedSchool,
      class: studentProfile.class,
    });
    if (!classWiseFees) {
      return res.status(404).json({ message: 'Class-wise fee details not found for the selected class.' });
    }

    const studentFees = classWiseFees.tutionFees

    const studentUser = new User({
      email,
      password: hashedPassword,
      role: 'student',
      createdBy: creator,
    });

    const savedStudentUser = await studentUser.save();

    const student = new Student({
      userId: savedStudentUser._id,
      studentProfile: {
        ...studentProfile,
        photo: uploadedPhotoUrl,
        fees: studentFees,
        childOf: parentUser._id,
      },
      createdBy: creator,
      schoolId: associatedSchool,
    });

    await student.save();

    parent.parentProfile.parentOf.push(student._id);
    await parent.save();

    res.status(201).json({
      message: 'Student account created and added to existing parent successfully.',
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add student.',
      error: error.message,
    });
  }
};


// exports.getClassWiseFees = async(req,res)=>{
//   try{
//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in admins or teachers can create accounts.' });
//     }

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser || loggedInUser.role !== 'admin') {
//       return res.status(403).json({ message: 'Only admins can get the data.' });
//     }

//     // const 
//   }
//   catch (error) {
//     res.status(500).json({
//       message: 'Internal server error.',
//       error: error.message,
//     });
//   }
// }


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

    const teachers = await Teacher.find({ schoolId: school._id, createdBy: adminId }).populate('userId').sort({ createdAt: -1 });

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


exports.getAllStudentsOfSchool = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can get the students data.' });
    }

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school associated with the logged-in user.' });
      }
      schoolId = school._id;
    } else if (loggedInUser.role === 'teacher' && (loggedInUser.employeeType === 'accountant' || loggedInUser.employeeType === 'librarian')) {
      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) {
        return res.status(404).json({ message: 'No employee found with the logged-in id.' });
      }
      const school = await School.findById(employee.schoolId);
      if (!school) {
        return res.status(404).json({ message: 'No school associated with the logged-in user.' });
      }
      schoolId = employee.schoolId;
    } else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' });
    }

    const parents = await Parent.find({ schoolId: schoolId })
      .select('-createdBy -schoolId -timestamps -createdAt -updatedAt')
      .populate('parentProfile.parentOf');
    if (parents.length === 0) {
      return res.status(404).json({ message: 'No students found for this school.' });
    }

    const studentsWithTeachers = [];
    for (const parent of parents) {
      const studentsWithTeacherDetails = [];

      for (const student of parent.parentProfile.parentOf) {
        const teacher = await Teacher.findOne({
          schoolId: schoolId,
          'profile.class': student.studentProfile.class,
          'profile.section': student.studentProfile.section
        }).select('profile.firstName profile.lastName');

        studentsWithTeacherDetails.push({
          student,
          teacher: teacher ? {
            firstName: teacher.profile.firstName,
            lastName: teacher.profile.lastName
          } : null
        });
      }
      studentsWithTeachers.push({
        parent: {
          ...parent._doc,
          parentProfile: {
            ...parent.parentProfile,
            parentOf: studentsWithTeacherDetails
          }
        }
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
        'studentProfile.section': teacher.profile.section,
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


//get all parents of that particular school
exports.getAllParentsOfSchool = async (req, res) => {
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

    const parents = await Parent.find({ schoolId: school._id })
      .populate({
        path: 'userId',
        select: 'email role',
      })
      .populate({
        path: 'parentProfile.parentOf',
        model: 'Student',
        select: 'studentProfile',
      });

    if (parents.length === 0) {
      return res.status(404).json({ message: 'No parents found for this school.' });
    };

    res.status(200).json({
      message: 'Parents retrieved successfully.',
      parents,
    });

  } catch (err) {
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
    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get the isActive data of students.' });
    };

    const school = await School.findOne({ createdBy: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    const students = await Student.find({ schoolId: school._id }).populate({ path: 'userId', select: 'isActive' });
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
exports.getStudentsRatio = async (req, res) => {
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
exports.updateStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const edit = req.body;
    if (!studentId) {
      return res.status(400).json({ message: 'Please provide studentId and the data to update.' })
    }

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

    for (const key in edit) {
      if (student.studentProfile.hasOwnProperty(key)) {
        student.studentProfile[key] = edit[key];
      }
    };
    await student.save();

    res.status(200).json({
      message: 'Student data updated successfully.',
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
exports.updateTeacherData = async (req, res) => {
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

    const totalStudentsOfSchool = await Student.find({ schoolId: school._id });
    if (!totalStudentsOfSchool.length) {
      return res.status(404).json({ message: 'No students in the school.' })
    }

    const year = new Date().getFullYear() - 1;
    const startDate = new Date(year, 3, 1); //april
    const endDate = new Date(year + 1, 2, 31, 23, 59, 59); //march

    const students = await Student.find({
      schoolId: school._id,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 })

    if (!students.length) {
      return res.status(404).json({ message: 'No admissions for this session year.' })
    };

    let male = 0, female = 0;

    for (let student of students) {
      if (student.studentProfile.gender == 'male') {
        male += 1
      }
      else { female += 1 }
    }
    const total = male + female;

    res.status(200).json({
      message: 'Data of new session of students.',
      'totalStudentsOfSchool': totalStudentsOfSchool.length,
      total,
      male,
      female,
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
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {

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
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {

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
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {

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
    const { title, date, noticeMessage } = req.body;
    if (!title || !date || !noticeMessage) {
      return res.status(400).json({ message: 'Please provide all the details to create notice!' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only loggedin users can access." })
    };

    let associatedSchool, creator;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in user.' })
      };

      associatedSchool = school._id;
      creator = loggedInId;
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      associatedSchool = teacher.schoolId;
      creator = teacher._id;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to access this.' })
    };

    const newNotice = new Notice({
      schoolId: associatedSchool,
      date,
      title,
      noticeMessage,
      createdBy: creator,
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
      return res.status(403).json({ message: "Access denied, only loggedin users can access." })
    };

    let Notices;

    if (loggedInUser.role === 'admin') {
      const notice = await Notice.find({ createdBy: loggedInId }).sort({ createdAt: -1 });
      if (!notice.length) {
        return res.status(404).json({ message: "No notices were created by the school." })
      };

      Notices = notice;
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      const school = await School.findById(teacher.schoolId);
      if (!school) {
        return res.status(404).json({ message: "Teacher is not associated with any school." })
      };

      const notices = await Notice.find({
        $or: [
          { createdBy: school.createdBy },
          { createdBy: teacher._id }
        ]
      }).sort({ createdAt: -1 });
      if (!notices.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      Notices = notices.map(notice => ({
        createdByText: notice.createdBy.equals(school.createdBy) ? 'Created by school.' : 'Created by you.',
        ...notice._doc,
      }));
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
        'profile.section': student.studentProfile.section,
      });

      const notices = await Notice.find({
        $or: [
          { createdBy: teacher._id },
          { createdBy: school.createdBy }
        ]
      }).sort({ createdAt: -1 });
      if (!notices.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      Notices = notices.map(notice => ({
        createdByText: notice.createdBy.equals(school.createdBy) ? 'Created by school.' : 'Created by the class teacher.',
        ...notice._doc,
      }));
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf');
      if (!parent) {
        return res.status(404).json({ message: 'No parent found with the logged-in id.' })
      };

      const school = await School.findById(parent.schoolId);
      if (!school) {
        return res.status(404).json({ message: "Student is not associated with any school." })
      };

      const schoolNotices = await Notice.find({ createdBy: school.createdBy }).sort({ createdAt: -1 });

      let allTeacherNotices = [];

      for (const student of parent.parentProfile.parentOf) {
        const teacher = await Teacher.findOne({
          schoolId: school._id,
          'profile.class': student.studentProfile.class,
          'profile.section': student.studentProfile.section,
        });

        if (teacher) {
          const teacherNotices = await Notice.find({ createdBy: teacher._id }).sort({ createdAt: -1 });
          allTeacherNotices = allTeacherNotices.concat(teacherNotices);
        }
      }

      const allNotices = [...schoolNotices, ...allTeacherNotices].sort((a, b) => b.createdAt - a.createdAt);
      if (!allNotices.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." });
      }

      Notices = allNotices.map(notice => ({
        createdByText: notice.createdBy.equals(school.createdBy) ? 'Created by school.' : 'Created by the class teacher.',
        ...notice._doc,
      }));
    }

    res.status(200).json({
      message: 'Notices retrieved successfully.',
      Notices
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
      return res.status(403).json({ message: "Access denied, only logged-in users can access." })
    };

    if (loggedInUser.role === 'admin') {
      const notice = await Notice.findOne({ _id: noticeId, createdBy: loggedInId });
      if (!notice) {
        return res.status(404).json({ message: 'No notice found.' })
      };

      await Notice.deleteOne(notice)
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };

      const notice = await Notice.findOne({ _id: noticeId, createdBy: teacher._id });
      if (!notice) {
        return res.status(404).json({ message: 'No notice found.' })
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


exports.createDynamicCalendar = async (req, res) => {
  try {
    const { date, title, description, displayTo } = req.body;
    if (!date || !title || !description || !displayTo.length) {
      return res.status(400).json({ message: 'Please provide all the details to create dynamic calendar.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in user's can access." });
    };

    let associatedSchool, creator

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };

      associatedSchool = school._id
      creator = loggedInId
      if (!displayTo.includes('admin')) {
        displayTo.push('admin');
      }
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the loggedin id." })
      }

      associatedSchool = teacher.schoolId
      creator = teacher._id

      if (!displayTo.includes('teacher')) {
        displayTo.push('teacher');
      }
    }
    else {
      return res.status(403).json({ message: "You are not allowed to access this." })
    }

    const newCalendar = new Calendar({
      schoolId: associatedSchool, date, title, description, displayTo, createdBy: creator
    })
    await newCalendar.save();

    res.status(201).json({
      message: 'Calendar created successfully',
      newCalendar
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    })
  }
};


exports.getDynamicCalendar = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only loggedin user's can access." });
    };

    let calendars;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };

      calendars = await Calendar.find({ schoolId: school._id, displayTo: loggedInUser.role }).sort({ date: 1 })
      if (!calendars.length) {
        return res.status(404).json({ message: "No events found." })
      }
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the loggedin id." })
      }
      const school = await School.findById(teacher.schoolId)

      calendars = await Calendar.find({
        $or: [
          { schoolId: teacher.schoolId, createdBy: school.createdBy, displayTo: loggedInUser.role },
          { createdBy: teacher._id }]
      }).sort({ date: 1 })
      if (!calendars.length) {
        return res.status(404).json({ message: "No events found." })
      }
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId })
      if (!student) {
        return res.status(404).json({ message: "No student found with the logged-in id." })
      }
      const school = await School.findById(student.schoolId)
      const teacher = await Teacher.findOne({ schoolId: student.schoolId, 'profile.class': student.studentProfile.class, 'profile.section': student.studentProfile.section })

      calendars = await Calendar.find({
        $or: [
          { schoolId: student.schoolId, createdBy: school.createdBy, displayTo: loggedInUser.role },
          { schoolId: student.schoolId, createdBy: teacher._id, displayTo: loggedInUser.role }]
      }).sort({ date: 1 })
      if (!calendars.length) {
        return res.status(404).json({ message: "No events found." })
      }
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf')
      if (!parent) {
        return res.status(404).json({ message: "No parent found with the logged-in id." })
      }

      const children = parent.parentProfile.parentOf;
      const school = parent.schoolId;

      const classSectionPairs = children.map(child => ({
        class: child.studentProfile.class,
        section: child.studentProfile.section
      }));

      const teachers = await Teacher.find({
        schoolId: school._id,
        $or: classSectionPairs.map(({ class: cls, section }) => ({
          'profile.class': cls,
          'profile.section': section
        }))
      });

      const teacherIds = teachers.map(teacher => teacher._id);

      calendars = await Calendar.find({
        $or: [
          { schoolId: parent.schoolId, createdBy: school.createdBy, displayTo: loggedInUser.role },
          { schoolId: parent.schoolId, createdBy: { $in: teacherIds }, displayTo: loggedInUser.role }
        ]
      }).sort({ date: 1 });
      if (!calendars.length) {
        return res.status(404).json({ message: "No events found." });
      }
    }
    res.status(200).json({
      message: 'Dynamic calendar data fetched successfully',
      calendars
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    })
  }
};


exports.getDynamicCalendarByDate = async (req, res) => {
  try {
    const {calendarDate} = req.params;
    if(!calendarDate){
      return res.status(400).json({message:"Provide the date to get data."})
    }
    
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only loggedin user's can access." });
    };

    let calendars;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ createdBy: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };

      calendars = await Calendar.find({ schoolId: school._id, displayTo: loggedInUser.role, date:calendarDate })
      if (!calendars) {
        return res.status(404).json({ message: "No event found on the date." })
      }
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the loggedin id." })
      }
      const school = await School.findById(teacher.schoolId)

      calendars = await Calendar.find({
        $or: [
          { schoolId: teacher.schoolId, createdBy: school.createdBy, displayTo: loggedInUser.role, date:calendarDate },
          { createdBy: teacher._id, date:calendarDate }]
      })
      if (!calendars) {
        return res.status(404).json({ message: "No event found on the date." })
      }
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId })
      if (!student) {
        return res.status(404).json({ message: "No student found with the logged-in id." })
      }
      const school = await School.findById(student.schoolId)
      const teacher = await Teacher.findOne({ schoolId: student.schoolId, 'profile.class': student.studentProfile.class, 'profile.section': student.studentProfile.section })

      calendars = await Calendar.find({
        $or: [
          { schoolId: student.schoolId, createdBy: school.createdBy, displayTo: loggedInUser.role, date:calendarDate },
          { schoolId: student.schoolId, createdBy: teacher._id, displayTo: loggedInUser.role, date:calendarDate }]
      })
      if (!calendars) {
        return res.status(404).json({ message: "No event found on the date." })
      }
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf')
      if (!parent) {
        return res.status(404).json({ message: "No parent found with the logged-in id." })
      }

      const children = parent.parentProfile.parentOf;
      const school = parent.schoolId;

      const classSectionPairs = children.map(child => ({
        class: child.studentProfile.class,
        section: child.studentProfile.section
      }));

      const teachers = await Teacher.find({
        schoolId: school._id,
        $or: classSectionPairs.map(({ class: cls, section }) => ({
          'profile.class': cls,
          'profile.section': section
        }))
      });

      if (!teachers || teachers.length === 0) {
        return res.status(404).json({ message: "No teachers found for the specified classes and sections." });
      }

      const teacherIds = teachers.map(teacher => teacher._id);

      const calendarQuery = {
        $or: [
          { schoolId: parent.schoolId, createdBy: school.createdBy, displayTo: loggedInUser.role, date:calendarDate },
          { schoolId: parent.schoolId, createdBy: { $in: teacherIds }, displayTo: loggedInUser.role, date:calendarDate }
        ]
      };
      calendars = await Calendar.find(calendarQuery).sort({ date: 1 });
      if (!calendars.length) {
        return res.status(404).json({ message: "No events found." });
      }
    }
    res.status(200).json({
      message: 'Dynamic calendar data fetched successfully',
      calendars
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    })
  }
};


// classes
// exports.attendanceSummary = async (req, res) => {
//   try {

//   }
//   catch (err) {
//     res.status(500).json({
//       message: 'Internal server error',
//       error: err.message,
//     });
//   }
// };


exports.createOrUpdateSyllabus = async (req, res) => {
  try {
    const { classs, section } = req.body;

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only loggedin users can access this.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(404).json({
        message: 'Access denied, only admins have access.'
      })
    };

    const school = await School.findOne({ createdBy: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'The school is associated with the logged-in admin.' })
    };

    let uploadedPhotoUrl = '';
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    }

    let existingSyllabus = await Syllabus.findOne({ class: classs, section: section, schoolId: school._id });

    if (existingSyllabus) {
      existingSyllabus.syllabus = uploadedPhotoUrl || existingSyllabus.syllabus;
      await existingSyllabus.save();

      return res.status(200).json({
        message: 'Syllabus updated successfully.',
        existingSyllabus,
      });
    } else {
      const newSyllabus = new Syllabus({
        schoolId: school._id,
        createdBy: loggedInId,
        class: classs,
        section: section,
        syllabus: uploadedPhotoUrl,
      });

      await newSyllabus.save();

      return res.status(200).json({
        message: 'Syllabus created successfully.',
        newSyllabus,
      });
    }
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};


