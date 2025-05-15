const School = require('../models/School');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const { sendEmail } = require('../utils/sendEmail');
const registrationTemplate = require('../utils/registrationTemplate');
const Books = require('../models/Books');
const { uploadImage } = require('../utils/multer');
const Notice = require('../models/Notice');
const Class = require('../models/classes');
const Calendar = require('../models/Calendar');
const ClassWiseFees = require('../models/ClassWiseFees');
const StudentDataUpdates = require('../models/StudentDataUpdates');
const Inventory = require('../models/Inventory');
const SaleStock = require('../models/SaleStock');
const BookRequests = require('../models/BookRequests');
const Employee = require('../models/Employee');
const Syllabus = require('../models/Syllabus');
const AimObjective = require('../models/Aim&Objective');
const AandL = require('../models/AdminAandL');
const AandLUpdates = require('../models/AandLUpdates');
const ParentExpenses = require('../models/ParentExpenses');
const SchoolExpenses = require('../models/SchoolExpenses');
const ClassExpenses = require('../models/ClassExpenses');
const ApplyOnline = require('../models/applyOnline')
require('dotenv').config();
const axios = require('axios');


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

    let Data, ParentData, AuthorityDetails;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId }).populate('userId')
      if (!school) { return res.status(404).json({ message: "Admin is not associated with any school." }) }

      AuthorityDetails = await AandL.findOne({ schoolId: school._id }).populate('accountants', 'profile.fullname').populate('librarians', 'profile.fullname');

      Data = school;
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
      AuthorityDetails,
      ParentData,
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


//edit School by admin who created the school
exports.editSchool = async (req, res) => {
  try {
    const { newSchoolName, newSchoolCode } = req.body;
    const edit = req.body;

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const school = await School.findOne({ userId: userId });
    if (!school) {
      return res.status(404).json({ message: "No school is associated with the admin." })
    }

    let uploadedLogoUrl = school.schoolLogo;
    let uploadedBannerUrl = school.schoolBanner;
    if (req.files) {
      if (req.files.logo) {
        try {
          const [logoUrl] = await uploadImage(req.files.logo);
          uploadedLogoUrl = logoUrl;
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload logo.', error: error.message });
        }
      }
      if (req.files.banner) {
        try {
          const [bannerUrl] = await uploadImage(req.files.banner);
          uploadedBannerUrl = bannerUrl;
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload banner.', error: error.message });
        }
      }
    }
    school.schoolLogo = uploadedLogoUrl;
    school.schoolBanner = uploadedBannerUrl;
    school.schoolName = newSchoolName || school.schoolName;
    school.schoolCode = newSchoolCode || school.schoolCode;

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


exports.numberOfSPTE = async (req, res) => { // students, parents, teachers, earnings
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can get parents data.' });
    };

    const school = await School.findOne({ userId: adminId });
    if (!school) {
      return res.status(404).json({ message: 'No school is associated with the logged-in admin.' });
    };

    if (school.userId.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Access denied. You do not manage this school.' });
    };

    const studentCount = await Student.countDocuments({ schoolId: school._id });
    const parentCount = await Parent.countDocuments({ schoolId: school._id });
    const teacherCount = await Teacher.countDocuments({ schoolId: school._id });

    let totalIncome = 0, expense = 0, earnings = 0;

    const parentExpenses = await ParentExpenses.find({ schoolId: school._id, 'paymentDetails.status': 'success' }) //fees income
    const onlineIncome = await ApplyOnline.find({ 'studentDetails.schoolName': school.schoolName, 'paymentDetails.status': 'success' })
    const expenses = await SchoolExpenses.find({ schoolId: school._id })

    totalIncome += parentExpenses.reduce((acc, item) => acc + item.amount, 0);
    totalIncome += onlineIncome.reduce((acc, item) => acc + parseFloat(item.studentDetails.admissionFees), 0);
    expense += expenses.reduce((acc, item) => acc + item.amount, 0);
    earnings = totalIncome - expense;

    res.status(200).json({
      message: 'Total count of students, teachers, and parents of the school',
      students: studentCount,
      parents: parentCount,
      teachers: teacherCount,
      earnings,
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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

    const school = await School.findOne({ userId: adminId });
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

    const students = await Student.find({ schoolId: school._id }).populate({ path: 'userId', select: 'isActive' })
    if (students.length === 0) {
      return res.status(200).json({ message: 'No students found for this school.' });
    };

    let male = 0;
    let female = 0;
    let primaryMale = 0;
    let primaryFemale = 0;
    let secondaryMale = 0;
    let secondaryFemale = 0;
    let activeCount = 0;
    let inactiveCount = 0;

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

    students.forEach(student => {
      if (student.userId && student.userId.isActive) {
        activeCount += 1;
      } else {
        inactiveCount += 1;
      }
    });

    const totalActives = activeCount + inactiveCount;
    const activeRatio = totalActives > 0 ? ((activeCount / totalActives) * 100).toFixed(2) : 0;
    const inactiveRatio = totalActives > 0 ? ((inactiveCount / totalActives) * 100).toFixed(2) : 0;

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
      activeCount,
      inactiveCount,
      activeRatio,
      inactiveRatio,
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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

    const associatedSchool = await School.findOne({ userId: loggedInId });
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

    const associatedSchool = await School.findOne({ userId: loggedInId });
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

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    const classes = await Class.find({ schoolId: associatedSchool._id }).sort({ class: 1, section: 1 })
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
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.createClassWiseFees = async (req, res) => {
  try {
    const { className, tutionFees, admissionFees, examFees } = req.body;
    if (!className || !tutionFees || !admissionFees || !examFees) {
      return res.status(400).json({ message: "Provide all the details to create fees for class." })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const school = await School.findOne({ userId: loggedInId })
    if (!school) {
      return res.status(404).json({ message: "The admin is not associated with any school." })
    }

    const classFees = await ClassWiseFees.findOne({ schoolId: school._id, class: className })
    if (classFees) {
      return res.status(404).json({ message: `The class wise fees for class - ${className} has already created, please edit it.` })
    }

    const total = Number(tutionFees) + Number(admissionFees) + Number(examFees);

    const newFees = new ClassWiseFees({ schoolId: school._id, class: className, tutionFees, admissionFees, examFees, totalFees: total, createdBy: loggedInId })
    await newFees.save()

    res.status(201).json({ message: `Fees for class ${className} has been created.`, newFees })
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.getClassWiseFees = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const school = await School.findOne({ userId: loggedInId })
    if (!school) {
      return res.status(404).json({ message: "The admin is not associated with any school." })
    }

    const classwisefees = await ClassWiseFees.find({ schoolId: school._id }).sort({ class: 1 })
    if (!classwisefees.length) {
      return res.status(404).json({ message: "No class wise fees found for the school." })
    }
    res.status(200).json(classwisefees)
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


exports.editClassWiseFees = async (req, res) => {
  try {
    const { classWiseFessId } = req.params;
    if (!classWiseFessId) {
      return res.status(400).json({ message: "Provide the id to edit." })
    }
    const { newTutionFees, newAdmissionFees, newExamFees } = req.body
    if (!newTutionFees && !newAdmissionFees && !newExamFees) {
      return res.status(400).json({ message: "Provide atlease 1 data to update class wise fees!" })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };

    const classwisefees = await ClassWiseFees.findOne({ _id: classWiseFessId, createdBy: loggedInId })
    if (!classwisefees) {
      return res.status(404).json({ message: "No class wise fees found with the id for the school." })
    }

    classwisefees.schoolId = classwisefees.schoolId
    classwisefees.createdBy = classwisefees.createdBy
    classwisefees.class = classwisefees.class
    classwisefees.tutionFees = newTutionFees || classwisefees.tutionFees
    classwisefees.admissionFees = newAdmissionFees || classwisefees.admissionFees
    classwisefees.examFees = newExamFees || classwisefees.examFees
    newTotalFees = Number(classwisefees.tutionFees) + Number(classwisefees.admissionFees) + Number(classwisefees.examFees)
    classwisefees.totalFees = newTotalFees

    await classwisefees.save()
    res.status(201).json({ message: "Class wise fees updated successfully", classwisefees })
  }
  catch (error) {
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
    if (typeof profile.subjects === 'string') {
      profile.subjects = profile.subjects.split(',').map(subject => subject.trim());
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to create teacher accounts.' });
    };

    const associatedSchool = await School.findOne({ userId });
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
      createdBy:userId
    });

    await user.save();

    const teacher = new Teacher({
      userId: user._id,
      profile: {
        ...profile,
        photo: uploadedPhotoUrl,
      },
      education,
      createdBy:userId,
      schoolId: associatedSchool._id,
    });
    await teacher.save();

    if (employeeType === 'librarian' || employeeType === 'accountant') {
      const aandL = await AandL.findOne({ schoolId: associatedSchool._id });
      if (!aandL) {
        const newAandL = new AandL({
          schoolId: associatedSchool._id,
          [employeeType + 's']: [teacher._id],
        });
        await newAandL.save();
      } else {
        aandL[employeeType + 's'].push(teacher._id);
        await aandL.save();
      }
    }

    res.status(201).json({
      message: `Teacher account created successfully.`,
      teacher,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register teacher.', error: error.message });
  }
};


exports.getTeacherNames = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to create teacher accounts.' });
    };

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    const teachers = await Teacher.find({ schoolId: associatedSchool._id }).select('profile.fullname')
    if (!teachers.length) { return res.status(404).json({ message: "No teachers found for this school." }) }

    res.status(200).json({ message: "Teachers:", teachers })
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to register teacher.', error: error.message });
  }
};


exports.updateAandLBody = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to update authority details.' });
    };

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    const { action, employeeType, teacherName, oldTeacher } = req.body;
    if (!action || !employeeType || !teacherName) {
      return res.status(400).json({ message: "Provide all the details to update." })
    }
    if (action == 'update') {
      if (!oldTeacher) { return res.status(404).json({ message: "Please specify old Teacher name to update." }) }
    }

    if (action == 'add' && (employeeType === 'accountant' || employeeType === 'librarian')) {
      const teacher = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': teacherName }).populate('userId')
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the name in this school." }) }

      const aandL = await AandL.findOne({ schoolId: associatedSchool._id })
      if (!aandL) {
        const newAandL = new AandL({
          schoolId: associatedSchool._id,
          accountants: [],
          librarians: []
        });
        await newAandL.save()
      }

      teacher.userId.employeeType = employeeType;
      teacher.userId.save();

      aandL[employeeType + 's'].push(teacher._id);
      await aandL.save();

      return res.status(200).json({ message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} added successfully.`, aandL });
    }
    else if (action == 'update' && (employeeType === 'accountant' || employeeType === 'librarian')) {
      const aandL = await AandL.findOne({ schoolId: associatedSchool._id })
      const targetArray = employeeType + "s";

      const oldTeacherRecord = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': oldTeacher }).populate("userId");
      if (!oldTeacherRecord) {
        return res.status(404).json({ message: "Teacher not found in this school." });
      }

      const oldTeacherId = oldTeacherRecord._id;

      const previousData = {
        accountants: employeeType === 'accountant' ? [...aandL.accountants] : [],
        librarians: employeeType === 'librarian' ? [...aandL.librarians] : []
      };

      const oldTeacherIndex = aandL[targetArray].indexOf(oldTeacherId);
      if (oldTeacherIndex !== -1) {
        aandL[targetArray].splice(oldTeacherIndex, 1);
      }

      if (oldTeacherRecord.profile.subjects.length > 0) {
        oldTeacherRecord.userId.employeeType = "teaching";
      } else {
        oldTeacherRecord.userId.employeeType = "-";
      }
      await oldTeacherRecord.userId.save();

      const newTeacher = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': teacherName }).populate("userId");
      if (!newTeacher) {
        return res.status(404).json({ message: "New teacher not found in the database." });
      }
      newTeacher.userId.employeeType = employeeType;
      await newTeacher.userId.save();

      aandL[targetArray].push(newTeacher._id);
      await aandL.save();

      const updatedData = {
        accountants: employeeType === 'accountant' ? [...aandL.accountants] : [],
        librarians: employeeType === 'librarian' ? [...aandL.librarians] : []
      };

      const aandLUpdate = new AandLUpdates({
        schoolId: associatedSchool._id,
        previousData,
        updatedData
      });
      await aandLUpdate.save();

      return res.status(200).json({
        message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} updated successfully.`, aandL,
      });
    }
    return res.status(400).json({ message: "Invalid action or employeeType." });
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to update authority details.', error: error.message });
  }
};


