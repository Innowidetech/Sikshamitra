const School = require('../models/School');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const { sendEmail } = require('../utils/sendEmail');
const registrationTemplate = require('../utils/registrationTemplate');
const Books = require('../models/Books');
const { uploadImage, deleteImage } = require('../utils/multer');
const Notice = require('../models/Notice');
const Class = require('../models/classes');
const Calendar = require('../models/Calendar');
const ClassWiseFees = require('../models/ClassWiseFees');
const StudentDataUpdates = require('../models/StudentDataUpdates');
const Inventory = require('../models/Inventory');
const SaleStock = require('../models/SaleStock');
const BookRequests = require('../models/BookRequests');
const SchoolStaff = require('../models/SchoolStaff');
const Syllabus = require('../models/Syllabus');
const AimObjective = require('../models/Aim&Objective');
const AandL = require('../models/AdminAandL');
const AandLUpdates = require('../models/AandLUpdates');
const ParentExpenses = require('../models/ParentExpenses');
const SchoolExpenses = require('../models/SchoolExpenses');
const RequestExpense = require('../models/RequestExpense');
const ApplyOnline = require('../models/applyOnline')
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const classUpdateTemplate = require('../utils/classUpdateTemplate');
const formatTimeToIST = require('../utils/formatTimeToIST');
const SchoolIncome = require('../models/SchoolIncome');
const SchoolIncomeUpdates = require('../models/SchoolIncomeUpdates');
const ApplyOffline = require('../models/applyOffline');
const SchoolStaffTasks = require('../models/SchoolStaffTasks');
const ApplyForEntranceExam = require('../models/ApplyForEntranceExam');
const EntranceExamQuestionPaper = require('../models/EntranceExamQuestionPaper');
const EntranceExamDetailsTemplate = require('../utils/EntranceExamDetailsTemplate');
const EntranceExamResults = require('../models/EntranceExamResults');
const EntranceExamResultsTemplate = require('../utils/EntranceExamResultsTemplate');