exports.getAandLUpdatesHistory = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to update authority details.' });
    };

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    const AandLHistory = await AandLUpdates.find({ schoolId: associatedSchool._id })
      .populate({
        path: 'previousData.accountants',
        select: 'profile.fullname profile.phoneNumber'
      })
      .populate({
        path: 'previousData.librarians',
        select: 'profile.fullname profile.phoneNumber'
      })
      .populate({
        path: 'updatedData.accountants',
        select: 'profile.fullname profile.phoneNumber'
      })
      .populate({
        path: 'updatedData.librarians',
        select: 'profile.fullname profile.phoneNumber'
      })
      .sort({ createdAt: -1 });

    if (!AandLHistory.length) { res.status(200).json({ message: "No updates yet." }) }

    res.status(200).json({ history: AandLHistory })
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message })
  }
};


// exports.updateAandLParams = async (req, res) => {
//   try {
//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized.' });
//     };

//     const adminUser = await User.findById(loggedInId);
//     if (!adminUser || adminUser.role !== 'admin') {
//       return res.status(403).json({ message: 'Only admins are allowed to update authority details.' });
//     };

//     const associatedSchool = await School.findOne({ userId: loggedInId });
//     if (!associatedSchool) {
//       return res.status(400).json({ message: 'Admin is not associated with any school.' });
//     };

//     const { action, employeeType, position } = req.params;
//     const { teacherName } = req.body;
//     if (!action || !employeeType || !teacherName) {
//       return res.status(400).json({ message: "Provide action (add or update), teacher name to proceed." })
//     }
//     if (action == 'update') {
//       if (!position) { return res.status(404).json({ message: "Please specify the position to update." }) }
//     }

//     if (action == 'add' && (employeeType === 'accountant' || employeeType === 'librarian')) {
//       const teacher = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': teacherName }).populate('userId')
//       if (!teacher) { return res.status(404).json({ message: "No teacher found with the name in this school." }) }