//get profile
exports.getProfile = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized, only logged-in users can get their data.' })
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'No user found with the loggedin Id.' })
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
    const { schoolCode, schoolName, address, principalName } = req.body;
    const edit = req.body; // contact, details, payment

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({ message: "No school is associated with the admin." })
    }

    let uploadedLogoUrl = school.schoolLogo;
    let uploadedBannerUrl = school.schoolBanner;
    if (req.files) {
      if (req.files.logo) {
        try {
          if (school.schoolLogo) {
            await deleteImage(school.schoolLogo);
          }
          const [logoUrl] = await uploadImage(req.files.logo);
          uploadedLogoUrl = logoUrl;
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload logo.', error: error.message });
        }
      }
      if (req.files.banner) {
        try {
          if (school.schoolBanner) {
            await deleteImage(school.schoolBanner);
          }
          const [bannerUrl] = await uploadImage(req.files.banner);
          uploadedBannerUrl = bannerUrl;
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload banner.', error: error.message });
        }
      }
    }
    school.schoolLogo = uploadedLogoUrl;
    school.schoolBanner = uploadedBannerUrl;
    school.schoolName = schoolName || school.schoolName;
    school.schoolCode = schoolCode || school.schoolCode;
    school.address = address || school.address
    school.principalName = principalName || school.principalName

    for (const key in edit) {
      if (school.contact.hasOwnProperty(key)) {
        school.contact[key] = edit[key];
      }
      if (school.details.hasOwnProperty(key)) {
        school.details[key] = edit[key];
      }
      if (school.paymentDetails.hasOwnProperty(key)) {
        school.paymentDetails[key] = edit[key];
      }
    }

    await school.save();

    return res.status(200).json({
      message: 'School data updated successfully.',
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

    const parentExpenses = await ParentExpenses.find({ schoolId: school._id, 'paymentDetails.status': 'success' });
    const onlineIncome = await ApplyOnline.find({ 'studentDetails.schoolName': school.schoolName, 'paymentDetails.status': 'success' });
    const schoolIncomeForm = await SchoolIncome.find({ schoolId: school._id })
    const expenses = await SchoolExpenses.find({ schoolId: school._id })

    totalIncome += parentExpenses.reduce((acc, item) => acc + item.amount, 0);
    totalIncome += onlineIncome.reduce((acc, item) => acc + parseFloat(item.studentDetails.admissionFees), 0);
    totalIncome += schoolIncomeForm.reduce((acc, item) => acc + item.amount, 0)
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
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create classes.' });
    };
    const { classType, classs, section, teacherName } = req.body;

    if (!classType || !classs || !section) {
      return res.status(400).json({ message: "Please enter all the details to create class." })
    };

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    let teacherData, schoolName;

    if (teacherName) {
      const teacher = await Teacher.findOne({ 'profile.fullname': teacherName, schoolId: associatedSchool._id }).populate('userId')
      if (!teacher) {
        return res.status(404).json({ message: "The teacher is not associated with this school." })
      }
      teacherData = teacher;
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
      teacher: teacherData.profile.fullname,
      createdBy: loggedInId
    });
    await newClass.save();

    schoolName = associatedSchool.schoolName
    if (teacherName) {
      await sendEmail(teacherData.userId.email, adminUser.email, `${associatedSchool.schoolName} - Class Assignment Update`, classUpdateTemplate(teacherName, classs, section, schoolName))
    }

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

    if (!newTeacher || !classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Please provide new teacher name and valid class Id to update the class details." })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only logged-in admin can edit class.' });
    };

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    };

    const existingClass = await Class.findOne({ _id: classId, schoolId: associatedSchool._id })
    if (!existingClass) {
      return res.status(404).json({ message: `No class found with the id in this school.` })
    }

    const teacher = await Teacher.findOne({ 'profile.fullname': newTeacher, schoolId: associatedSchool._id }).populate('userId')
    if (!teacher) {
      return res.status(404).json({ message: "The teacher is not associated with this school." })
    }

    existingClass.teacher = teacher.profile.fullname
    await existingClass.save();

    teacher.profile.class = existingClass.class;
    teacher.profile.section = existingClass.section;
    await teacher.save()

    var teacherName = teacher.profile.fullname;
    var teacherClass = existingClass.class;
    var teacherSection = existingClass.section;
    var schoolName = associatedSchool.schoolName;

    await sendEmail(teacher.userId.email, adminUser.email, `${associatedSchool.schoolName} - Class Assignment Update`, classUpdateTemplate(teacherName, teacherClass, teacherSection, schoolName))

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
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view classes.' });
    }

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) {
      return res.status(400).json({ message: 'Admin is not associated with any school.' });
    }

    const classes = await Class.find({ schoolId: associatedSchool._id })
    classes.sort((a, b) => {
      const classDiff = parseInt(a.class) - parseInt(b.class);
      return classDiff !== 0 ? classDiff : a.section.localeCompare(b.section);
    });

    if (!classes.length) {
      return res.status(404).json({ message: 'No classes found for this school.' });
    }

    const classData = await Promise.all(classes.map(async (cls) => {
      const studentCount = await Student.countDocuments({
        schoolId: associatedSchool._id,
        'studentProfile.class': cls.class,
        'studentProfile.section': cls.section
      });

      return {
        _id: cls._id,
        classType: cls.classType,
        class: cls.class,
        section: cls.section,
        teacher: cls.teacher,
        studentCount
      };
    }));

    return res.status(200).json({
      message: 'Classes fetched successfully.',
      classData
    });

  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message
    });
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

    const user = new User({ email, password: hpass, role: 'teacher', employeeType, createdBy: userId });
    await user.save();

    const teacher = new Teacher({
      userId: user._id,
      profile: {
        ...profile,
        photo: uploadedPhotoUrl,
      },
      education,
      createdBy: userId,
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

    res.status(201).json({ message: `Teacher account created successfully.`, teacher, });
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

    const teachers = await Teacher.find({ schoolId: associatedSchool._id }).populate({ path: 'userId', select: 'employeeType' }).select('profile.fullname');
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
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized.' }); };

    const adminUser = await User.findById(loggedInId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins are allowed to update authority details.' });
    };

    const associatedSchool = await School.findOne({ userId: loggedInId });
    if (!associatedSchool) { return res.status(400).json({ message: 'Admin is not associated with any school.' }); };

    const { action, employeeType, teacherName, oldTeacher } = req.body;
    if (!action || !employeeType || !teacherName) {
      return res.status(400).json({ message: "Provide all the details to update or delete." })
    }

    if (action == 'add' && (employeeType === 'accountant' || employeeType === 'librarian')) {
      const teacher = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': teacherName }).populate('userId')
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the name in this school." }) }

      const aandL = await AandL.findOne({ schoolId: associatedSchool._id })
      if (!aandL) {
        const newAandL = new AandL({ schoolId: associatedSchool._id, accountants: [], librarians: [] });
        await newAandL.save()
      }

      teacher.userId.employeeType = employeeType;
      teacher.userId.save();

      aandL[employeeType + 's'].push(teacher._id);
      await aandL.save();

      return res.status(200).json({ message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} added successfully.`, aandL });
    }

    else if (action == 'update' && (employeeType === 'accountant' || employeeType === 'librarian')) {

      if (!oldTeacher) { return res.status(404).json({ message: "Please specify old Teacher name to update." }) }

      const aandL = await AandL.findOne({ schoolId: associatedSchool._id })
      const targetArray = employeeType + "s";

      const oldTeacherRecord = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': oldTeacher }).populate("userId");
      if (!oldTeacherRecord) { return res.status(404).json({ message: "Teacher not found in this school." }); }

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

      const aandLUpdate = new AandLUpdates({ schoolId: associatedSchool._id, previousData, updatedData });
      await aandLUpdate.save();

      return res.status(200).json({
        message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} updated successfully.`, aandL,
      });
    }

    else if (action == 'delete' && (employeeType === 'accountant' || employeeType === 'librarian')) {
      if (!teacherName) { return res.status(400).json({ message: "Please specify the teacher name to delete." }); }

      const aandL = await AandL.findOne({ schoolId: associatedSchool._id });
      if (!aandL) { return res.status(404).json({ message: "Authority data not found for this school." }); }

      const teacher = await Teacher.findOne({ schoolId: associatedSchool._id, 'profile.fullname': teacherName }).populate('userId');
      if (!teacher) { return res.status(404).json({ message: "Teacher not found in this school." }); }

      const targetArray = employeeType + 's';
      const index = aandL[targetArray].indexOf(teacher._id);

      if (index === -1) {
        return res.status(404).json({ message: `Teacher is not assigned as a ${employeeType}.` });
      }

      aandL[targetArray].splice(index, 1);

      if (teacher.profile.subjects && teacher.profile.subjects.length > 0) {
        teacher.userId.employeeType = "teaching";
      } else {
        teacher.userId.employeeType = "-";
      }

      await teacher.userId.save();
      await aandL.save();

      return res.status(200).json({
        message: `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} removed successfully.`, aandL,
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
    if (!school) { return res.status(404).json({ message: 'School not found.' }); };

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

    res.status(200).json({ message: 'Teachers retrieved successfully.', totalTeachersSalary, teachers: sortedTeachers, });
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
    const { email, parentEmail, password, parentPassword, studentProfile, parentProfile } = req.body;

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
      if (!school) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
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
        message: `Parent's email already exist, try again with different email or add student to existing parent.`,
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

    const classWiseFees = parseInt(studentProfile.class).toString();
    const feesIs = await ClassWiseFees.findOne({
      schoolId: associatedSchool,
      class: { $regex: new RegExp(`^0*${classToMatch}$`) }
    });
    if (!feesIs) { return res.status(404).json({ message: "No fees found for the class." }) }


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


// exports.xudentToExistingParent = async (req, res) => {
//   try {
//     const {       parentEmail,        email,       password,       studentProfile     } = req.body; // the existing parent's email
//     if (!parentEmail || !email || !studentProfile || !password) {
//       return res.status(400).json({ message: 'Please provide all the required details to register the student.' });
//     };

//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in admins or teachers can create accounts.' });
//     }

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser) {
//       return res.status(403).json({ message: 'Only logged-in admins or teachers can create student accounts.' });
//     }

//     let associatedSchool, creator, schoolName;

//     if (loggedInUser.role === 'admin') {
//       const school = await School.findOne({ userId: loggedInId }).populate('userId');
//       if (!school) {
//         return res.status(404).json({ message: "No school is associated with the logged-in user." })
//       }
//       creator = loggedInId;
//       associatedSchool = school._id;
//       schoolName = school.schoolName;
//     }
//     else if (loggedInUser.role === 'teacher') {
//       const teacher = await Teacher.findOne({ userId: loggedInId });
//       if (!teacher) {
//         return res.status(404).json({ message: "No teacher found with the logged-in id." })
//       }
//       const school = await School.findById(teacher.schoolId)
//       if (!school) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
//       creator = loggedInId;
//       associatedSchool = teacher.schoolId;
//       schoolName = school.schoolName
//     }

//     const parentUser = await User.findOne({ email: parentEmail });
//     if (!parentUser) {
//       return res.status(404).json({ message: 'Parent does not exist, please enter correct parent email or create new account.' });
//     }

//     const parent = await Parent.findOne({ userId: parentUser._id, schoolId: associatedSchool });
//     if (!parent) {
//       return res.status(404).json({ message: 'No parent profile found for this user.' });
//     }

//     const existingStudent = await User.findOne({ email });
//     if (existingStudent) {
//       return res.status(400).json({
//         message: "Student's email already exists, try again with a different email.",
//       });
//     }

//     let uploadedPhotoUrl = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
//     if (req.file) {
//       try {
//         const [photoUrl] = await uploadImage(req.file);
//         uploadedPhotoUrl = photoUrl;
//       } catch (error) {
//         return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
//       }
//     };

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const classWiseFees = await ClassWiseFees.findOne({
//       schoolId: associatedSchool,
//       class: studentProfile.class,
//     });
//     if (!classWiseFees) {
//       return res.status(404).json({ message: 'Class-wise fee details not found for the selected class.' });
//     }

//     const studentFees = classWiseFees.tutionFees

//     const studentUser = new User({
//       email,
//       password: hashedPassword,
//       role: 'student',
//       createdBy: creator,
//     });

//     const savedStudentUser = await studentUser.save();

//     const student = new Student({
//       userId: savedStudentUser._id,
//       studentProfile: {
//         ...studentProfile,
//         photo: uploadedPhotoUrl,
//         fees: studentFees,
//         childOf: parentUser._id,
//       },
//       createdBy: creator,
//       schoolId: associatedSchool,
//     });

//     await student.save();

//     parent.parentProfile.parentOf.push(student._id);
//     await parent.save();

//     var adminEmail = loggedInUser.email
//     var studentName = student.studentProfile.fullname

//     await sendEmail(email, adminEmail, `Account registration - Shikshamitra`, registrationTemplate(studentName, schoolName, email, password));

//     res.status(201).json({
//       message: 'Student account created and added to existing parent successfully.',
//       student,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message })
//   }
// };

exports.getStudentsBasedOnClassAndSection = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins or teachers can create accounts.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Only logged-in admins or teachers can create student accounts.' });
    }

    let associatedSchool;
    const { className, section } = req.params;
    if (!className || !section) { return res.status(400).json({ message: "Please provide class and section to get info." }) }
    let sectionIs = section.toUpperCase();

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId }).populate('userId');
      if (!school) {
        return res.status(404).json({ message: "No school is associated with the logged-in user." })
      }
      associatedSchool = school._id;
    }
    else if (loggedInUser.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: "No teacher found with the logged-in id." })
      }
      const school = await School.findById(teacher.schoolId)
      if (!school) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      associatedSchool = teacher.schoolId;
    }

    const students = await Student.find({ schoolId: associatedSchool, 'studentProfile.class': className, 'studentProfile.section': sectionIs }).select('studentProfile.fullname studentProfile.childOf')
      .populate({ path: 'studentProfile.childOf', ref: 'User', select: 'email' });
    if (!students.length) { return res.status(404).json({ message: "No students found for the class and section." }) }

    res.status(200).json(students)
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.addStudentToExistingParent = async (req, res) => {
  try {
    const { existingStudentName, email, password, studentProfile } = req.body;  // to get existing parent's email
    if (!existingStudentName || !email || !studentProfile || !password) {
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
      if (!school) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      creator = loggedInId;
      associatedSchool = teacher.schoolId;
      schoolName = school.schoolName
    }

    const existingStudent = await Student.findOne({ schoolId: associatedSchool, 'studentProfile.fullname': existingStudentName }).select('studentProfile.fullname studentProfile.childOf')
      .populate({ path: 'studentProfile.childOf', ref: 'User', select: 'email' });
    if (!existingStudent) { return res.status(404).json({ message: "No student found with the name in this school." }) }


    const parentUser = await User.findOne({ email: existingStudent.studentProfile.childOf.email });
    if (!parentUser) {
      return res.status(404).json({ message: 'Parent does not exist, please enter correct parent email or create new account.' });
    }

    const parent = await Parent.findOne({ userId: parentUser._id, schoolId: associatedSchool });
    if (!parent) {
      return res.status(404).json({ message: 'No parent profile found for this user.' });
    }

    const existingStudentEmail = await User.findOne({ email });
    if (existingStudentEmail) {
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
      if (!employee.schoolId) { return res.status(404).json({ message: "Employee is not associated with any school." }) }
      schoolId = employee.schoolId;
    } else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' });
    }

    const parents = await Parent.find({ schoolId: schoolId })
      .populate({ path: 'parentProfile.parentOf', populate: { path: 'userId' } });
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
//         return res.status(404).json({ message: 'The teacher is not associated with any school.' })
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




// exports.updateStudentData = async (req, res) => {
//   try {
//     const adminId = req.user && req.user.id;
//     if (!adminId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
//     };

//     const adminUser = await User.findById(adminId);
//     if (!adminUser || adminUser.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Only admins can access.' });
//     };

//     const { studentId } = req.params;
//     const edit = req.body;
//     const { isActive, reason } = req.body;

//     if (!studentId || !reason) {
//       return res.status(400).json({ message: 'Please provide studentId, new data and reason for the update.' })
//     }

//     const school = await School.findOne({ userId: adminId });
//     if (!school) {
//       return res.status(404).json({ message: 'Admin is not associated with any school.' });
//     };

//     const student = await Student.findOne({ schoolId: school._id, _id: studentId }).populate('userId');
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found.' });
//     };

//     const previousData = {
//       ...student.studentProfile.toObject(),
//       isActive: student.userId.isActive
//     };
//     const previousIsActive = student.userId.isActive;

//     for (const key in edit) {
//       if (student.studentProfile.hasOwnProperty(key)) {
//         student.studentProfile[key] = edit[key];
//       }
//     }
//     await student.save();

//     let updatedIsActive = previousIsActive;
//     if (isActive !== undefined) {
//       student.userId.isActive = isActive,
//         updatedIsActive = isActive
//     }
//     await student.userId.save();

//     const updatedData = {
//       ...student.studentProfile.toObject(),
//       isActive: updatedIsActive
//     };

//     const dataUpdate = new StudentDataUpdates({
//       schoolId: student.schoolId,
//       studentId: student._id,
//       previousData,
//       updatedData,
//       reason,
//       updatedBy: adminId,
//     });
//     await dataUpdate.save();

//     res.status(200).json({
//       message: 'Student data updated successfully.',
//       updatedStudent: student,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message })
//   }
// };

exports.updateStudentData = async (req, res) => {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in admins can perform this action.' });
    };

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can access.' });
    };

    const { studentId } = req.params;
    const edit = req.body;
    const { isActive, reason } = req.body;

    if (!studentId || !reason) {
      return res.status(400).json({ message: 'Please provide studentId, new data and reason for the update.' })
    }

    const school = await School.findOne({ userId: adminId });
    if (!school) { return res.status(404).json({ message: 'Admin is not associated with any school.' }); };

    const student = await Student.findOne({ schoolId: school._id, _id: studentId }).populate('userId');
    if (!student) { return res.status(404).json({ message: 'Student not found.' }); };

    const previousData = {
      ...student.studentProfile.toObject(),
      isActive: student.userId.isActive
    };

    for (const key in edit) {
      if (student.studentProfile.hasOwnProperty(key)) {
        student.studentProfile[key] = edit[key];
      }
    }
    await student.save();

    if (isActive !== undefined) {
      student.userId.isActive = isActive
    }
    await student.userId.save();

    let dataUpdate = await StudentDataUpdates.findOne({ schoolId: school._id, studentId });
    if (dataUpdate) {
      dataUpdate.dataHistory.push({
        previousData,
        reason,
        updatedBy: adminId,
        updatedAt: Date.now()
      });
      await dataUpdate.save();
    }
    else {
      dataUpdate = new StudentDataUpdates({
        schoolId: student.schoolId,
        studentId: student._id,
        dataHistory: [{
          previousData,
          reason,
          updatedBy: adminId,
          updatedAt: Date.now()
        }]
      });
      await dataUpdate.save();
    }
    res.status(200).json({
      message: 'Student data updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getUpdatedStudentData = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const { studentId } = req.params;
    if (!studentId) { return res.status(400).json({ message: "Provide student id to get." }) }

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const studentDataUpdates = await StudentDataUpdates.findOne({ schoolId: school._id, studentId: studentId })
    if (studentDataUpdates) {
      studentDataUpdates.dataHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      res.status(200).json({
        message: 'Data history retrieved successfully.',
        dataHistory: studentDataUpdates.dataHistory,
      });
    } else {
      res.status(404).json({ message: 'No data history found for this student.' });
    }
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


// exports.saleStockTo = async (req, res) => {
//   try {
//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized.' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser || loggedInUser.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
//     };

//     const { id } = req.params;
//     if (!id) { return res.status(400).json({ message: "Please provide id to sale stock." }) }
//     const { count, soldTo, soldToname, soldToId } = req.body; //user type, employeeId or registration number
//     if (!count || !soldTo || !soldToname || !soldToId) {
//       return res.status(400).json({ message: "Provide all the details (count, role, name, EmpNo / RegNo) to sale stock." })
//     }

//     const school = await School.findOne({ userId: loggedInId });
//     if (!school) {
//       return res.status(404).json({ message: 'Admin is not associated with any school.' });
//     };

//     const stock = await Inventory.findOne({ _id: id, schoolId: school._id })
//     if (!stock) {
//       return res.status(404).json({ message: `No stock found for the id. ` })
//     }

//     if (count > stock.count) {
//       return res.status(404).json({ message: `We have only ${stock.count} items in the inventory for ${stock.itemName}` })
//     }

//     const amount = count * stock.unitPrice

//     const soldToUser = await Teacher.findOne({ schoolId: school._id, 'profile.fullname': soldToname, 'profile.employeeId': soldToId }) || await Student.findOne({ schoolId: school._id, 'studentProfile.fullname': soldToname, 'studentProfile.registrationNumber': soldToId })
//     if (!soldToUser) {
//       return res.status(404).json({ message: `No ${soldTo} found with the provided name and id.` })
//     }
//     const newSale = new SaleStock({ schoolId: school._id, itemName: stock.itemName, count, price: amount, soldTo, soldToname, soldToId, createdBy: loggedInId });
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
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message })
//   }
// };


//sale by itemNAME
exports.saleStockTo = async (req, res) => {
  try {
    const { itemName, count, soldTo, soldToname, soldToId } = req.body; //user type, employeeId or registration number
    if (!itemName || !count || !soldTo || !soldToname || !soldToId) {
      return res.status(400).json({ message: "Provide all the data to sale stock." })
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

    const stock = await Inventory.findOne({ itemName, schoolId: school._id })
    if (!stock) {
      return res.status(404).json({ message: `No stock found for the item - ${itemName}. ` })
    }

    if (count > stock.count) {
      return res.status(404).json({ message: `We have only ${stock.count} items in the inventory for ${itemName}` })
    }

    const amount = count * stock.unitPrice

    const soldToUser = await Teacher.findOne({ schoolId: school._id, 'profile.fullname': soldToname, 'profile.employeeId': soldToId }) || await Student.findOne({ schoolId: school._id, 'studentProfile.fullname': soldToname, 'studentProfile.registrationNumber': soldToId })
    if (!soldToUser) {
      return res.status(404).json({ message: `No ${soldTo} found with the provided name and id.` })
    }
    const newSale = new SaleStock({ schoolId: school._id, itemName, count, price: amount, soldTo, soldToname, soldToId, createdBy: loggedInId });
    await newSale.save()

    stock.count = stock.count - count
    if (stock.count == 0) {
      await stock.deleteOne({ _id: stock._id, schoolId: school._id })
    }
    else {
      stock.totalPrice = stock.unitPrice * stock.count
      await stock.save()
    }
    res.status(201).json({ message: `Please collect ₹${amount}. The stock has been successfully sold to ${soldToname}.`, newSale })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


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
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


// get new admission of students
exports.getNewAdmissions = async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getAdmissionRequests = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: "Unauthorized." }) }

    const loggedInUser = await User.findById(loggedInId)
    if (!loggedInUser || loggedInUser.role !== 'admin') { return res.status(403).json({ message: "Access Denied. Only logged-in users can access." }) }

    const school = await School.findOne({ userId: loggedInId });
    if (!school) { return res.status(404).json({ message: "The logged-in admin is not associated with any school." }) }

    const onlineRequests = await ApplyOnline.find({ 'studentDetails.schoolName': school.schoolName, approval: false }).sort({ createdAt: -1 });
    const offlineRequests = await ApplyOffline.find({ schoolName: school.schoolName }).sort({ createdAt: -1 });
    res.status(200).json({ onlineRequests, offlineRequests });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message })
  }
};