//       const aandL = await AandL.findOne({ schoolId: associatedSchool._id })
//       if (!aandL) {
//         const newAandL = new AandL({
//           schoolId: associatedSchool._id,
//           accountants: [],
//           librarians: []
//         });
//         await newAandL.save()
//       }

//       teacher.userId.employeeType = employeeType;
//       teacher.userId.save();

//       aandL[employeeType + 's'].push(teacher._id);
//       await aandL.save();

//       return res.status(200).json({ message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} added successfully.`, aandL });
//     }
//     else if (action == 'update' && (employeeType === 'accountant' || employeeType === 'librarian')) {
//       const aandL = await AandL.findOne({ schoolId: associatedSchool._id })
//       const targetArray = employeeType + "s";
//       if (!aandL[targetArray] || aandL[targetArray].length === 0 || position < 0 || position >= aandL[targetArray].length) {
//         return res.status(404).json({ message: `Invalid position in ${employeeType}s array.` });
//       }

//       const oldTeacherId = aandL[targetArray][position];
//       const oldTeacher = await Teacher.findById(oldTeacherId).populate("userId");
//       // if (!oldTeacher) {
//       //   return res.status(404).json({ message: "Old teacher not found in the database." });
//       // }

//       if (oldTeacher.profile.subjects.length > 0) {
//         oldTeacher.userId.employeeType = "teaching";
//       } else {
//         oldTeacher.userId.employeeType = "-";
//       }
//       await oldTeacher.userId.save();

//       const newTeacher = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': teacherName }).populate("userId");
//       if (!newTeacher) {
//         return res.status(404).json({ message: "New teacher not found in the database." });
//       }
//       newTeacher.userId.employeeType = employeeType;
//       await newTeacher.userId.save();

//       aandL[targetArray][position] = newTeacher._id;
//       await aandL.save();