exports.createInstantAccount = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: "Unauthorized." }) }

    const loggedInUser = await User.findById(loggedInId)
    if (!loggedInUser || loggedInUser.role !== 'admin') { return res.status(403).json({ message: "Access Denied. Only logged-in users can access." }) }

    const school = await School.findOne({ userId: loggedInId });
    if (!school) { return res.status(404).json({ message: "The logged-in admin is not associated with any school." }) }

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ message: 'The admission request id is not valid.' }) }

    const { registrationNumber } = req.body;
    if (!registrationNumber) { return res.status(400).json({ message: "Please provide registration number to register the student." }) }

    const request = await ApplyOnline.findOne({ _id: id, 'studentDetails.schoolName': school.schoolName });
    if (!request) { return res.status(404).json({ message: "No online application request found with the id in this school." }) }

    let classTypeIs;
    if (request.studentDetails.classToJoin) {
      const classNum = parseInt(request.studentDetails.classToJoin, 10);
      if (classNum >= 1 && classNum <= 8) {
        classTypeIs = "primary";
      } else if (classNum >= 9 && classNum <= 12) {
        classTypeIs = "secondary";
      }
    }
    const classToMatch = parseInt(request.studentDetails.classToJoin).toString();
    const feesIs = await ClassWiseFees.findOne({
      schoolId: school._id,
      class: { $regex: new RegExp(`^0*${classToMatch}$`) }
    });
    if (!feesIs) { return res.status(404).json({ message: "No fees found for the class." }) }

    let passwordIs = bcrypt.hashSync(request.parentDetails.fatherPhone, 10);

    const studentUser = new User({ email: request.studentDetails.email, password: passwordIs, role: 'student', createdBy: loggedInId });
    await studentUser.save();
    const parentUser = new User({ email: request.parentDetails.email, password: passwordIs, role: 'parent', createdBy: loggedInId })
    await parentUser.save();
    const student = new Student({ schoolId: school._id, userId: studentUser._id, 'studentProfile.fullname': `${request.studentDetails.firstName} ${request.studentDetails.lastName}`, 'studentProfile.gender': request.studentDetails.gender, 'studentProfile.dob': request.studentDetails.dob, 'studentProfile.photo': request.studentDetails.photo.url, 'studentProfile.address': request.studentDetails.address, 'studentProfile.registrationNumber': registrationNumber, 'studentProfile.class': request.studentDetails.classToJoin, 'studentProfile.classType': classTypeIs, 'studentProfile.childOf': parentUser._id, 'studentProfile.fees': feesIs.tutionFees, createdBy: loggedInId });
    await student.save();

    const parentProfile = {
      fatherName: request.parentDetails.fatherName,
      fatherPhoneNumber: request.parentDetails.fatherPhone,
      parentAddress: request.parentDetails.address,
      parentOf: [student._id],
    };
    if (request.parentDetails.motherName) { parentProfile.motherName = request.parentDetails.motherName }
    if (request.parentDetails.motherPhone) { parentProfile.motherPhoneNumber = request.parentDetails.motherPhone }

    const parent = new Parent({ schoolId: school._id, userId: parentUser._id, parentProfile, createdBy: loggedInId });
    await parent.save();

    let adminEmail = loggedInUser.email;
    let schoolName = school.schoolName;
    let studentEmail = studentUser.email;
    let parentEmail = parentUser.email;
    let studentName = student.studentProfile.fullname;
    let parentName = parent.parentProfile.fatherName;
    let password = request.parentDetails.fatherPhone;

    await sendEmail(studentEmail, adminEmail, `Account registration - Shikshamitra`, registrationTemplate(studentName, schoolName, studentEmail, password));
    await sendEmail(parentEmail, adminEmail, `Account registration - Shikshamitra`, registrationTemplate(parentName, schoolName, parentEmail, password));

    request.approval = true;
    await request.save();
    res.status(201).json({ message: "Accounts for student and parent created successfully and notified via email." });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message })
  }
};


exports.addStaffMember = async (req, res) => {
  try {
    const { email, password, mobileNumber, name, employeeRole, department, salary } = req.body;
    if (!email || !password || !mobileNumber || !department || !name || !employeeRole || !salary) {
      return res.status(400).json({ message: "Provide all the details to add staff member." })
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
    if (!school) { return res.status(404).json({ message: 'Admin is not associated with any school.' }); };
    let schoolName = school.schoolName;

    let hpass = bcrypt.hashSync(password, 10);

    const user = new User({ email, password: hpass, mobileNumber, role: 'teacher', employeeType: 'groupD', createdBy: loggedInId });
    await user.save();
    const staff = new SchoolStaff({ schoolId: school._id, userId: user._id, name, employeeRole, department, salary });
    await staff.save();

    await sendEmail(email, loggedInUser.email, `Account registration - Shikshamitra`, registrationTemplate(name, schoolName, email, password));

    res.status(201).json({ message: `New staff member added to school successfully.` })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getStaffMembers = async (req, res) => {
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

    const staff = await SchoolStaff.find({ schoolId: school._id }).populate({ path: 'userId', select: 'email mobileNumber isActive' }).sort({ createdAt: -1 })
    if (!staff.length) {
      return res.status(404).json({ message: "No staff members found in this school." })
    }

    let totalEmployeesSalary = 0;
    for (let employee of staff) {
      totalEmployeesSalary += employee.salary
    }

    res.status(200).json({ message: `Staff details of school:`, totalEmployeesSalary, staff })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.editStaffMember = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Provide the staff member id to edit." })
    }
    const { email, mobileNumber, isActive, name, employeeRole, department, salary } = req.body;
    if (!email && !mobileNumber && !isActive && !name && !employeeRole && !department && !salary) {
      return res.status(400).json({ message: "Please provide atlease one new data to edit staff member details." })
    }

    const school = await School.findOne({ userId: loggedInId });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    };

    const employee = await SchoolStaff.findOne({ schoolId: school._id, _id: id }).populate('userId');
    if (!employee) {
      return res.status(404).json({ message: "No staff member found with the id in this school." })
    }

    if (email) { employee.userId.email = email }
    if (mobileNumber) { employee.userId.role = mobileNumber }
    if (isActive) { employee.userId.isActive = isActive }
    if (name) { employee.name = name }
    if (employeeRole) { employee.employeeRole = employeeRole }
    if (department) { employee.department = department }
    if (salary) { employee.salary = salary }

    await employee.userId.save();
    await employee.save();

    res.status(200).json({ message: `Employee data updated successfully.`, employee })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.assignTaskToStaff = async (req, res) => {
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

    const { name, employeeRole, startDate, dueDate, title, description } = req.body;
    if (!name || !employeeRole || !startDate || !dueDate || !title || !description) {
      return res.status(400).json({ message: "Provide all the details to add task for staff member." })
    }

    const staffMember = await SchoolStaff.findOne({ schoolId: school._id, name, employeeRole }).populate('userId', 'mobileNumber');
    if (!staffMember) { return res.status(404).json({ message: "No staff member found with the details in this school." }) }

    const task = new SchoolStaffTasks({ schoolId: school._id, staffId: staffMember._id, startDate, dueDate, title, description });
    await task.save();

    res.status(201).json({ message: `Task successfully assigned to staff member.`, task })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getAssignedTasks = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    let tasks, totalTasks, completedTasks, pendingTasks, dateOfJoining, role;

    if (loggedInUser.role == 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) { return res.status(404).json({ message: 'Admin is not associated with any school.' }); };

      completedTasks = await SchoolStaffTasks.find({ schoolId: school._id, status:'completed' }).populate({ path: 'staffId', select: 'userId name employeeRole', populate: ({ path: 'userId', select: 'mobileNumber' }) }).sort({ startDate: -1 });
      pendingTasks = await SchoolStaffTasks.find({ schoolId: school._id, status:'pending' }).populate({ path: 'staffId', select: 'userId name employeeRole', populate: ({ path: 'userId', select: 'mobileNumber' }) }).sort({ startDate: 1 });

    }
    else if (loggedInUser.role == 'teacher' && loggedInUser.employeeType == 'groupD') {
      const staff = await SchoolStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id." }) }
      if (!staff.schoolId) { return res.status(404).json({ message: "You are not associated with any school." }) }

      dateOfJoining = new Date(staff.createdAt).toISOString().split('T')[0];;
      role = staff.employeeRole;

      tasks = await SchoolStaffTasks.find({ schoolId: staff.schoolId, staffId: staff._id }).sort({ startDate: 1 });

      if (tasks) {
        totalTasks = tasks.length;
        completedTasks = await SchoolStaffTasks.countDocuments({ schoolId: staff.schoolId, staffId: staff._id, status: 'completed' });
        pendingTasks = await SchoolStaffTasks.countDocuments({ schoolId: staff.schoolId, staffId: staff._id, status: 'pending' });
      }
    }
    else { return res.status(403).json({ message: "Only logged-in admin and staff members have access." }) }

    if (!tasks || !tasks.length) { return res.status(404).json({ message: "No tasks found." }) }

    res.status(200).json({ message: `Tasks data fetched successfully.`, totalTasks, completedTasks, pendingTasks, dateOfJoining, role, tasks })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
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
      return res.status(403).json({
        message: 'Access denied, only admin have access.'
      })
    };

    const { className, subject, description } = req.body;
    if (!className || !subject || !description) { return res.status(400).json({ message: "Please provide class, subject, description to upload syllabus." }) }

    let subjectIs = subject.toLowerCase();

    const school = await School.findOne({ userId: loggedInId });
    if (!school) { return res.status(404).json({ message: "You are not associated with any school." }) }

    let uploadedPhotoUrl = '';
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    }

    let existingSyllabus = await Syllabus.findOne({ schoolId: school._id, class: className, subject: subjectIs });

    if (existingSyllabus) {
      if (existingSyllabus.syllabus) {
        await deleteImage(existingSyllabus.syllabus);
        existingSyllabus.syllabus = uploadedPhotoUrl;
      }
      existingSyllabus.class = className;
      existingSyllabus.subject = subjectIs;
      existingSyllabus.description = description;

      await existingSyllabus.save();

      return res.status(200).json({ message: 'Syllabus updated successfully.', existingSyllabus });
    }
    else {
      const newSyllabus = new Syllabus({ schoolId: school._id, class: className, subject: subjectIs, description, syllabus: uploadedPhotoUrl, });
      await newSyllabus.save();

      return res.status(201).json({ message: 'Syllabus created successfully.', newSyllabus, });
    }
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message, });
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
      schoolId = teacher.schoolId;
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId })
      if (!student.schoolId) { return res.status(404).json({ message: "Student is not associated with any school." }) }
      schoolId = student.schoolId;
    }
    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId })
      if (!parent.schoolId) { return res.status(404).json({ message: "Parent is not associated with any school." }) }
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
    const { bookName, author, subject, noOfBooks, edition, price, pages } = req.body;
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

    const newBook = new Books({ schoolId, bookName, author, subject, noOfBooks, availableBooks: noOfBooks, edition, price, pages, photo: uploadedPhotoUrl });
    await newBook.save();

    res.status(201).json({ message: "Book created successfully.", newBook, });
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
      if (!employee.schoolId) { return res.status(404).json({ message: "Employee is not associated with any school." }) }
      schoolId = employee.schoolId;
    }
    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId });
      if (!student) { return res.status(404).json({ message: 'No student found with the loggedin id.' }) }
      if (!student.schoolId) { return res.status(404).json({ message: "Student is not associated with any school." }) }
      schoolId = student.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const books = await Books.find({ schoolId }).sort({ createdAt: -1 });
    if (!books.length) {
      return res.status(404).json({ message: 'No books found.' })
    };

    res.status(200).json({ message: "Books data fetched successfully.", books, });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};