//       return res.status(200).json({
//         message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} updated successfully.`, aandL,
//       });
//     }
//     return res.status(400).json({ message: "Invalid action or employeeType." });
//   }
//   catch (error) {
//     res.status(500).json({ message: 'Failed to update authority details.', error: error.message });
//   }
// };


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

    const school = await School.findOne({ userId: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found.' });
    };

    const teachers = await Teacher.find({ schoolId: school._id }).populate('userId').sort({ createdAt: -1 });

    if (teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found for this school.' });
    };

    let totalTeachersSalary = 0;
    for (let teacher of teachers) {
      totalTeachersSalary += Number(teacher.profile.salary)
    }

    const sortedTeachers = teachers.sort((a, b) => {
      const typeOrder = ['accountant', 'librarian', '-', 'teaching'];
      const aTypeIndex = typeOrder.indexOf(a.userId.employeeType);
      const bTypeIndex = typeOrder.indexOf(b.userId.employeeType);
      return aTypeIndex - bTypeIndex;
    });

    res.status(200).json({
      message: 'Teachers retrieved successfully.',
      totalTeachersSalary,
      teachers: sortedTeachers,
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.updateTeacherData = async (req, res) => {
  try {
    const { teacherId } = req.params;
    if (!teacherId) { return res.status(400).json({ message: "Select the teacher to update." }) }
    const edit = req.body;
    const { isActive, newEmployeeType } = req.body;

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can change teachers salary.' });
    };
    const school = await School.findOne({ userId: adminId })

    const teacher = await Teacher.findOne({ _id: teacherId, schoolId: school._id }).populate('userId');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    };

    for (const key in edit) {
      if (teacher.profile.hasOwnProperty(key)) {
        teacher.profile[key] = edit[key];
      }
    };

    await teacher.save();
    if (newEmployeeType) {
      teacher.userId.employeeType = newEmployeeType
    }
    await teacher.userId.save()

    if (isActive) {
      teacher.userId.isActive = isActive;
      await teacher.userId.save();
    }

    res.status(200).json({
      message: 'Teacher data updated successfully.',
      updatedTeacher: teacher,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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

    let createdBy, associatedSchool, schoolName;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId })
      if (!school) {
        return res.status(404).json({ message: 'No school is associated with the logged-in admin.' })
      };
      createdBy = loggedInId;
      associatedSchool = school._id;
      schoolName = school.schoolName
    };

    if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found.' })
      };
      const school = await School.findById(teacher.schoolId)
      createdBy = teacher._id;
      associatedSchool = teacher.schoolId;
      schoolName = school.schoolName
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

    var adminEmail = loggedInUser.email
    var studentName = student.studentProfile.fullname
    var parentName = parent.parentProfile.fatherName

    await sendEmail(email, adminEmail, `Account registration - Shikshamitra`, registrationTemplate(studentName, schoolName, email, password));
    await sendEmail(parentEmail, adminEmail, `Account registration - Shikshamitra`, registrationTemplate(parentName, schoolName, parentEmail, parentPassword));

    res.status(201).json({
      message: 'Student and parent accounts created successfully.',
      student,
      parent,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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

    let associatedSchool, creator, schoolName;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId }).populate('userId');
      if (!school) {
        return res.status(404).json({ message: "No school is associated with the logged-in user." })
      }
      creator = loggedInId;
      associatedSchool = school._id;
      schoolName = school.schoolName;
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the logged-in id." })
      }
      const school = await School.findById(teacher.schoolId)
      creator = loggedInId;
      associatedSchool = teacher.schoolId;
      schoolName = school.schoolName
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

    var adminEmail = loggedInUser.email
    var studentName = student.studentProfile.fullname

    await sendEmail(email, adminEmail, `Account registration - Shikshamitra`, registrationTemplate(studentName, schoolName, email, password));

    res.status(201).json({
      message: 'Student account created and added to existing parent successfully.',
      student,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'No school associated with the logged-in user.' });
      }
      schoolId = school._id;
    } else if (loggedInUser.role === 'teacher' && (loggedInUser.employeeType === 'accountant' || loggedInUser.employeeType === 'librarian')) {
      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) {
        return res.status(404).json({ message: 'No employee found with the logged-in id.' });
      }
      schoolId = employee.schoolId;
    } else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' });
    }

    const parents = await Parent.find({ schoolId: schoolId })
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
        }).select('profile.fullname');

        studentsWithTeacherDetails.push({
          student,
          teacher: teacher ? {
            fullname: teacher.profile.fullname
          } : 'N/A'
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
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


// exports.getStudentById = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     if (!studentId) {
//       return res.status(400).json({ message: 'Please provide student Id.' })
//     };

//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in users can perform this action.' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser) {
//       return res.status(403).json({ message: 'Access denied. Only logged-in users can get the students data.' });
//     };

//     let studentData;

//     if (loggedInUser.role === 'admin') {
//       const school = await School.findOne({ userId: loggedInId });
//       if (!school) {
//         return res.status(404).json({ message: 'No school associated with the logged-in user.' });
//       };

//       const student = await Student.findOne({ _id: studentId, schoolId: school._id }).populate('userId');
//       if (!student) {
//         return res.status(404).json({ message: 'Student not found or not associated with this school.' })
//       };
//       studentData = student;
//     }
//     else if (loggedInUser.role === 'teacher') {
//       const teacher = await Teacher.findOne({ userId: loggedInId });
//       if (!teacher) {
//         return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
//       };

//       const school = await School.findById(teacher.schoolId);
//       if (!school) {
//         return res.status(404).json({ message: 'The teacher is not associated with the school.' })
//       };
//       const student = await Student.findOne({
//         _id: studentId,
//         schoolId: teacher.schoolId,
//         'studentProfile.class': teacher.profile.class,
//         'studentProfile.section': teacher.profile.section,
//       }).populate('userId');

//       if (!student) {
//         return res.status(404).json({ message: 'No student found.' })
//       };
//       studentData = student;
//     }
//     else {
//       return res.status(404).json({ message: 'You are not allowed to access this data.' })
//     };

//     res.status(200).json({
//       message: 'Student data by Id is fetched successfully.',
//       studentData,
//     });
//   }catch (err) {
//   res.status(500).json({ message: 'Internal server error', error: err.message })
// }
// };


exports.updateStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const edit = req.body;
    const { isActive, reason } = req.body;

    if (!studentId || !reason) {
      return res.status(400).json({ message: 'Please provide studentId, data and reason for the update.' })
    }

    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can access.' });
    };

    const school = await School.findOne({ userId: adminId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const student = await Student.findOne({ schoolId: school._id, _id: studentId }).populate('userId');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    };

    const previousData = {
      ...student.studentProfile.toObject(),
      isActive: student.userId.isActive
    };
    const previousIsActive = student.userId.isActive;

    for (const key in edit) {
      if (student.studentProfile.hasOwnProperty(key)) {
        student.studentProfile[key] = edit[key];
      }
    }
    await student.save();

    let updatedIsActive = previousIsActive;
    if (isActive !== undefined) {
      student.userId.isActive = isActive,
        updatedIsActive = isActive
    }
    await student.userId.save();

    const updatedData = {
      ...student.studentProfile.toObject(),
      isActive: updatedIsActive
    };

    const dataUpdate = new StudentDataUpdates({
      schoolId: student.schoolId,
      studentId: student._id,
      previousData,
      updatedData,
      reason,
      updatedBy: adminId,
    });
    await dataUpdate.save();

    res.status(200).json({
      message: 'Student data updated successfully.',
      updatedStudent: student,
    });
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getUpdatedStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: "Provide student id to get." })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const studentDataUpdates = await StudentDataUpdates.find({ schoolId: school._id, studentId: studentId, updatedBy: loggedInId }).sort({ createdAt: -1 })
    if (!studentDataUpdates.length) {
      return res.status(404).json({ message: "No updated data found for the student." })
    }

    res.status(200).json({ message: "Updated students data:", studentDataUpdates })
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


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

    const school = await School.findOne({ userId: adminId });
    if (!school) {
      return res.status(404).json({ message: 'School not found for the admin.' });
    };

    const parents = await Parent.find({ schoolId: school._id })
      .populate({ path: 'userId', select: 'email role' })
      .populate({ path: 'parentProfile.parentOf', model: 'Student', select: 'studentProfile' })
      .sort({ createdAt: -1 });

    if (parents.length === 0) {
      return res.status(404).json({ message: 'No parents found for this school.' });
    };
    const updatedParents = await Promise.all(parents.map(async (parent) => {
      const updatedChildren = await Promise.all(parent.parentProfile.parentOf.map(async (student) => {
        const fees = Number(student.studentProfile.fees);
        const additionalFees = Number(student.studentProfile.additionalFees || 0);
        const parentExpense = await ParentExpenses.findOne({
          studentId: student._id,
          class: student.studentProfile.class,
          section: student.studentProfile.section
        }).sort({ createdAt: -1 });

        let pendingAmount = 0;
        if (parentExpense) {
          pendingAmount = parentExpense.pendingAmount;
        } else {
          pendingAmount = fees + additionalFees;
        }
        return {
          ...student.toObject(),
          monthlyFees: (fees / 12).toFixed(2),
          halfYearlyFees: (fees / 2).toFixed(2),
          pendingAmount: pendingAmount
        };
      }));

      return {
        ...parent.toObject(),
        parentProfile: {
          ...parent.parentProfile.toObject(),
          parentOf: updatedChildren,
        },
      };
    }));

    res.status(200).json({
      message: 'Parents retrieved successfully.',
      parents: updatedParents,
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.addStock = async (req, res) => {
  try {
    const { itemName, description, count, unitPrice } = req.body;
    if (!itemName || !description || !count || !unitPrice) {
      return res.status(400).json({ message: "Provide all the data to add stock." })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const amount = count * unitPrice

    const newStock = new Inventory({ schoolId: school._id, itemName, description, count, unitPrice, totalPrice: amount, createdBy: loggedInId });
    await newStock.save()

    res.status(201).json({ message: "New stock add successfully.", newStock })
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getInventory = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const inventory = await Inventory.find({ schoolId: school._id, createdBy: loggedInId }).sort({ createdAt: -1 })
    if (!inventory.length) {
      return res.status(404).json({ message: "No stock found in inventory." })
    }

    res.status(200).json({ message: "Inventory stock:", inventory })
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.saleStockTo = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const {id} = req.params;
    if(!id){ return res.status(400).json({message:"Please provide id to sale stock."})}
    const { count, soldTo, soldToname, soldToId } = req.body; //user type, employeeId or registration number
    if (!count || !soldTo || !soldToname || !soldToId) {
      return res.status(400).json({ message: "Provide all the details (count, role, name, EmpNo / RegNo) to sale stock." })
    }

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const stock = await Inventory.findOne({ _id:id, schoolId: school._id })
    if (!stock) {
      return res.status(404).json({ message: `No stock found for the id. `})
    }

    if (count > stock.count) {
      return res.status(404).json({ message: `We have only ${stock.count} items in the inventory for ${stock.itemName}` })
    }

    const amount = count * stock.unitPrice

    const soldToUser = await Teacher.findOne({ schoolId: school._id, 'profile.fullname': soldToname, 'profile.employeeId': soldToId }) || await Student.findOne({ schoolId: school._id, 'studentProfile.fullname': soldToname, 'studentProfile.registrationNumber': soldToId })
    if (!soldToUser) {
      return res.status(404).json({ message: `No ${soldTo} found with the provided name and id.` })
    }
    const newSale = new SaleStock({ schoolId: school._id, itemName:stock.itemName, count, price: amount, soldTo, soldToname, soldToId, createdBy: loggedInId });
    await newSale.save()

    stock.count = stock.count - count
    if (stock.count == 0) {
      await stock.deleteOne({ _id: stock._id, schoolId: school._id })
    }
    else {
      stock.totalPrice = stock.unitPrice * stock.count
      await stock.save()
    }

    res.status(201).json({ message: `Please collect ₹${amount}. The stock has been successfully sold to ${soldToname}, and the inventory data has been updated.`, newSale })
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


//sale by itemNAME
// exports.saleStockTo = async (req, res) => {
//   try {
//     const { itemName, count, soldTo, soldToname, soldToId } = req.body; //user type, employeeId or registration number
//     if (!itemName || !count || !soldTo || !soldToname || !soldToId) {
//       return res.status(400).json({ message: "Provide all the data to sale stock." })
//     }

//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized.' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser || loggedInUser.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
//     };

//     const school = await School.findOne({ userId: loggedInId });
//     if (!school) {
//       return res.status(404).json({ message: 'Admin is not associated with any school.' });
//     };

//     const stock = await Inventory.findOne({ itemName, schoolId: school._id })
//     if (!stock) {
//       return res.status(404).json({ message: `No stock found for the item - ${itemName}. ` })
//     }

//     if (count > stock.count) {
//       return res.status(404).json({ message: `We have only ${stock.count} items in the inventory for ${itemName}` })
//     }

//     const amount = count * stock.unitPrice

//     const soldToUser = await Teacher.findOne({ schoolId: school._id, 'profile.fullname': soldToname, 'profile.employeeId': soldToId }) || await Student.findOne({ schoolId: school._id, 'studentProfile.fullname': soldToname, 'studentProfile.registrationNumber': soldToId })
//     if (!soldToUser) {
//       return res.status(404).json({ message: `No ${soldTo} found with the provided name and id.` })
//     }
//     const newSale = new SaleStock({ schoolId: school._id, itemName, count, price: amount, soldTo, soldToname, soldToId, createdBy: loggedInId });
//     await newSale.save()

//     stock.count = stock.count - count
//     if (stock.count == 0) {
//       await stock.deleteOne({ _id: stock._id, schoolId: school._id })
//     }
//     else {
//       stock.totalPrice = stock.unitPrice * stock.count
//       await stock.save()
//     }

//     res.status(201).json({ message: `Please collect ₹${amount}. The stock has been successfully sold to ${soldToname}, and the inventory data has been updated.`, newSale })
//   }catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message })
//   }
// };


exports.getSaleStock = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const sales = await SaleStock.find({ schoolId: school._id, createdBy: loggedInId }).sort({ createdAt: -1 })
    if (!sales.length) {
      return res.status(404).json({ message: "No sales list found." })
    }

    res.status(200).json({ message: "Inventory stock:", sales })
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'No school is associated to the loggedin user' })
    };

    const year = new Date().getFullYear() - 1;
    const startDate = new Date(year, 3, 1); //april
    const endDate = new Date(year + 1, 2, 31, 23, 59, 59); //march

    const studentsWithParents = [];

    const students = await Student.find({ schoolId: school._id, createdAt: { $gte: startDate, $lte: endDate } }).populate('userId').sort({ createdAt: -1 })
    if (!students.length) {
      res.status(200).json({ message: 'No admissions for this session year.' })
    };

    for (let student of students) {
      const studentWithParent = { student: student };
      const parents = await Parent.find({
        'parentProfile.parentOf': student._id
      });
      studentWithParent.parents = parents;

      studentsWithParents.push(studentWithParent);
    }
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
      total,
      male,
      female,
      studentsWithParents,
    });
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.addEmployee = async (req, res) => {
  try {
    const { name, role, department, mobileNumber, salary } = req.body;
    if (!name || !role || !department || !mobileNumber || !salary) {
      return res.status(400).json({ message: "Provide all the data to add employee." })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const newEmployee = new Employee({ schoolId: school._id, name, role, department, mobileNumber, salary })
    await newEmployee.save()
    res.status(201).json({ message: `Employee added to school.`, newEmployee })
  }catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getEmployees = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const employees = await Employee.find({ schoolId: school._id }).sort({ createdAt: -1 })
    if (!employees.length) {
      return res.status(404).json({ message: "No employees found in the school." })
    }

    let totalEmployeesSalary = 0;
    for (let employee of employees) {
      totalEmployeesSalary += employee.salary
    }

    res.status(200).json({ message: `Employees data of school:`, totalEmployeesSalary, employees })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
};


exports.editEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({ message: "Provide the employee id to edit." })
    }
    const { newName, newRole, newDepartment, newMobileNumber, newSalary } = req.body;
    if (!newName && !newRole && !newDepartment && !newMobileNumber && !newSalary) {
      return res.status(400).json({ message: "Provide atlease one new data to edit employee." })
    }
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const employee = await Employee.findOne({ schoolId: school._id, _id: employeeId })
    if (!employee) {
      return res.status(404).json({ message: "No employee found with the id in this school." })
    }

    if (newName) { employee.name = newName }
    if (newRole) { employee.role = newRole }
    if (newDepartment) { employee.department = newDepartment }
    if (newMobileNumber) { employee.mobileNumber = newMobileNumber }
    if (newSalary) { employee.salary = newSalary }

    await employee.save();

    res.status(201).json({ message: `Employee data updated successfully.`, employee })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
};


exports.createOrUpdateSyllabus = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized, only loggedin users can access this.' })
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'admin') {
            return res.status(404).json({
                message: 'Access denied, only admin have access.'
            })
        };

        const {className} = req.body;
        if(!className){return res.status(400).json({message:"Please provide class to upload syllabus."})}

        const school = await School.findOne({userId:loggedInId});

        let uploadedPhotoUrl = '';
        if (req.file) {
            try {
                const [photoUrl] = await uploadImage(req.file);
                uploadedPhotoUrl = photoUrl;
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
            }
        }

        let existingSyllabus = await Syllabus.findOne({ class: className, schoolId: school._id, createdBy:loggedInId });

        if (existingSyllabus) {
            existingSyllabus.syllabus = uploadedPhotoUrl;
            await existingSyllabus.save();

            return res.status(200).json({
                message: 'Syllabus updated successfully.',
                existingSyllabus,
            });
        } else {
            const newSyllabus = new Syllabus({
                schoolId: school._id,
                class: className,
                syllabus: uploadedPhotoUrl,
                createdBy: loggedInId,
            });
            if (!newSyllabus.class) {
                return res.status(404).json({ message: "Only admin can create syllabus." })
            }

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

exports.createAimObjective = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Provide all the data to create employee." })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const aimObjectives = await AimObjective.find({ schoolId: school._id })
    if (aimObjectives.length >= 3) {
      return res.status(404).json({ message: "You can only create a maximum of 3 aims and objectives. To create a new one, please delete an existing one." });
    }

    const newAO = new AimObjective({ schoolId: school._id, title, description })
    await newAO.save()
    res.status(201).json({ message: `Aim and Objective for school created successfully.`, newAO })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
};


exports.getAimObjective = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const associatedSchool = await School.findOne({ userId: loggedInId })
      schoolId = associatedSchool._id
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      schoolId = teacher.schoolId
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId })
      schoolId = student.schoolId
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId })
      schoolId = parent.schoolId
    }

    const aimObjectives = await AimObjective.find({ schoolId: schoolId })
    if (!aimObjectives.length) {
      return res.status(404).json({ message: "No aim and objectives found for the school." })
    }
    res.status(200).json({ message: `Aim & Objective of school:`, aimObjectives })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
};