exports.editBook = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized.' }) };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) { return res.status(403).json({ message: "Access denied, only loggedin admin or employee can access." }) };

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) { return res.status(404).json({ message: 'No school is associated with the logged-in admin.' }) };
      schoolId = school._id;
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {
      const employee = await Teacher.findOne({ userId: loggedInId });
      if (!employee) { return res.status(404).json({ message: 'No employee found with the logged-in id.' }) };
      if (!employee.schoolId) { return res.status(404).json({ message: "Employee is not associated with any school." }) }
      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Please select the book to edit.' })
    };

    const newData = req.body;
    if (!newData.bookName && !newData.author && !newData.subject && !newData.noOfBooks && !newData.availableBooks && !newData.edition && !newData.price && !newData.pages && !req.file) {
      return res.status(400).json({ message: "Please provide new data to update book." })
    }
    const book = await Books.findOne({ _id: id, schoolId });
    if (!book) { return res.status(404).json({ message: 'No book found with the id.' }) };

    if (req.file) {
      try {
        if (book.photo) {
          await deleteImage(book.photo);
        }
        const [photoUrl] = await uploadImage(req.file);
        book.photo = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload book photo.', error: error.message });
      }
    }
    const fieldsToUpdate = ['bookName', 'author', 'subject', 'noOfBooks', 'availableBooks', 'edition', 'price', 'pages'];
    fieldsToUpdate.forEach(field => {
      if (newData[field] !== undefined) {
        book[field] = newData[field];
      }
    });
    await book.save();
    res.status(200).json({ message: "Book data updated successfully.", book });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;;
    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
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
      if (!employee.schoolId) { return res.status(404).json({ message: "Employee is not associated with any school." }) }
      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const book = await Books.findOne({ _id: bookId, schoolId: schoolId });
    if (!book) { return res.status(404).json({ message: 'No book found with the id.' }) };

    if (book.availableBooks != book.noOfBooks) { return res.status(409).json({ message: "Books can't be deleted as some of them were borrowed." }) }

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
      if (!employee.schoolId) { return res.status(404).json({ message: "Employee is not associated with any school." }) }
      schoolId = employee.schoolId;
    }
    else {
      return res.status(404).json({ message: 'You are not allowed to perform this action.' })
    };

    const library = await BookRequests.find({ schoolId }).populate('book', 'bookName noOfBooks availableBooks')
      .populate({ path: 'requestedBy', select: 'studentProfile.fullname studentProfile.class studentProfile.section studentProfile.registrationNumber userId', populate: { path: 'userId', select: 'email' } })
      .sort({ createdAt: -1 });
    const studentIds = library?.map(req => req.requestedBy?._id).filter(Boolean);

    const parents = await Parent.find({ 'parentProfile.parentOf': { $in: studentIds } }).populate('userId')
      .select('parentProfile.fatherPhoneNumber parentProfile.motherPhoneNumber parentProfile.parentOf');

    const parentMap = {};
    parents.forEach(parent => {
      parent.parentProfile.parentOf.forEach(studentId => {
        parentMap[studentId.toString()] = {
          parentEmail: parent.userId.email,
          fatherPhoneNumber: parent.parentProfile.fatherPhoneNumber,
          motherPhoneNumber: parent.parentProfile.motherPhoneNumber
        };
      });
    });
    const bookRequestsWithParents = library?.map(req => {
      const studentId = req.requestedBy?._id?.toString();
      const parentInfo = parentMap[studentId] || {};
      return {
        ...req.toObject(),
        parentInfo
      };
    });

    const associatedSchool = await School.findById(schoolId);
    if (!associatedSchool) { return res.status(404).json({ message: "Logged-in user is not associated with any school." }) }

    let libraryFineAmount = associatedSchool.libraryFineAmount || '-';

    res.status(200).json({ libraryFineAmount, bookRequestsWithParents, });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message, });
  }
};


exports.editLibraryFineAmount = async (req, res) => {
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
      const school = await School.findOne({ userId: loggedInId })
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

    const associatedSchool = await School.findById(schoolId);
    if (!associatedSchool) { return res.status(404).json({ message: "Logged-in user is not associated with any school." }) }

    const { fineAmount } = req.body;
    if (!fineAmount) { return res.status(400).json({ message: "Please specify the fineAmount per day." }) }

    associatedSchool.libraryFineAmount = fineAmount;
    await associatedSchool.save();
    res.status(200).json({ message: `The library fine amount is set to ₹${fineAmount}/- per day.` });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message, });
  }
};