exports.deleteAimObjective = async (req, res) => {
  try {
    const { aimobjectiveId } = req.params;
    if (!aimobjectiveId) {
      return res.status(400).json({ message: "Provide the aim objective id to delete." })
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const aimObjective = await AimObjective.findOneAndDelete({ schoolId: school._id, _id: aimobjectiveId })
    if (!aimObjective) {
      return res.status(404).json({ message: "No aim objective found with the id in this school." })
    }

    res.status(200).json({ message: `Aim and Objective deleted successfully.` })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
};


exports.createBook = async (req, res) => {
  try {
    const { bookName, author, subject, edition, price, pages } = req.body;
    if (!bookName || !author || !subject || !edition || !price || !pages) {
      return res.status(400).json({ message: 'Please provide all the details to create book.' })
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
      const school = await School.findOne({ userId: loggedInId });
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

    let uploadedPhotoUrl;
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    };

    const newBook = new Books({ schoolId, bookName, author, subject, edition, price, pages, photo: uploadedPhotoUrl });
    await newBook.save();

    res.status(201).json({
      message: "Book created successfully.",
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
      const school = await School.findOne({ userId: loggedInId });
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

      schoolId = employee.schoolId;
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId });
      if (!student) { return res.status(404).json({ message: 'No student found with the loggedin id.' }) }
      schoolId = student.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const books = await Books.find({ schoolId: schoolId }).sort({ createdAt: -1 });
    if (!books.length) {
      return res.status(404).json({ message: 'No books found.' })
    };

    res.status(200).json({
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
      const school = await School.findOne({ userId: loggedInId });
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

    res.status(200).json({
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


exports.getLibraryData = async (req, res) => {
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
      const school = await School.findOne({ userId: loggedInId });
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
      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const library = await BookRequests.find({ schoolId: schoolId }).populate('book').populate('requestedBy', '-studentProfile.previousEducation').sort({ createdAt: -1 });
    if (!library.length) {
      return res.status(404).json({ message: 'No library data found.' })
    };

    res.status(200).json({
      library,
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
      const school = await School.findOne({ userId: loggedInId });
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
    const currentDate = Date.now();

    await Notice.deleteMany({ date: { $lt: currentDate } });

    if (loggedInUser.role === 'admin') {
      const notice = await Notice.find({ createdBy: loggedInId, date: { $gt: currentDate } }).sort({ date: 1 });
      if (!notice.length) {
        return res.status(200).json({ message: "No notices for the school." })
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
          { createdBy: school.userId },
          { createdBy: teacher._id }
        ], date: { $gt: currentDate }
      }).sort({ createdAt: -1 });
      if (!notices.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      Notices = notices.map(notice => ({
        createdByText: notice.createdBy.equals(school.userId) ? 'Created by school.' : 'Created by you.',
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
          { createdBy: school.userId }
        ], date: { $gt: currentDate }
      }).sort({ createdAt: -1 });
      if (!notices.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." })
      };

      Notices = notices.map(notice => ({
        createdByText: notice.createdBy.equals(school.userId) ? 'Created by school.' : 'Created by the class teacher.',
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

      const schoolNotices = await Notice.find({ createdBy: school.userId, date: { $gt: currentDate } }).sort({ createdAt: -1 });

      let allTeacherNotices = [];

      for (const student of parent.parentProfile.parentOf) {
        const teacher = await Teacher.findOne({
          schoolId: school._id,
          'profile.class': student.studentProfile.class,
          'profile.section': student.studentProfile.section,
        });

        if (teacher) {
          const teacherNotices = await Notice.find({ createdBy: teacher._id, date: { $gt: currentDate } }).sort({ createdAt: -1 });
          allTeacherNotices = allTeacherNotices.concat(teacherNotices);
        }
      }

      const allNotices = [...schoolNotices, ...allTeacherNotices].sort((a, b) => b.createdAt - a.createdAt);
      if (!allNotices.length) {
        return res.status(404).json({ message: "No notices were created by the school or teacher." });
      }

      Notices = allNotices.map(notice => ({
        createdByText: notice.createdBy.equals(school.userId) ? 'Created by school.' : 'Created by the class teacher.',
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


exports.editNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    if (!noticeId) {
      return res.status(400).json({ message: 'Provide the notice id to update.' })
    };

    const updatedData = req.body;
    if (!updatedData.date && !updatedData.title && !updatedData.noticeMessage) {
      return res.status(400).json({ message: 'Please provide valid data to update.' });
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access denied, only logged-in users can access." })
    };

    let creator;

    if (loggedInUser.role === 'admin') {
      creator = loggedInId
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };
      creator = teacher._id
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to access this.' })
    }

    const notice = await Notice.findOneAndUpdate({ _id: noticeId, createdBy: creator }, updatedData, { new: true });
    if (!notice) {
      return res.status(404).json({ message: 'No notice found with the id (or) Only the creator of the notice can update.' })
    };
    res.status(201).json({ message: 'Notice updated successfull.', notice })
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
        return res.status(404).json({ message: 'The notice can only be deleted by the creator.' })
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
        return res.status(404).json({ message: 'The notice can only be deleted by the creator.' })
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
      const school = await School.findOne({ userId: loggedInId });
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
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only loggedin user's can access." });
    }

    let calendars = [];

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) return res.status(404).json({ message: 'Admin is not associated with any school.' });

      calendars = await Calendar.find({
        schoolId: school._id,
        displayTo: { $in: [loggedInUser.role] }
      }).sort({ date: 1 });
    }

    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) return res.status(404).json({ message: "No teacher found with the loggedin id." });

      const school = await School.findById(teacher.schoolId);

      calendars = await Calendar.find({
        $or: [
          { schoolId: teacher.schoolId, createdBy: school.userId, displayTo: { $in: [loggedInUser.role] } },
          { createdBy: teacher._id }
        ]
      }).sort({ date: 1 });
    }

    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId });
      if (!student) return res.status(404).json({ message: "No student found with the logged-in id." });

      const school = await School.findById(student.schoolId);
      const teacher = await Teacher.findOne({
        schoolId: student.schoolId,
        'profile.class': student.studentProfile.class,
        'profile.section': student.studentProfile.section
      });

      calendars = await Calendar.find({
        $or: [
          { schoolId: student.schoolId, createdBy: school.userId, displayTo: { $in: [loggedInUser.role] } },
          { schoolId: student.schoolId, createdBy: teacher._id, displayTo: { $in: [loggedInUser.role] } }
        ]
      }).sort({ date: 1 });
    }

    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf');
      if (!parent) return res.status(404).json({ message: "No parent found with the logged-in id." });

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
          { schoolId: parent.schoolId, createdBy: school.userId, displayTo: { $in: [loggedInUser.role] } },
          { schoolId: parent.schoolId, createdBy: { $in: teacherIds }, displayTo: { $in: [loggedInUser.role] } }
        ]
      }).sort({ date: 1 });
    }

    const googleCalendarURL = `https://www.googleapis.com/calendar/v3/calendars/en.indian%23holiday@group.v.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY}`;

    let googleEvents = [];

    try {
      const { data } = await axios.get(googleCalendarURL);
      googleEvents = data.items.map(event => {
        let description = event.description || '';
        if (description.startsWith('Observance')) {
          description = event.summary;
        }

        return {
          _id: event.id,
          title: event.summary,
          description,
          date: event.start.date,
          source: 'google-calendar'
        };
      });

    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    const formattedCalendars = calendars.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      displayTo: event.displayTo,
      source: 'local-db'
    }));

    const allEvents = [...formattedCalendars, ...googleEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!allEvents.length) {
      return res.status(404).json({ message: "No events found." });
    }

    res.status(200).json({
      message: 'Dynamic calendar data fetched successfully',
      calendars: allEvents
    });

  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    });
  }
};


exports.editDynamicCalendar = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in user's can access." });
    };

    const { calendarId } = req.params;
    if (!calendarId) { return res.status(400).json({ message: 'Please provide calendar id to update.' }) }

    const updatedData = req.body
    const hasValidUpdateFields = updatedData.date || updatedData.title || updatedData.description || (Array.isArray(updatedData.displayTo) && updatedData.displayTo.length > 0);

    if (!hasValidUpdateFields) {
      return res.status(400).json({ message: 'Provide at least one valid field to update.' });
    }

    let creator;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };

      creator = loggedInId

      if (!Array.isArray(updatedData.displayTo)) {
        updatedData.displayTo = [];
      }
      if (!updatedData.displayTo.includes('admin')) {
        updatedData.displayTo.push('admin');
      }
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the loggedin id." })
      }

      creator = teacher._id

      if (!Array.isArray(updatedData.displayTo)) {
        updatedData.displayTo = [];
      }
      if (!updatedData.displayTo.includes('teacher')) {
        updatedData.displayTo.push('teacher');
      }
    }
    else {
      return res.status(403).json({ message: "You are not allowed to access this." })
    }

    const calendar = await Calendar.findOneAndUpdate({ _id: calendarId, createdBy: creator }, updatedData, { new: true })
    if (!calendar) {
      return res.status(404).json({ message: 'No calendar found with the id (or) Only the creator of the calendar can update.' })
    }

    res.status(201).json({ message: 'Calendar updated successfully', calendar });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    })
  }
};