exports.issueAndReturnBook = async (req, res) => {
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
    if (!status) { return res.status(400).json({ message: "Please provide status to update book request." }) }

    let schoolId, fineAmount;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId })
      if (!school) { return res.status(404).json({ message: "No school is associated with the logged-in admin." }) }
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(403).json({ message: "Only logged-in admins and librarians have access to issue book." }) }

    const bookRequest = await BookRequests.findOne({ _id: requestId, schoolId }).populate('book');
    if (!bookRequest) {
      return res.status(404).json({ message: 'No book request found.' })
    };

    if (status == 'accepted' || status == 'rejected' || status == 'requested') {
      bookRequest.status = status
      await bookRequest.save()
      return res.status(200).json({ message: "Response updated successfully.", bookRequest })
    }

    const book = await Books.findOne({ _id: bookRequest.book._id, schoolId });

    if (status == 'returned') {
      if (book.noOfBooks == book.availableBooks) {
        return res.status(404).json({ message: 'Book is not issued to any student.' })
      };
      bookRequest.returnedOn = new Date().toISOString().split('T')[0];
      if (bookRequest.returnedOn > bookRequest.dueOn) {
        let associatedSchool = await School.findById(schoolId);
        const dueDate = bookRequest.dueOn;
        const returnedDate = bookRequest.returnedOn;
        const diffTime = returnedDate - dueDate;
        const delayDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = associatedSchool.libraryFineAmount * delayDays;

        if (fineAmount) {
          bookRequest.fine = fineAmount;
          bookRequest.resolved = false;
          const student = await Student.findById(bookRequest.requestedBy);
          student.studentProfile.additionalFees += fineAmount
          await student.save()
        } else {
          return res.status(400).json({ message: "'Fine' amount is required for late returns." });
        }
      }
      bookRequest.status = status
      bookRequest.save();

      book.availableBooks += 1;
      book.save();
      return res.status(200).json({ message: `Book returned successfully, Fine Amount = ${fineAmount || 0}.`, bookRequest });
    }

    if (status == 'issued') {
      if (!dueOn) {
        return res.status(400).json({ message: "Please provide due date to issue book." })
      }
      if (book.availableBooks <= 0) {
        return res.status(400).json({ message: 'No books are available to issue.' });
      }
    }
    book.availableBooks -= 1;
    await book.save();

    bookRequest.status = status;
    bookRequest.borrowedOn = new Date();
    bookRequest.dueOn = new Date(dueOn).toISOString().split('T')[0];
    await bookRequest.save();

    res.status(200).json({ message: 'Book issued to the student successfully.', bookRequest });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message, });
  }
};

exports.resolveBookRequest = async (req, res) => {
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

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId })
      if (!school) { return res.status(404).json({ message: "No school is associated with the logged-in admin." }) }
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'librarian') {
      const teacher = await Teacher.findOne({ userId: loggedInId });
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher found with the logged-in id.' })
      };
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId
    }
    else { return res.status(403).json({ message: "Only logged-in admins and librarians have access to issue book." }) }

    const bookRequest = await BookRequests.findOne({ _id: requestId, schoolId });
    if (!bookRequest) { return res.status(404).json({ message: 'No book request found with the id.' }) };

    bookRequest.resolved = true;
    await bookRequest.save();
    res.status(200).json({ message: 'Book request resolved successfully.', bookRequest });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message, });
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

      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
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
        return res.status(404).json({ message: "Parent is not associated with any school." })
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
    if (!date || !title || !description || !displayTo) {
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

      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
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
      if (!school) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }

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
      if (!school) { return res.status(404).json({ message: "Student is not associated with any school." }) }
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
      if (!parent.schoolId) { return res.status(404).json({ message: "Parent is not associated with any school." }) }

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
      if (!school) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
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
      if (!school) { return res.status(404).json({ message: "Student is not associated with any school." }) }
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
      if (!parent.schoolId) { return res.status(404).json({ message: "Parent is not associated with any school." }) }

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
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId;
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
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId;
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
    if (!expense) { return res.status(404).json({ message: "No expense found with the id" }) }

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
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
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


exports.getExpenseRequest = async (req, res) => {
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
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId;
    }
    else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

    const teacherRequests = await RequestExpense.find({ schoolId }).sort({ createdAt: -1 })
    if (!teacherRequests.length) { return res.status(200).json({ message: "No requests yet." }) }

    res.status(200).json({ teacherRequests })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.updateExpenseRequest = async (req, res) => {
  try {
    const { amount, status, remark } = req.body;
    const { requestId } = req.params;
    if (!requestId || !status) { return res.status(400).json({ message: "Please provide request id and new status to update." }) }

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
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId;
    }
    else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

    const teacherRequest = await RequestExpense.findOne({ schoolId, _id: requestId })
    if (!teacherRequest) { return res.status(404).json({ message: "No request found with the id." }) }

    if (status === 'pending') {
      teacherRequest.status = status;
      teacherRequest.amount = 0
      await teacherRequest.save()
    }
    if (status === 'failed') {
      if (!remark) {
        return res.status(404).json({ message: "Please provide remark to set the status as failed." })
      }
      teacherRequest.status = status;
      teacherRequest.amount = 0
      teacherRequest.remark = remark;
      await teacherRequest.save()
    }
    if (status === 'success') {
      if (!amount) {
        return res.status(400).json({ message: "Please specify amount to update." })
      }
      teacherRequest.amount = amount;
      teacherRequest.status = status;
      await teacherRequest.save();
    }

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
      if (!teacher.schoolId || !teacher.schoolId._id) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
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

    const fees1 = await ParentExpenses.find({ schoolId, 'paymentDetails.status': 'success', purpose: 'Fees' });
    const fees2 = await SchoolIncome.find({ schoolId, purpose: 'Fees' });
    const fees = fees1.concat(fees2)
    for (let fee of fees) {
      const feeDate = fee.data ? new Date(fee.date) : new Date(fee.createdAt);
      if (isNaN(feeDate)) continue;
      const monthName = months[feeDate.getMonth()];
      const year = feeDate.getFullYear();
      const monthYear = `${monthName} ${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalAdmissionFees: 0, totalTransportationFees: 0, otherIncome: 0, totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
      }
      monthlyData[monthYear].totalFees += fee.amount;
    }

    const admissions = await ApplyOnline.find({ 'studentDetails.schoolName': schoolName, 'paymentDetails.status': 'success' });
    for (let admission of admissions) {
      const admissionDate = new Date(admission.createdAt);
      if (isNaN(admissionDate)) continue;
      const monthName = months[admissionDate.getMonth()];
      const year = admissionDate.getFullYear();
      const monthYear = `${monthName} ${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalAdmissionFees: 0, totalTransportationFees: 0, otherIncome: 0, totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
      }
      monthlyData[monthYear].totalAdmissionFees += Number(admission.studentDetails.admissionFees);
    }

    // const transportations1 = await ParentExpenses.find({ schoolId, 'paymentDetails.status': 'success', purpose: 'Transportation' });
    // const transportations2 = await SchoolIncome.find({ schoolId, purpose: 'Transportation' });
    // const transportations = transportations1.concat(transportations2)
    // for (let transportation of transportations) {
    //   const transportationDate = transportation.date ? new Date(transportation.date) : new Date(transportation.createdAt);
    //   if (isNaN(transportationDate)) continue;
    //   const monthName = months[transportationDate.getMonth()];
    //   const year = transportationDate.getFullYear();
    //   const monthYear = `${monthName} ${year}`;
    //   if (!monthlyData[monthYear]) {
    //     monthlyData[monthYear] = { totalFees: 0, totalAdmissionFees: 0, totalTransportationFees: 0, otherIncome: 0, totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
    //   }
    //   monthlyData[monthYear].totalTransportationFees += transportation.amount;
    // }

    const otherIncomes1 = await ParentExpenses.find({ schoolId, 'paymentDetails.status': 'success', purpose: 'Other' });
    const otherIncomes2 = await SchoolIncome.find({ schoolId, purpose: 'Other' });
    const otherIncomes = otherIncomes1.concat(otherIncomes2);
    for (let otherIncome of otherIncomes) {
      const otherIncomeDate = otherIncome.date ? new Date(otherIncome.date) : new Date(otherIncome.createdAt);
      if (isNaN(otherIncomeDate)) continue;
      const monthName = months[otherIncomeDate.getMonth()];
      const year = otherIncomeDate.getFullYear();
      const monthYear = `${monthName} ${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalAdmissionFees: 0, totalTransportationFees: 0, otherIncome: 0, totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
      }
      monthlyData[monthYear].otherIncome += otherIncome.amount;
    }

    const expenses = await SchoolExpenses.find({ schoolId });
    for (let expense of expenses) {
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate)) continue;
      const monthName = months[expenseDate.getMonth()];
      const year = expenseDate.getFullYear();
      const monthYear = `${monthName} ${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalFees: 0, totalAdmissionFees: 0, totalTransportationFees: 0, otherIncome: 0, totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
      }
      monthlyData[monthYear].totalExpenses += expense.amount;
    }
    //teacher/class item request
    for (let monthYear in monthlyData) {
      const data = monthlyData[monthYear];
      data.totalIncome = data.totalFees + data.totalAdmissionFees + data.totalTransportationFees + data.otherIncome;
      data.totalRevenue = data.totalIncome - data.totalExpenses;
    }

    const result = Object.keys(monthlyData).map(key => ({
      monthYear: key,
      totalFeesCollected: monthlyData[key].totalFees,
      totalAdmissionFees: monthlyData[key].totalAdmissionFees,
      // totalTransportationFees: monthlyData[key].totalTransportationFees,
      otherIncome: monthlyData[key].otherIncome,
      totalIncome: monthlyData[key].totalIncome,
      totalExpenses: monthlyData[key].totalExpenses,
      totalRevenue: monthlyData[key].totalRevenue,
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
      if (!teacher.schoolId || !teacher.schoolId._id) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId._id;
      schoolName = teacher.schoolId.schoolName;
    }
    else { return res.status(404).json({ message: "Only admin and accountants have access." }) }

    const income = await ParentExpenses.find({ schoolId, 'paymentDetails.status': 'success' }).populate('studentId', 'studentProfile.fullname studentProfile.registrationNumber').sort({ createdAt: -1 }).lean();
    const admissions = await ApplyOnline.find({ 'studentDetails.schoolName': schoolName, 'paymentDetails.status': 'success' }).select('studentDetails paymentDetails createdAt updatedAt').sort({ createdAt: -1 }).lean();
    const otherIncome = await SchoolIncome.find({ schoolId }).sort({ date: -1 }).lean();
    const expenses = await SchoolExpenses.find({ schoolId }).sort({ date: -1 }).lean();
    //teacher/class item request
    const formattedIncome = formatTimeToIST(income);
    const formattedAdmissions = formatTimeToIST(admissions);
    const formattedOtherIncome = formatTimeToIST(otherIncome);
    const formattedExpenses = formatTimeToIST(expenses);

    res.status(200).json({ income: formattedIncome, admissions: formattedAdmissions, otherIncome: formattedOtherIncome, expenses: formattedExpenses })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.addSchoolIncome = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized' }); };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users' have access." })
    }
    let schoolId;

    if (loggedInUser.role == 'admin') {
      const school = await School.findOne({ userId: loggedInUser._id });
      if (!school) { return res.status(404).json({ message: 'The admin is not associated with any school.' }) }
      schoolId = school._id
    }
    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInUser._id });
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }
      if (!teacher.schoolId) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId
    }
    else {
      return res.status(403).json({ message: "Only admins and accountants can access." })
    }

    const { amount, date, purpose, reason, source, fullname, organization, transactionId, registrationNumber, className, section } = req.body;
    if (!amount || !date || !purpose || !source || !fullname) { return res.status(400).json({ message: "Please provide all the details to add income." }) }

    if (purpose === 'Other') {
      if (!reason) { return res.status(400).json({ message: "Please provide the reason to add income." }) }
    }

    let studentId, paidBy, pendingAmount;

    if (source === 'student') {
      if (!registrationNumber || !className) { return res.status(400).json({ message: "Please provide student registration number and class." }) }
      const student = await Student.findOne({ schoolId, 'studentProfile.registrationNumber': registrationNumber });
      if (!student) { return res.status(404).json({ message: "No student found with the registration number in this school." }) }
      if (!student.schoolId) { return res.status(404).json({ message: "Student is not associated with any school." }) }
      studentId = student._id

      const parent = await Parent.findOne({ schoolId, userId: student.studentProfile.childOf });
      paidBy = parent._id;


      if (purpose === 'Fees') {
        const existingIncome = await SchoolIncome.findOne({ studentId, class: className, purpose: 'Fees' }).sort({ date: -1 });
        const parentExpense = await ParentExpenses.findOne({ studentId: student._id, class: className, 'paymentDetails.status': 'success', purpose: 'Fees' }).sort({ createdAt: -1 });

        let fee1 = existingIncome ? existingIncome.pendingAmount : 0
        let fee2 = parentExpense ? parentExpense.pendingAmount : 0

        let pending;
        if (fee1 !== 0 && fee2 !== 0) {
          pending = fee1 > fee2 ? fee2 : fee1;
        } else if (fee1 !== 0) {
          pending = fee1;
        } else if (fee2 !== 0) {
          pending = fee2;
        } else {
          pending = Number(student.studentProfile.fees) + student.studentProfile.additionalFees;
        }
        pendingAmount = pending - amount
      }
    }

    if (source === 'other') {
      if (!organization) { return res.status(400).json({ message: "Please provide the organization name." }) }
    }

    const income = new SchoolIncome({ schoolId, amount, date, purpose, pendingAmount, reason, source, fullname, organization, transactionId, registrationNumber, class: className, section, studentId, paidBy })
    await income.save();

    res.status(201).json({ message: "Income added successfully.", income })
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message })
  }
};

exports.editSchoolIncome = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized' }); };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users' have access." })
    }

    let schoolId, schoolName;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInUser._id });
      if (!school) { return res.status(404).json({ message: 'Admin is not associated with any school.' }) };
      schoolId = school._id;
      schoolName = school.schoolName;
    } else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInUser._id }).populate('schoolId');
      if (!teacher || !teacher.schoolId || !teacher.schoolId._id) return res.status(404).json({ message: "Accountant is not associated with any school." });
      schoolId = teacher.schoolId._id;
      schoolName = teacher.schoolId.schoolName
    } else {
      return res.status(403).json({ message: "Access Denied. Only admins and accountants can access." });
    }

    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID." });
    }

    const { reasonForEdit, ...newData } = req.body;
    if (!reasonForEdit) { return res.status(400).json({ message: 'Please specify the reason to update income history.' }); }

    let income, previousData;

    income = await SchoolIncome.findOne({ _id: id, schoolId });
    if (income) {
      previousData = JSON.parse(JSON.stringify(income.toObject()));

      Object.keys(newData).forEach(key => {
        if (income[key] !== undefined) {
          income[key] = newData[key];
        }
      });
      await income.save();
    }
    else {
      income = await ParentExpenses.findOne({ _id: id, schoolId }).populate('studentId').select('-studentId.studentProfile.previousEducation');
      if (income) {
        previousData = JSON.parse(JSON.stringify(income.toObject()));

        if (newData.fullname && income.studentId?.studentProfile) {
          income.studentId.studentProfile.fullname = newData.fullname;
          await income.studentId.save();
        }

        ['amount', 'pendingAmount', 'purpose', 'class', 'section'].forEach(field => {
          if (newData[field] !== undefined) income[field] = newData[field];
        });

        if (newData['paymentDetails.razorpayPaymentId']) {
          income.paymentDetails.razorpayPaymentId = newData['paymentDetails.razorpayPaymentId'];
        }
        await income.save();
      }
      else {
        income = await ApplyOnline.findOne({ _id: id, 'studentDetails.schoolName': schoolName }).select('-parentDetails -educationDetails');
        if (!income) {
          return res.status(404).json({ message: "No income data found with the given id." });
        }

        previousData = JSON.parse(JSON.stringify(income.toObject()));

        if (income.studentDetails) {
          ['firstName', 'lastName', 'classToJoin', 'admissionFees'].forEach(field => {
            if (newData[field]) {
              income.studentDetails[field] = newData[field]
            };
          });
        }

        if (newData['paymentDetails.razorpayPaymentId']) {
          income.paymentDetails.razorpayPaymentId = newData['paymentDetails.razorpayPaymentId'];
        }
        await income.save();
      }
    }

    const newHistoryEntry = {
      previousData,
      reasonForEdit,
      updatedBy: loggedInId,
      updatedAt: Date.now()
    };

    let incomeUpdate = await SchoolIncomeUpdates.findOne({ schoolId, incomeId: id });

    if (incomeUpdate) {
      incomeUpdate.incomeHistory.push(newHistoryEntry);
      await incomeUpdate.save();
    } else {
      incomeUpdate = new SchoolIncomeUpdates({
        schoolId,
        incomeId: id,
        incomeHistory: [newHistoryEntry]
      });
      await incomeUpdate.save();
    }
    res.status(200).json({ message: `Income data updated successfully.`, income });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.getUpdatedSchoolIncomeHistory = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized' }); };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(404).json({ message: "Access denied, only logged-in users' have access." })
    }

    const { id } = req.params;
    if (!id) { return res.status({ message: "Please provide a valid id to get updated income history." }) }

    let schoolId;

    if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInUser._id });
      if (!school) return res.status(404).json({ message: 'Admin is not associated with any school.' });
      schoolId = school._id;
    } else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'accountant') {
      const teacher = await Teacher.findOne({ userId: loggedInUser._id }).populate('schoolId');
      if (!teacher) return res.status(404).json({ message: "No teacher found." });
      if (!teacher.schoolId || !teacher.schoolId._id) { return res.status(404).json({ message: "Teacher is not associated with any school." }) }
      schoolId = teacher.schoolId._id;
    } else {
      return res.status(403).json({ message: "Only admins and accountants can access." });
    }

    const updatedData = await SchoolIncomeUpdates.findOne({ schoolId, incomeId: id });
    if (updatedData) {
      updatedData.incomeHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.status(200).json({
        message: 'Data history retrieved successfully.',
        incomeHistory: updatedData.incomeHistory,
      });
    } else {
      return res.status(404).json({ message: 'No updated history found for this income.' });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.getEntranceExamApplications = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized' }); };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(404).json({ message: "Access denied, only logged-in admins' have access." })
    }

    const school = await School.findOne({ userId: loggedInUser._id });
    if (!school) return res.status(404).json({ message: 'Admin is not associated with any school.' });

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const oldApplications = await ApplyForEntranceExam.find({ schoolId: school._id, createdAt: { $lte: oneYearAgo } });

    const photoUrls = oldApplications.map(app => app.studentDetails.photo);

    if (photoUrls.length > 0) {
      try {
        await deleteImage(photoUrls);
      } catch (err) {
        return res.status(409).json({ message: 'Failed to delete images from Cloudinary:', error: err.message });
      }
    }
    await ApplyForEntranceExam.deleteMany({ schoolId: school._id, createdAt: { $lte: oneYearAgo } });

    const applications = await ApplyForEntranceExam.find({ schoolId: school._id }).sort({ createdAt: -1 });
    if (!applications.length) { return res.status(404).json({ message: 'No applications.' }); }

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.createOrUpdateQuestionPaperForEntranceExam = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, only admins are allowed." });
    }

    const school = await School.findOne({ userId: loggedInUser._id });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    }

    const { className } = req.body;
    let questions = req.body.questions;

    if (typeof questions === 'string') {
      try {
        questions = JSON.parse(questions);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format for questions.' });
      }
    }

    if (!className || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Class and questions are required to create question paper.' });
    }

    const uploadedFiles = req.files || [];
    const questionList = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      const options = [q.option1, q.option2, q.option3, q.option4];
      const correctCount = options.filter(opt => opt.isAnswer).length;

      if (correctCount !== 1) {
        return res.status(400).json({
          message: `Each question must have exactly one correct answer. Error in question number ${q.questionNumber}`
        });
      }

      let photoUrl;
      const imageFieldName = `question${i + 1}`;
      const matchingFile = uploadedFiles.find(file => file.fieldname === imageFieldName);

      if (matchingFile) {
        try {
          const [uploadedUrl] = await uploadImage(matchingFile);
          photoUrl = uploadedUrl;
        } catch (error) {
          return res.status(500).json({
            message: `Failed to upload photo for question ${q.questionNumber}`,
            error: error.message
          });
        }
      }

      questionList.push({
        questionNumber: q.questionNumber,
        question: q.question,
        photo: photoUrl,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4
      });
    }

    const existingPaper = await EntranceExamQuestionPaper.findOne({ schoolId: school._id, class: className });
    if (existingPaper) {
      existingPaper.questions = questionList;
      await existingPaper.save();
      return res.status(200).json({ message: 'Question paper updated successfully.', questionPaper: existingPaper });
    }

    const questionPaper = new EntranceExamQuestionPaper({ schoolId: school._id, class: className, questions: questionList });

    await questionPaper.save();
    res.status(201).json({ message: 'Question paper created successfully.', questionPaper });

  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.getEntranceExamQuestionPapers = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, only admins are allowed." });
    }

    const { className } = req.params;
    if (!className) { return res.status(400).json({ message: "Please provide class number to get entrance exam question paper." }) }

    const school = await School.findOne({ userId: loggedInUser._id });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    }

    const questionPaper = await EntranceExamQuestionPaper.findOne({ schoolId: school._id, class: className });
    if (!questionPaper) { return res.status(404).json({ message: `No question paper for the class - ${className}` }) }

    res.status(200).json(questionPaper);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