exports.deleteDynamicCalendar = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in user's can access." });
    };

    const { calendarId } = req.params;
    if (!calendarId) { return res.status(400).json({ message: 'Please provide calendar id to delete.' }) }

    let creator;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };

      creator = loggedInId;
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the loggedin id." })
      }

      creator = teacher._id;
    }
    else {
      return res.status(403).json({ message: "You are not allowed to access this." })
    }

    const calendar = await Calendar.findOneAndDelete({ _id: calendarId, createdBy: creator })
    if (!calendar) {
      return res.status(404).json({ message: 'No calendar found with the id (or) Only the creator of the calendar can delete it.' })
    }

    res.status(200).json({ message: 'Calendar deleted successfully' });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getDynamicCalendarByDate = async (req, res) => {
  try {
    const { calendarDate } = req.params;
    if (!calendarDate) {
      return res.status(400).json({ message: "Provide the date to get data." });
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users can access." });
    }

    let calendars = [];

    // Fetch local calendar events
    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) return res.status(404).json({ message: 'Admin is not associated with any school.' });

      calendars = await Calendar.find({
        schoolId: school._id,
        displayTo: { $in: [loggedInUser.role] },
        date: calendarDate
      });
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) return res.status(404).json({ message: "No teacher found with the logged-in id." });

      const school = await School.findById(teacher.schoolId);
      calendars = await Calendar.find({
        $or: [
          {
            schoolId: teacher.schoolId,
            createdBy: school.userId,
            displayTo: { $in: [loggedInUser.role] },
            date: calendarDate
          },
          { createdBy: teacher._id, date: calendarDate }
        ]
      });
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId });
      if (!student) return res.status(404).json({ message: "No student found with the logged-in id." });

      const school = await School.findById(student.schoolId);
      const teacher = await Teacher.findOne({
        schoolId: student.schoolId,
        'profile.class': student.studentProfile.class,
        'profile.section': student.studentProfile.section
      });

      calendars = await Calendar.find({
        $or: [
          {
            schoolId: student.schoolId,
            createdBy: school.userId,
            displayTo: { $in: [loggedInUser.role] },
            date: calendarDate
          },
          {
            schoolId: student.schoolId,
            createdBy: teacher._id,
            displayTo: { $in: [loggedInUser.role] },
            date: calendarDate
          }
        ]
      });
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId }).populate('parentProfile.parentOf');
      if (!parent) return res.status(404).json({ message: "No parent found with the logged-in id." });

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

      const teacherIds = teachers.map(t => t._id);

      calendars = await Calendar.find({
        $or: [
          {
            schoolId: parent.schoolId,
            createdBy: school.userId,
            displayTo: { $in: [loggedInUser.role] },
            date: calendarDate
          },
          {
            schoolId: parent.schoolId,
            createdBy: { $in: teacherIds },
            displayTo: { $in: [loggedInUser.role] },
            date: calendarDate
          }
        ]
      });
    }

    const googleCalendarURL = `https://www.googleapis.com/calendar/v3/calendars/en.indian%23holiday@group.v.calendar.google.com/events?key=${process.env.GOOGLE_CALENDAR_API_KEY}`;
    let googleEvents = [];

    try {
      const { data } = await axios.get(googleCalendarURL);
      googleEvents = data.items
        .filter(event => event.start?.date === calendarDate)
        .map(event => {
          let description = event.description || '';
          if (description.startsWith('Observance')) {
            description = event.summary;
          }

          return {
            _id: event.id,
            title: event.summary,
            description,
            date: event.start.date,
            source: 'google-calendar'
          };
        });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    const formattedLocalCalendars = calendars.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      displayTo: event.displayTo,
      source: 'local-db'
    }));

    const allEvents = [...formattedLocalCalendars, ...googleEvents];

    if (!allEvents.length) {
      return res.status(200).json({ message: `No events on ${calendarDate}.` });
    }

    res.status(200).json({
      message: 'Dynamic calendar data fetched successfully',
      calendars: allEvents
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.postSchoolExpensesForm = async (req, res) => {
  try {
    const { amount, purpose, classs, section, date } = req.body;
    if (!amount || !purpose || !date) {
      return res.status(400).json({ message: 'Please provide amount, purpose and date to post expense.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };
    let schoolId;
    const loggedInUser = await User.findById(loggedInId);
    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId })
      if (!school) { return res.status(404).json({ message: "You are not associated with any school." }) }
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(404).json({ message: "Only admin and accountant have access." }) }

    const newExpense = new SchoolExpenses({
      schoolId, amount, purpose, class: classs, section, date
    });

    await newExpense.save()

    res.status(201).json({
      message: 'Expense created successfully.',
      newExpense
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.editSchoolExpense = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    let schoolId;
    const loggedInUser = await User.findById(loggedInId);
    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId })
      if (!school) { return res.status(404).json({ message: "You are not associated with any school." }) }
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(404).json({ message: "Only admin and accountant have access." }) }

    const { expenseId } = req.params;
    if (!expenseId) {
      return res.status(400).json({ message: 'Please provide expenseId to update.' })
    };
    const data = req.body;
    if (!data.amount && !data.purpose && !data.class && !data.section && !data.date) {
      return res.status(400).json({ message: 'Please provide valid data to update.' })
    }

    const expense = await SchoolExpenses.findOneAndUpdate({ schoolId, _id: expenseId }, data, { new: true });
    if(!expense){return res.status(404).json({message:"No expense found with the id"})}

    res.status(201).json({
      message: 'Expense updated successfully.',
      expense
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.deleteSchoolExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    if (!expenseId) {
      return res.status(400).json({ message: 'Please provide expenseId to update it.' })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };
    let schoolId;
    const loggedInUser = await User.findById(loggedInId);
    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId })
      if (!school) { return res.status(404).json({ message: "You are not associated with any school." }) }
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(404).json({ message: "Only admin and accountant have access." }) }

    await SchoolExpenses.findOneAndDelete({ schoolId, _id: expenseId })
    res.status(200).json({
      message: 'Expense deleted successfully.',
    });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getTeacherItemRequest = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users' have access." })
    }

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) { return res.status(404).json({ message: "No accountant found with the logged-in id." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

    const teacherRequests = await ClassExpenses.find({ schoolId }).sort({ createdAt: -1 })
    if (!teacherRequests.length) { return res.status(200).json({ message: "No requests yet." }) }

    res.status(200).json({ teacherRequests })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.updateTeacherItemRequest = async (req, res) => {
  try {
    const { amount, status } = req.body;
    const { requestId } = req.params;
    if (!requestId || !status) { return res.status(400).json({ message: "Please provide request id and new status to update." }) }

    if (status === 'success') {
      if (!amount) {
        return res.status(400).json({ message: "Please specify amount to update." })
      }
    }
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users' have access." })
    }

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      if (!teacher) { return res.status(404).json({ message: "No accountant found with the logged-in id." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

    const teacherRequest = await ClassExpenses.findOne({ schoolId, _id: requestId })
    if (!teacherRequest) { return res.status(404).json({ message: "No request found with the id." }) }

    if(amount) teacherRequest.amount = amount;
    teacherRequest.status = status;
    await teacherRequest.save()

    // if (status == 'success') {
    //   const newExpense = new SchoolExpenses({ schoolId, amount, purpose: teacherRequest.purpose, class: teacherRequest.class, section: teacherRequest.section });
    //   await newExpense.save();
    // }

    res.status(201).json({ message: "Teacher item request updated successfully, if required - add the amount in school expenses.", teacherRequest })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


// exports.deleteTeacherItemRequest = async (req, res) => {
//   try {
//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser) {
//       return res.status(403).json({ message: "Access denied, only logged-in users' have access." })
//     }

//     const {requestId} = req.params;
//     if(!requestId){
//       return res.status(400).json({message:"Please provide the request id to delete."})
//     } 

//     let schoolId;

//     if (loggedInUser.role === 'admin') {
//       const school = await School.findOne({ userId: loggedInId });
//       if (!school) {
//         return res.status(404).json({ message: 'Admin is not associated with any school.' });
//       };
//       schoolId = school._id
//     }
//     else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
//       const teacher = await Teacher.findOne({ userId: loggedInId })
//       if (!teacher) { return res.status(404).json({ message: "No accountant found with the logged-in id." }) }
//       schoolId = teacher.schoolId
//     }
//     else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

//     const teacherRequest = await ClassExpenses.findOne({ schoolId, _id:requestId });
//     if (!teacherRequest) { return res.status(404).json({ message: "No request found with the provided id." }) }

//     await teacherRequest.deleteOne()
//     res.status(200).json({message:"Teacher item request deleted successfully."})
//   }
//   catch (err) {
//   res.status(500).json({ message: 'Internal server error', error: err.message })
// }
// };


exports.getAccounts = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users can access." });
    }

    let schoolId, schoolName;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      }
      schoolId = school._id
      schoolName = school.schoolName
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId')
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the logged-in id." });
      }
      schoolId = teacher.schoolId._id
      schoolName = teacher.schoolId.schoolName
    }
    else {
      return res.status(404).json({ message: "Only admin and accountants have access." });
    }

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let monthlyData = {};

    const fees = await ParentExpenses.find({ schoolId, 'paymentDetails.status': 'success', purpose: 'Fees' });
    for (let fee of fees) {
      const feeDate = new Date(fee.createdAt);
      if (isNaN(feeDate)) continue;

      const monthName = months[feeDate.getMonth()];
      const year = feeDate.getFullYear();
      const monthYear = `${monthName} ${year}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalInventoryAmount: 0, totalAdmissionFees: 0, totalExpenses: 0, totalRevenue: 0, totalIncome: 0 };
      }

      monthlyData[monthYear].totalFees += fee.amount;
    }

    const inventories = await ParentExpenses.find({ schoolId, 'paymentDetails.status': 'success', purpose: 'Inventory' });
    for (let inventory of inventories) {
      const inventoryDate = new Date(inventory.createdAt);
      if (isNaN(inventoryDate)) continue;

      const monthName = months[inventoryDate.getMonth()];
      const year = inventoryDate.getFullYear();
      const monthYear = `${monthName} ${year}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalInventoryAmount: 0, totalAdmissionFees: 0, totalExpenses: 0, totalRevenue: 0, totalIncome: 0 };
      }

      monthlyData[monthYear].totalInventoryAmount += inventory.amount;
    }

    const admissions = await ApplyOnline.find({ 'studentDetails.schoolName': schoolName, 'paymentDetails.status': 'success' });
    for (let admission of admissions) {
      const admissionDate = new Date(admission.createdAt);
      if (isNaN(admissionDate)) continue;

      const monthName = months[admissionDate.getMonth()];
      const year = admissionDate.getFullYear();
      const monthYear = `${monthName} ${year}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalInventoryAmount: 0, totalAdmissionFees: 0, totalExpenses: 0, totalRevenue: 0, totalIncome: 0 };
      }

      monthlyData[monthYear].totalAdmissionFees += Number(admission.studentDetails.admissionFees);
    }

    const expenses = await SchoolExpenses.find({ schoolId });
    for (let expense of expenses) {
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate)) continue;

      const monthName = months[expenseDate.getMonth()];
      const year = expenseDate.getFullYear();
      const monthYear = `${monthName} ${year}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalInventoryAmount: 0, totalAdmissionFees: 0, totalExpenses: 0, totalRevenue: 0, totalIncome: 0 };
      }

      monthlyData[monthYear].totalExpenses += expense.amount;
    }
    //teacher/class item request
    for (let monthYear in monthlyData) {
      const data = monthlyData[monthYear];
      data.totalRevenue = data.totalFees + data.totalInventoryAmount + data.totalAdmissionFees;
      data.totalIncome = data.totalRevenue - data.totalExpenses;
    }

    const result = Object.keys(monthlyData).map(key => ({
      monthYear: key,
      totalFeesCollected: monthlyData[key].totalFees,
      totalInventoryAmount: monthlyData[key].totalInventoryAmount,
      totalAdmissionFees: monthlyData[key].totalAdmissionFees,
      totalRevenue: monthlyData[key].totalRevenue,
      totalExpenses: monthlyData[key].totalExpenses,
      totalIncome: monthlyData[key].totalIncome
    }));

    result.sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

    res.status(200).json({ accounts: result });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getAccountsData = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users' have access." })
    }

    let schoolId, schoolName;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'Admin is not associated with any school.' });
      };
      schoolId = school._id;
      schoolName = school.schoolName;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId')
      if (!teacher) { return res.status(404).json({ message: "No accountant found with the logged-in id." }) }
      schoolId = teacher.schoolId._id;
      schoolName = teacher.schoolId.schoolName;
    }
    else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

    const revenue = await ParentExpenses.find({ schoolId }).sort({ createdAt: -1 })
    if (!revenue.length) { res.status(200).json({ message: "No payment done yet." }) }

    const admissions = await ApplyOnline.find({ 'studentDetails.schoolName': schoolName }).select('studentDetails paymentDetails').sort({ createdAt: -1 })
    if (!admissions.length) { res.status(200).json({ message: "No admissions done yet." }) }

    const expenses = await SchoolExpenses.find({ schoolId }).sort({ date: -1 });
    if (!expenses.length) { res.status(200).json({ message: "No expenses yet." }) }
    //teacher/class item request
    res.status(200).json({ revenue, admissions, expenses })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};