function generateExamId(classApplying) {
  const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
  return `${randomNumber}${classApplying}`;
}

exports.sendEntranceExamDetailsToApplicants = async (req, res) => {
  try {
    const loggedInId = req.user?.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, only admins are allowed." });
    }

    const adminEmail = loggedInUser.email;
    const { examMode, examDate, startTime, endTime, applicationIds } = req.body; // send times in hh:mm format
    if (!examMode || !examDate || !startTime || !endTime || !applicationIds || !Array.isArray(applicationIds)) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    if (examMode !== 'Online' && examMode !== 'Offline') {
      return res.status(400).json({ message: "Invalid exam mode. Use 'Online' or 'Offline'." })
    }
    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Exam requires startTime and endTime." });
    }
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: "Start time and end time must be in HH:mm 24-hour format." });
    }

    const school = await School.findOne({ userId: loggedInUser._id });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    }
    const schoolName = school.schoolName;
    const address = school.address;

    const applicants = await ApplyForEntranceExam.find({ _id: { $in: applicationIds }, schoolId: school._id });
    if (!applicants.length) {
      return res.status(404).json({ message: 'No applicants found for the provided IDs.' });
    }

    const uniqueClasses = [...new Set(applicants.map(app => app.classApplying))];

    const missingClasses = [];

    for (const classNumber of uniqueClasses) {
      const paper = await EntranceExamQuestionPaper.findOne({ schoolId: school._id, class: classNumber });
      if (!paper) {
        missingClasses.push(classNumber);
      }
    }

    if (missingClasses.length > 0) {
      return res.status(400).json({
        message: `Question papers missing for the following classes: ${missingClasses.join(', ')}`
      });
    }

    const updatePromises = applicants.map(async (applicant) => {
      if (applicant.status === 'pending') {

        let studentEmails = applicant.studentDetails.email;
        let studentName = `${applicant.studentDetails.firstName} ${applicant.studentDetails.lastName}`;
        let studentClass = applicant.classApplying;
        const examTime = `${startTime}hrs To ${endTime}hrs`;
        const examId = generateExamId(applicant.classApplying);
        const examLink = 'https://yourapp.com/exam';
        applicant.examId = examId;
        applicant.examDate = examDate;
        applicant.status = 'sent';
        applicant.startTime = startTime;
        applicant.endTime = endTime;
        if (examMode === 'Online') {
          applicant.examLink = examLink;
        }
        await applicant.save();

        await sendEmail(studentEmails, adminEmail, `Entrance Examination Details - ${schoolName}`, EntranceExamDetailsTemplate(studentName, studentClass, examMode, examDate, examTime, examId, examMode === 'Online' ? examLink : null, schoolName, examMode === 'Offline' ? address : null));
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Exam details sent to applicants successfully.' });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.getEntranceExamResults = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized' }); };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(404).json({ message: "Access denied, only logged-in admins' have access." })
    }

    const school = await School.findOne({ userId: loggedInUser._id });
    if (!school) {
      return res.status(404).json({ message: 'Admin is not associated with any school.' });
    }

    const results = await EntranceExamResults.find({ schoolId: school._id }).populate({ path: 'applicantId', select: 'studentDetails academicYear classApplying' });
    if (!results) { return res.status(404).json({ message: "No resutls found." }) }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.sendEntranceExamResultToApplicants = async (req, res) => {
  try {
    const loggedInId = req.user?.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, only logged-in admins have access." });
    }

    const { resultIds } = req.body;
    if (!resultIds || !Array.isArray(resultIds)) { return res.status(400).json({ message: "Please provide applicants result Ids' to send the results." }) }

    const school = await School.findOne({ userId: loggedInUser._id });
    if (!school) { return res.status(404).json({ message: 'Admin is not associated with any school.' }); }

    const adminEmail = loggedInUser.email;
    const schoolName = school.schoolName;

    const results = await EntranceExamResults.find({ _id: { $in: resultIds }, schoolId: school._id, status: 'pending' }).populate({ path: 'applicantId', select: 'studentDetails academicYear classApplying' });
    if (!results.length) { return res.status(404).json({ message: 'No results found for the provided IDs.' }); }

    const updatePromises = results.map(async (result) => {
      if (result.status === 'pending') {
        let studentEmails = result.applicantId.studentDetails.email;
        let studentName = `${result.applicantId.studentDetails.firstName} ${result.applicantId.studentDetails.lastName}`;
        let studentClass = result.applicantId.classApplying;
        let examId = result.examId;
        let percentage = result.resultPercentage;

        result.status = 'sent';
        await result.save();

        await sendEmail(studentEmails, adminEmail, `Entrance Examination Result - ${schoolName}`, EntranceExamResultsTemplate(studentName, studentClass, examId, percentage, schoolName));
      }
    });
    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Exam results sent to applicants successfully.' });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};