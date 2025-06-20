const School = require('../models/School');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Blogs = require('../models/Blogs');
const { uploadImage, deleteImage } = require('../utils/multer');
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/sendEmail');
const registrationTemplate = require('../utils/registrationTemplate');
const SuperAdminStaff = require('../models/SuperAdminStaff');
const SuperAdminStaffTasks = require('../models/SuperAdminStaffTasks');
const Notifications = require('../models/Notifications');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const SuperAdminIncome = require('../models/SuperAdminIncome');
const SuperAdminIncomeUpdateHistory = require('../models/SuperAdminIncomeUpdateHistory');
const SuperAdminExpenses = require('../models/SuperAdminExpenses');
const Query = require('../models/Query');
const SchoolStaff = require('../models/SchoolStaff');
const ClassTimetable = require('../models/Timetable');
const { io } = require('../utils/socket');
const Connect = require('../models/Connect');


//create account for admin/school
exports.registerSchool = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || (loggedInUser.employeeType && loggedInUser.employeeType == 'groupD')) {
      return res.status(403).json({ message: 'Access denied. Only superadmin can register school.' });
    };
    if (loggedInUser.employeeType == 'groupD') {
      return res.status
    }

    const { email, password, schoolCode, schoolName, contact, address, principalName, details } = req.body;
    if (!email || !password || !schoolCode || !schoolName || !contact || !address || !principalName || !details) {
      return res.status(400).json({ message: "Please enter all the details to register." })
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    hpass = bcrypt.hashSync(password, 10);

    const admin = new User({ email, password: hpass, role: 'admin', createdBy: loggedInId });
    await admin.save();

    const school = new School({ userId: admin._id, schoolCode, schoolName, contact, address, principalName, details, createdBy: loggedInId, });
    await school.save()

    await sendEmail(email, loggedInUser.email, `Account registration - Shikshamitra`, registrationTemplate(principalName, schoolName, email, password));

    res.status(201).json({
      message: 'School registered successfully',
      user: { id: admin._id, email: admin.email, role: admin.role, },
      school
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err });
  }
};


exports.getAllSchools = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || (loggedInUser.employeeType && loggedInUser.employeeType == 'groupD')) {
      return res.status(403).json({ message: 'Access denied. Only superadmin can get all schools data.' });
    };

    const schools = await School.find().select('-paymentDetails').populate('userId', 'email isActive').sort({ createdAt: -1 });
    if (!schools.length) {
      return res.status(200).json({ message: 'No schools registered yet.' })
    };
    res.status(200).json({ message: 'Schools data:', schools })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.changeSchoolStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Only 'active', 'inactive' or 'suspended' are allowed."
      });
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || (loggedInUser.employeeType && loggedInUser.employeeType == 'groupD')) {
      return res.status(403).json({ message: 'Access denied. Only superadmin can change the school status.' });
    };

    const school = await School.findOneAndUpdate(id);
    if (!school) {
      return res.status(404).json({ message: "School doesn't exist" })
    };
    school.status = status;
    await school.save();

    res.status(200).json({
      message: `School status successfully updated to '${status}'.`,
      school: {
        id: school._id,
        schoolName: school.schoolName,
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating school status.',
      error: error.message
    });
  }
};


exports.postBlog = async (req, res) => {
  try {
    const { title, blog } = req.body;

    if (!title || !blog || !Array.isArray(blog) || !blog.length) {
      return res.status(400).json({ message: 'Provide all details to post blog.' });
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can post blog.' });
    }

    if ((loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) || (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD')) {
      let uploadedBlog = [];

      if (req.files && req.files.length === blog.length) {
        for (let i = 0; i < blog.length; i++) {
          const { description } = blog[i];
          const file = req.files[i];

          if (!description || !file) {
            return res.status(400).json({ message: 'Each blog detail must include a description and a photo.' });
          }

          try {
            const [photoUrl] = await uploadImage(file);
            uploadedBlog.push({ description, photo: photoUrl });
          } catch (error) {
            return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
          }
        }
      } else {
        return res.status(400).json({ message: 'Mismatch between blogs and uploaded photos.' });
      }

      const newBlog = new Blogs({ title, blog: uploadedBlog });
      await newBlog.save();

      res.status(201).json({ message: "Blog posted successfully.", newBlog });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


exports.editBlog = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only superadmin or staff members can edit blog.' });
    }

    if ((loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) || (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD')) {

      const { id } = req.params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Please provide a valid blog id to edit.' });
      }

      const existingBlog = await Blogs.findById(id);
      if (!existingBlog) {
        return res.status(404).json({ message: 'No blog found with the provided ID.' });
      }

      const updatedBlogArray = req.body.blog;
      if (!Array.isArray(updatedBlogArray) || !updatedBlogArray.length) {
        return res.status(400).json({ message: "Please provide valid blog data to update." });
      }

      const oldBlogArray = existingBlog.blog;
      let updatedBlog = [];
      let imagesToDelete = [];

      if (req.files && req.files.length === updatedBlogArray.length) {
        for (let i = 0; i < updatedBlogArray.length; i++) {
          const { description } = updatedBlogArray[i];
          const file = req.files[i];

          if (!description || !file) {
            return res.status(400).json({ message: 'Each blog entry must include a description and a photo.' });
          }

          try {
            const [photoUrl] = await uploadImage(file);

            if (oldBlogArray[i] && oldBlogArray[i].photo) {
              imagesToDelete.push(oldBlogArray[i].photo);
            }

            updatedBlog.push({ description, photo: photoUrl });
          } catch (error) {
            return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
          }
        }
      } else if (!req.files || req.files.length === 0) {
        for (let i = 0; i < updatedBlogArray.length; i++) {
          const { description } = updatedBlogArray[i];
          const oldEntry = oldBlogArray[i];

          if (!description || !oldEntry || !oldEntry.photo) {
            return res.status(400).json({ message: 'Each blog entry must include a description and existing photo.' });
          }

          updatedBlog.push({ description, photo: oldEntry.photo });
        }
      } else {
        return res.status(400).json({ message: 'Mismatch between blogs and uploaded photos.' });
      }

      if (oldBlogArray.length > updatedBlog.length) {
        const removedImages = oldBlogArray.slice(updatedBlog.length).map(entry => entry.photo);
        imagesToDelete.push(...removedImages);
      }

      if (imagesToDelete.length > 0) {
        try {
          await deleteImage(imagesToDelete);
        } catch (error) {
          console.warn("Failed to delete one or more old images:", error.message);
        }
      }

      existingBlog.blog = updatedBlog;
      const blog = await existingBlog.save();

      res.status(200).json({ message: "Blog updated successfully.", blog });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin or staff members can delete blog.' });
    };

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Please provide a valid blog id to delete.' })
    }
    const blog = await Blogs.findById(id);
    if (!blog) { return res.status(404).json({ message: "No blog found with the id." }) }

    const imagesToDelete = blog.blog.map(entry => entry.photo);
    try {
      await deleteImage(imagesToDelete);
    } catch (error) {
      res.warn("Some images may not have been deleted:", error.message);
    }
    await Blogs.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully." })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message })
  }
};


exports.addSAStaffMember = async (req, res) => {
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
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || (loggedInUser.employeeType && loggedInUser.employeeType == 'groupD')) {
      return res.status(403).json({ message: 'Access denied. Only logged-in superadmin can access.' });
    };

    let hpass = bcrypt.hashSync(password, 10);

    const user = new User({ email, password: hpass, mobileNumber, role: 'superadmin', employeeType: 'groupD', createdBy: loggedInId });
    await user.save();
    const staff = new SuperAdminStaff({ userId: user._id, name, employeeRole, department, salary });
    await staff.save();

    let schoolName = 'Shikshamitra'
    await sendEmail(email, loggedInUser.email, `Account registration - Shikshamitra`, registrationTemplate(name, schoolName, email, password));

    res.status(201).json({ message: `New staff member added to successfully.` })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getSAStaffMembers = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || (loggedInUser.employeeType && loggedInUser.employeeType == 'groupD')) {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const staff = await SuperAdminStaff.find().populate({ path: 'userId', select: 'email mobileNumber isActive' }).sort({ createdAt: -1 })
    if (!staff.length) {
      return res.status(404).json({ message: "No staff members found." })
    }

    let totalStaffSalary = 0;
    for (let employee of staff) {
      totalStaffSalary += employee.salary
    }

    res.status(200).json({ message: `Staff details:`, totalStaffSalary, staff })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.editSAStaffMember = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || (loggedInUser.employeeType && loggedInUser.employeeType == 'groupD')) {
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

    const employee = await SuperAdminStaff.findById(id).populate('userId');
    if (!employee) {
      return res.status(404).json({ message: "No staff member found with the id." })
    }

    if (email) { employee.userId.email = email }
    if (mobileNumber) { employee.userId.mobileNumber = mobileNumber }
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


exports.assignTaskToSAStaff = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType == 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in admins can access.' });
    };

    const { name, employeeRole, startDate, dueDate, title, description } = req.body;
    if (!name || !employeeRole || !startDate || !dueDate || !title || !description) {
      return res.status(400).json({ message: "Provide all the details to add task for staff member." })
    }

    const staffMember = await SuperAdminStaff.findOne({ name, employeeRole }).populate('userId', 'mobileNumber');
    if (!staffMember) { return res.status(404).json({ message: "No staff member found with the provided details." }) }

    const task = new SuperAdminStaffTasks({ staffId: staffMember._id, startDate, dueDate, title, description, createdBy: loggedInId });
    await task.save();

    let memberIds = [];
    memberIds.push({ memberId: staffMember._id });
    const notification = new Notifications({ section: 'task', memberIds, text: `You have been assigned with a new task - ${title}.` });
    await notification.save()

    res.status(201).json({ message: `Task successfully assigned to staff member.`, task })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getSAAssignedTasks = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    let name, tasks, totalTasks, completedTasks, pendingTasks, dateOfJoining, role;

    if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {

      completedTasks = await SuperAdminStaffTasks.find({ status: 'completed' }).populate({ path: 'staffId', select: 'userId name employeeRole', populate: ({ path: 'userId', select: 'mobileNumber' }) }).sort({ startDate: -1 });
      pendingTasks = await SuperAdminStaffTasks.find({ status: { $ne: 'completed' } }).populate({ path: 'staffId', select: 'userId name employeeRole', populate: ({ path: 'userId', select: 'mobileNumber' }) }).sort({ startDate: 1 });

      if (!pendingTasks.length && !completedTasks.length) { return res.status(404).json({ message: "No tasks found." }) }

    }
    else if (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD') {
      const staff = await SuperAdminStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id." }) }

      name = staff.name;
      dateOfJoining = new Date(staff.createdAt).toISOString().split('T')[0];
      role = staff.employeeRole;

      tasks = await SuperAdminStaffTasks.find({ staffId: staff._id }).sort({ startDate: 1 });

      if (tasks) {
        totalTasks = tasks.length;
        completedTasks = await SuperAdminStaffTasks.countDocuments({ staffId: staff._id, status: 'completed' });
        pendingTasks = await SuperAdminStaffTasks.countDocuments({ staffId: staff._id, status: { $ne: 'completed' } });
      }
      if (!tasks || !tasks.length) { return res.status(404).json({ message: "No tasks found." }) }

    }
    else { return res.status(403).json({ message: "Only logged-in admin and staff members have access." }) }

    res.status(200).json({ message: `Tasks data fetched successfully.`, name, totalTasks, completedTasks, pendingTasks, dateOfJoining, role, tasks })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getDashboard = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    const schools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ status: 'active' })
    const inActiveSchools = await School.countDocuments({ status: 'inactive' })
    const suspendedSchools = await School.countDocuments({ status: 'suspended' })
    const teachers = await Teacher.countDocuments();
    const students = await Student.countDocuments();
    const parents = await Parent.countDocuments();


    res.status(200).json({ schools, activeSchools, inActiveSchools, suspendedSchools, teachers, students, parents })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.addIncome = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    var { schoolCode, schoolName, principalName, totalFees, paidAmount, dueAmount, paymentMethod, transactionId } = req.body;
    if (!schoolCode || !schoolName || !principalName || !totalFees || !paidAmount || !dueAmount || !paymentMethod || (paymentMethod == 'Online' && !transactionId)) {
      return res.status(400).json({ message: "Please provide all the details to add income." })
    }

    if (paymentMethod === 'Cash') { transactionId = '-' }

    const income = new SuperAdminIncome({ schoolCode, schoolName, principalName, totalFees, paidAmount, dueAmount, paymentMethod, transactionId });
    await income.save()

    res.status(201).json({ message: 'Income added successfully.', income })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.addExpense = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    var { name, date, purpose, amount, modeOfPayment, transactionId } = req.body;
    if (!name || !date || !purpose || !amount || !modeOfPayment || (modeOfPayment == 'Online' && !transactionId)) {
      return res.status(400).json({ message: "Please provide all the details to add expense." })
    }

    if (modeOfPayment === 'Cash') { transactionId = '-' }

    const expense = new SuperAdminExpenses({ name, date, purpose, amount, modeOfPayment, transactionId });
    await expense.save()

    res.status(201).json({ message: 'Expense added successfully.', expense })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getAccounts = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let monthlyData = {};

    const incomes = await SuperAdminIncome.find();
    for (let income of incomes) {
      const incomeDate = new Date(income.createdAt);
      if (isNaN(incomeDate)) continue;
      const monthName = months[incomeDate.getMonth()];
      const year = incomeDate.getFullYear();
      const monthYear = `${monthName} ${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
      }
      monthlyData[monthYear].totalIncome += income.paidAmount;
    }

    const expenses = await SuperAdminExpenses.find();
    for (let expense of expenses) {
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate)) continue;
      const monthName = months[expenseDate.getMonth()];
      const year = expenseDate.getFullYear();
      const monthYear = `${monthName} ${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { totalIncome: 0, totalExpenses: 0, totalRevenue: 0 };
      }
      monthlyData[monthYear].totalExpenses += expense.amount;
    }

    for (let monthYear in monthlyData) {
      const data = monthlyData[monthYear];
      data.totalRevenue = data.totalIncome - data.totalExpenses;
    }

    const result = Object.keys(monthlyData).map(key => ({
      monthYear: key,
      totalIncome: monthlyData[key].totalIncome,
      totalExpenses: monthlyData[key].totalExpenses,
      totalRevenue: monthlyData[key].totalRevenue,
    }));

    result.sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

    const income = await SuperAdminIncome.find().sort({ updatedAt: -1 })
    const expense = await SuperAdminExpenses.find().sort({ createdAt: -1 })

    res.status(200).json({ accounts: result, income, expense });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.editIncome = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    const { id } = req.params;
    if (!id) { return res.status(400).json({ message: "Please provide income id to edit." }) }

    const newData = req.body;

    let income, previousData;

    income = await SuperAdminIncome.findOne({ _id: id });
    if (income) {
      previousData = JSON.parse(JSON.stringify(income.toObject()));

      Object.keys(newData).forEach(key => {
        if (income[key] !== undefined) {
          income[key] = newData[key];
        }
      });
      await income.save();

      res.status(200).json({ message: 'Income updated successfully.', income })
    }
    else { return res.status(404).json({ message: "No income found with the id." }) }

    const newHistoryEntry = { previousData, updatedAt: Date.now() };

    let incomeUpdate = await SuperAdminIncomeUpdateHistory.findOne({ incomeId: id });
    if (incomeUpdate) {
      incomeUpdate.incomeHistory.push(newHistoryEntry);
      await incomeUpdate.save();
    } else {
      incomeUpdate = new SuperAdminIncomeUpdateHistory({ incomeId: id, incomeHistory: [newHistoryEntry] });
      await incomeUpdate.save();
    }
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getUpdatedIncomeHistory = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    const { id } = req.params;
    if (!id) { return res.status({ message: "Please provide a valid id to get updated income history." }) }

    const updatedData = await SuperAdminIncomeUpdateHistory.findOne({ incomeId: id });
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


exports.editExpense = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType || loggedInUser.employeeType === 'groupD') {
      return res.status(403).json({ message: 'Access denied. Only logged-in super admin can access.' });
    };

    const { id } = req.params;
    if (!id) { return res.status(400).json({ message: "Please provide expense id to edit." }) }

    const newData = req.body;

    const expense = await SuperAdminExpenses.findOne({ _id: id });
    if (expense) {
      Object.keys(newData).forEach(key => {
        if (expense[key] !== undefined) {
          expense[key] = newData[key];
        }
      });
      await expense.save();

      return res.status(200).json({ message: 'Expense data updated successfully.', expense })
    }
    else { return res.status(404).json({ message: "No expense data found with the id." }) }
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.sendQuery = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    const { name, contact, email, message, sendTo } = req.body;
    if (!name || !contact || !email || !message || !sendTo || !sendTo.length) {
      return res.status(400).json({ message: 'Please provide all the details to create query' })
    }

    let superAdmin = null, queriesToInsert = [], admin = null;
    if (sendTo.includes('Super Admin')) {
      superAdmin = await User.findOne({ role: 'superadmin', employeeType: { $exists: false } });
    }


    if (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD') {
      const staff = await SuperAdminStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id" }) }

      const schools = await School.find({ schoolName: { $in: sendTo } }).populate('userId');
      if (!schools.length) {
        return res.status(404).json({ message: 'No school is selected to send query.' });
      }

      queriesToInsert = schools.map((school) => {
        return new Query({
          name, contact, email, sendTo: school.userId._id, schoolId: school._id, schoolName: school.schoolName, createdByRole: staff.employeeRole, createdBy: staff._id,
          query: [{ message, createdBy: staff._id, sentAt: new Date() }]
        });
      });
    }

    else if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {

      const schools = await School.find({ schoolName: { $in: sendTo } }).populate('userId');
      if (!schools.length) {
        return res.status(404).json({ message: 'No school is selected to send query.' });
      }

      queriesToInsert = schools.map((school) => {
        return new Query({
          name, contact, email, sendTo: school.userId._id, schoolId: school._id, schoolName: school.schoolName, createdByRole: 'Super Admin', createdBy: loggedInId,
          query: [{ message, createdBy: loggedInId, sentAt: new Date() }]
        });
      });
    }

    else if (loggedInUser.role === 'admin') {

      const school = await School.findOne({ userId: loggedInId });
      if (!school) { return res.status(404).json({ message: "You are not associated with any school." }) }

      const schoolStaffs = await SchoolStaff.find({ schoolId: school._id, name: { $in: sendTo } });
      const teachers = await Teacher.find({ schoolId: school._id, 'profile.fullname': { $in: sendTo } }).populate('userId');
      const students = await Student.find({ schoolId: school._id, 'studentProfile.fullname': { $in: sendTo } }).populate('userId');
      const parents = await Parent.find({ schoolId: school._id, $or: [{ 'parentProfile.fatherName': { $in: sendTo } }, { 'parentProfile.motherName': { $in: sendTo } }] }).populate('userId');

      if (!superAdmin && !schoolStaffs.length && !teachers.length && !students.length && !parents.length) {
        return res.status(404).json({ message: 'No name is selected to send query.' });
      }

      const createQueryPayload = (recipientId) => ({
        name, contact, email, sendTo: recipientId, schoolId: school._id, schoolName: school.schoolName, createdByRole: loggedInUser.role, createdBy: loggedInId,
        query: [{ message, createdBy: loggedInId, sentAt: new Date() }]
      });

      if (superAdmin) {
        queriesToInsert.push(new Query(createQueryPayload(superAdmin._id)));
      }
      schoolStaffs.forEach(s => queriesToInsert.push(new Query(createQueryPayload(s._id))));
      teachers.forEach(t => queriesToInsert.push(new Query(createQueryPayload(t._id))));
      students.forEach(s => queriesToInsert.push(new Query(createQueryPayload(s._id))));
      parents.forEach(p => queriesToInsert.push(new Query(createQueryPayload(p._id))));
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'groupD') {
      const staff = await SchoolStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff found with the logged-in id." }) }

      const school = await School.findById(staff.schoolId);

      if (sendTo.includes('Admin')) {
        admin = await User.findById(school.userId)
      }
      const teachers = await Teacher.find({ schoolId: school._id, 'profile.fullname': { $in: sendTo } }).populate('userId');

      if (!admin && !teachers.length) {
        return res.status(404).json({ message: 'No name is selected to send query.' });
      }

      const createQueryPayload = (recipientId) => ({
        name, contact, email, sendTo: recipientId, schoolId: school._id, schoolName: school.schoolName, createdByRole: staff.employeeRole, createdBy: staff._id,
        query: [{ message, createdBy: staff._id, sentAt: new Date() }]
      });

      if (admin) {
        queriesToInsert.push(new Query(createQueryPayload(admin._id)));
      }
      teachers.forEach(t => queriesToInsert.push(new Query(createQueryPayload(t._id))));
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType !== 'groupD') {

      const teacher = await Teacher.findOne({ userId: loggedInId }).populate('schoolId');
      if (!teacher) { return res.status(404).json({ message: "No teacher found with the logged-in id." }) }

      if (sendTo.includes('Admin')) {
        admin = await User.findById(teacher.schoolId.userId)
      }
      const studentsIs = await Student.find({ schoolId: teacher.schoolId._id, 'studentProfile.class': teacher.profile.class, 'studentProfile.section': teacher.profile.section });
      const students = await Student.find({ schoolId: teacher.schoolId._id, 'studentProfile.fullname': { $in: sendTo }, 'studentProfile.class': teacher.profile.class, 'studentProfile.section': teacher.profile.section }).populate('userId');
      const studentIds = studentsIs.map(student => student._id);
      const parents = await Parent.find({ schoolId: teacher.schoolId._id, 'parentProfile.parentOf': { $in: studentIds }, $or: [{ 'parentProfile.fatherName': { $in: sendTo } }, { 'parentProfile.motherName': { $in: sendTo } }] }).populate('userId');


      if (!admin && !students.length && !parents.length) {
        return res.status(404).json({ message: 'No name is selected to send query.' });
      }

      const createQueryPayload = (recipientId) => ({
        name, contact, email, sendTo: recipientId, schoolId: teacher.schoolId._id, schoolName: teacher.schoolId.schoolName, createdByRole: loggedInUser.role, createdBy: teacher._id,
        query: [{ message, createdBy: teacher._id, sentAt: new Date() }]
      });

      if (admin) {
        queriesToInsert.push(new Query(createQueryPayload(admin._id)));
      }
      students.forEach(s => queriesToInsert.push(new Query(createQueryPayload(s._id))));
      parents.forEach(p => queriesToInsert.push(new Query(createQueryPayload(p._id))));
    }

    else if (loggedInUser.role === 'student') {

      const student = await Student.findOne({ userId: loggedInId }).populate('schoolId');
      if (!student) { return res.status(404).json({ message: "No student found with the logged-in id." }) }

      const timetable = await ClassTimetable.findOne({
        class: student.studentProfile.class,
        section: student.studentProfile.section,
        schoolId: student.schoolId._id
      }).populate('timetable.monday.teacher', 'profile.fullname')
        .populate('timetable.tuesday.teacher', 'profile.fullname')
        .populate('timetable.wednesday.teacher', 'profile.fullname')
        .populate('timetable.thursday.teacher', 'profile.fullname')
        .populate('timetable.friday.teacher', 'profile.fullname')
        .populate('timetable.saturday.teacher', 'profile.fullname');

      if (!timetable) {
        return res.status(404).json({ message: 'Timetable not found for this student.' });
      }

      const teacherNameSet = new Set();
      for (const day of Object.keys(timetable.timetable)) {
        timetable.timetable[day].forEach(slot => {
          if (slot.teacher?.profile?.fullname) {
            teacherNameSet.add(slot.teacher.profile.fullname);
          }
        });
      }

      const validSendToNames = sendTo.filter(name => teacherNameSet.has(name));

      if (sendTo.includes('Admin')) {
        admin = await User.findById(student.schoolId.userId)
      }
      const teachers = await Teacher.find({ schoolId: student.schoolId._id, 'profile.fullname': { $in: validSendToNames } }).populate('userId');

      if (!admin && !teachers.length) {
        return res.status(404).json({ message: 'No name is selected to send query.' });
      }

      const createQueryPayload = (recipientId) => ({
        name, contact, email, sendTo: recipientId, schoolId: student.schoolId._id, schoolName: student.schoolId.schoolName, createdByRole: loggedInUser.role, createdBy: student._id,
        query: [{ message, createdBy: student._id, sentAt: new Date() }]
      });

      if (admin) {
        queriesToInsert.push(new Query(createQueryPayload(admin._id)));
      }
      teachers.forEach(t => queriesToInsert.push(new Query(createQueryPayload(t._id))));
    }

    else if (loggedInUser.role === 'parent') {

      const parent = await Parent.findOne({ userId: loggedInId }).populate('schoolId');
      if (!parent) { return res.status(404).json({ message: "No parent found with the logged-in id." }) }

      if (sendTo.includes('Admin')) {
        admin = await User.findById(parent.schoolId.userId)
      }
      const teacherNameSet = new Set();

      const timetables = await Promise.all(
        parent.parentProfile.parentOf.map(async (sid) => {
          const student = await Student.findById(sid);

          const timetable = await ClassTimetable.findOne({
            class: student.studentProfile.class,
            section: student.studentProfile.section,
            schoolId: student.schoolId
          })
            .populate('timetable.monday.teacher', 'profile.fullname')
            .populate('timetable.tuesday.teacher', 'profile.fullname')
            .populate('timetable.wednesday.teacher', 'profile.fullname')
            .populate('timetable.thursday.teacher', 'profile.fullname')
            .populate('timetable.friday.teacher', 'profile.fullname')
            .populate('timetable.saturday.teacher', 'profile.fullname');

          return timetable
        })
      )


      for (const timetable of timetables) {
        if (!timetable) continue;

        for (const day of Object.keys(timetable.timetable)) {
          for (const slot of timetable.timetable[day]) {
            const teacherName = slot.teacher?.profile?.fullname;
            if (teacherName) {
              teacherNameSet.add(teacherName);
            }
          }
        }
      }

      const validSendToNames = sendTo.filter(name => teacherNameSet.has(name));

      const teachers = await Teacher.find({
        schoolId: parent.schoolId._id,
        'profile.fullname': { $in: validSendToNames }
      }).populate('userId');

      if (!admin && !teachers.length) {
        return res.status(404).json({ message: 'No name is selected to send query.' });
      }

      const createQueryPayload = (recipientId) => ({
        name, contact, email, sendTo: recipientId, schoolId: parent.schoolId._id, schoolName: parent.schoolId.schoolName, createdByRole: loggedInUser.role, createdBy: parent._id,
        query: [{ message, createdBy: parent._id, sentAt: new Date() }]
      });

      if (admin) {
        queriesToInsert.push(new Query(createQueryPayload(admin._id)));
      }
      teachers.forEach(t => queriesToInsert.push(new Query(createQueryPayload(t._id))));
    }
    else { return res.status(403).json({ message: "Invalid role type." }) }

    if (queriesToInsert.length) {
      await Query.insertMany(queriesToInsert);
    }
    else { return res.status(400).json({ message: "No valid recipients found to send the query." }) }

    res.status(201).json({ message: `Query sent successfully.` })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getQueries = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    let queriesSent, queriesReceived, queries;

    if (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD') {

      const staff = await SuperAdminStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id" }) }

      const staffs = await SuperAdminStaff.find();
      const staffIds = staffs.map(staff => staff._id)

      const creatorIds = [staff.createdBy, ...staffIds];

      queriesSent = await Query.find({ createdBy: { $in: creatorIds } }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: staff.createdBy }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {

      const staffs = await SuperAdminStaff.find();
      const staffIds = staffs.map(staff => staff._id)

      const creatorIds = [loggedInId, ...staffIds];

      queriesSent = await Query.find({ createdBy: { $in: creatorIds } }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: loggedInId }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else if (loggedInUser.role === 'admin') {

      queriesSent = await Query.find({ createdBy: loggedInId }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: loggedInId }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'groupD') {

      const staff = await SchoolStaff.findOne({ userId: loggedInId });

      queriesSent = await Query.find({ createdBy: staff._id }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: staff._id }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType !== 'groupD') {

      const teacher = await Teacher.findOne({ userId: loggedInId });

      queriesSent = await Query.find({ createdBy: teacher._id }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: teacher._id }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else if (loggedInUser.role === 'student') {

      const student = await Student.findOne({ userId: loggedInId });

      queriesSent = await Query.find({ createdBy: student._id }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: student._id }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else if (loggedInUser.role === 'parent') {

      const parent = await Parent.findOne({ userId: loggedInId });

      queriesSent = await Query.find({ createdBy: parent._id }).sort({ updatedAt: -1 });

      queries = await Query.find({ sendTo: parent._id }).sort({ updatedAt: -1 });
      queriesReceived = queries.filter(q => q.query.length % 2 !== 0);
    }

    else { return res.status(403).json({ message: "Invalid role type." }) }

    res.status(200).json({ queriesReceived, queriesSent })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.getQueryById = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    const { id } = req.params;
    if (!id) { return res.status(400).json({ message: "Please provide the query id to view/reply." }) }

    let query;

    if (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD') {

      const staff = await SuperAdminStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id" }) }

      const staffs = await SuperAdminStaff.find();
      const staffIds = staffs.map(staff => staff._id)

      const creatorIds = [staff.createdBy, ...staffIds];

      query = await Query.findOne({ _id: id, createdBy: { $in: creatorIds } }) || await Query.findOne({ _id: id, sendTo: staff.createdBy });
    }

    else if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {

      const staffs = await SuperAdminStaff.find();
      const staffIds = staffs.map(staff => staff._id)

      const creatorIds = [loggedInId, ...staffIds];

      query = await Query.findOne({ _id: id, createdBy: { $in: creatorIds } }) || await Query.findOne({ _id: id, sendTo: loggedInId });
    }

    else if (loggedInUser.role === 'admin') {
      query = await Query.findOne({ _id: id, createdBy: loggedInId }) || await Query.findOne({ _id: id, sendTo: loggedInId });
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'groupD') {
      const staff = await SchoolStaff.findOne({ userId: loggedInId })
      query = await Query.findOne({ _id: id, createdBy: staff._id }) || await Query.findOne({ _id: id, sendTo: staff._id });
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType !== 'groupD') {
      const teacher = await Teacher.findOne({ userId: loggedInId })
      query = await Query.findOne({ _id: id, createdBy: teacher._id }) || await Query.findOne({ _id: id, sendTo: teacher._id });
    }

    else if (loggedInUser.role === 'student') {
      const student = await Student.findOne({ userId: loggedInId })
      query = await Query.findOne({ _id: id, createdBy: student._id }) || await Query.findOne({ _id: id, sendTo: student._id });
    }

    else if (loggedInUser.role === 'parent') {
      const parent = await Parent.findOne({ userId: loggedInId })
      query = await Query.findOne({ _id: id, createdBy: parent._id }) || await Query.findOne({ _id: id, sendTo: parent._id });
    }
    else { return res.status(403).json({ message: "Invalid role type." }) }

    if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

    res.status(200).json({ query })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.replyToQuery = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: 'Access denied. Only logged-in users can access.' });
    };

    const { id } = req.params;
    if (!id) { return res.status(400).json({ message: "Please provide query id to reply." }) }

    const { message } = req.body;
    if (!message) { return res.status(400).json({ message: "Please type a message to send." }) }

    let query;

    if (loggedInUser.role === 'superadmin' && loggedInUser.employeeType === 'groupD') {

      const staff = await SuperAdminStaff.findOne({ userId: loggedInId });
      if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id" }) }

      const staffs = await SuperAdminStaff.find();
      const staffIds = staffs.map(staff => staff._id)

      const creatorIds = [staff.createdBy, ...staffIds];

      query = await Query.findOne({ _id: id, createdBy: { $in: creatorIds } }) || await Query.findOne({ _id: id, sendTo: staff.createdBy });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {

      const staffs = await SuperAdminStaff.find();
      const staffIds = staffs.map(staff => staff._id)

      const creatorIds = [loggedInId, ...staffIds];

      query = await Query.findOne({ _id: id, createdBy: { $in: creatorIds } }) || await Query.findOne({ _id: id, sendTo: loggedInId });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else if (loggedInUser.role === 'admin') {

      query = await Query.findOne({ _id: id, createdBy: loggedInId }) || await Query.findOne({ _id: id, sendTo: loggedInId });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType === 'groupD') {

      const staff = await SchoolStaff.findOne({ userId: loggedInId })

      query = await Query.findOne({ _id: id, createdBy: staff._id }) || await Query.findOne({ _id: id, sendTo: staff._id });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else if (loggedInUser.role === 'teacher' && loggedInUser.employeeType !== 'groupD') {

      const teacher = await Teacher.findOne({ userId: loggedInId })

      query = await Query.findOne({ _id: id, createdBy: teacher._id }) || await Query.findOne({ _id: id, sendTo: teacher._id });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else if (loggedInUser.role === 'student') {

      const student = await Student.findOne({ userId: loggedInId })

      query = await Query.findOne({ _id: id, createdBy: student._id }) || await Query.findOne({ _id: id, sendTo: student._id });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else if (loggedInUser.role === 'parent') {

      const parent = await Parent.findOne({ userId: loggedInId })

      query = await Query.findOne({ _id: id, createdBy: parent._id }) || await Query.findOne({ _id: id, sendTo: parent._id });
      if (!query) { return res.status(404).json({ message: "No query found with the id." }) }

      const queryMessage = { message: message, createdBy: loggedInId }
      query.query.push(queryMessage)
      await query.save();
    }

    else { return res.status(403).json({ message: "Invalid role type." }) }

    res.status(200).json({ message: 'Replied successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
};


exports.createConnect = async (req, res) => {
  try {
    const loggedInId = req.user?.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access Denied. Only logged-in users can access." })
    }

    const { title, startDate, startTime, endDate, endTime, attendants } = req.body;
    if (!Array.isArray(attendants)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    let superAdmin = null, admin = null, connectArray = [], connectDoc, meetingLink = Math.random().toString(36).slice(2, 11);

    if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {
      const schools = await School.find({ schoolName: { $in: attendants } });
      if (!schools.length) {
        return res.status(404).json({ message: 'No school is selected to send query.' });
      }
      connectArray = schools.map(school => ({ attendant: school.userId }));
      if (!connectArray.length) {
        return res.status(400).json({ message: 'No valid attendants found for the meeting.' });
      }
      connectDoc = await Connect.create({ title, startDate, startTime, endDate, endTime, connect: connectArray, meetingLink, hostedByName: 'Super Admin', hostedByRole: loggedInUser.role, createdBy: loggedInId, });
    }

    else if (loggedInUser.role === 'admin') {
      const school = await School.findOne({ userId: loggedInId });
      if (!school) {
        return res.status(404).json({ message: 'You are not associated with any school.' });
      }

      if (attendants.includes('Super Admin')) {
        superAdmin = await User.findOne({ role: 'superadmin', employeeType: { $exists: false } });
        if (superAdmin) { connectArray.push({ attendant: superAdmin._id }) }
      }
      const teachers = await Teacher.find({ schoolId: school._id, 'profile.fullname': { $in: attendants } });
      const students = await Student.find({ schoolId: school._id, 'studentProfile.fullname': { $in: attendants } });
      const parents = await Parent.find({ schoolId: school._id, $or: [{ 'parentProfile.fatherName': { $in: attendants } }, { 'parentProfile.motherName': { $in: attendants } }] });

      connectArray = [
        ...connectArray,
        ...teachers.map(t => ({ attendant: t._id })),
        ...students.map(s => ({ attendant: s._id })),
        ...parents.map(p => ({ attendant: p._id }))
      ];
      if (!connectArray.length) {
        return res.status(400).json({ message: 'No valid attendants found for the meeting.' });
      }
      connectDoc = await Connect.create({ title, startDate, startTime, endDate, endTime, connect: connectArray, meetingLink, hostedByName: school.principalName || 'Admin', hostedByRole: loggedInUser.role, createdBy: loggedInId, });
    }

    connectArray.forEach(att => {
      io.to(`user_${att.attendant}`).emit('meeting:invite', {
        meetingId: connectDoc._id, title, meetingLink,
      });
    });

    res.status(201).json({ message: "Meeting scheduled successfully.", connectDoc });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message })
  }
};


exports.getConnects = async (req, res) => {
  try {
    const loggedInId = req.user?.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser) {
      return res.status(403).json({ message: "Access Denied. Only logged-in users can access." })
    }

    let sent, received;

    if (loggedInUser.role === 'superadmin' && !loggedInUser.employeeType) {
      sent = await Connect.find({ createdBy: loggedInId }).select('-connect');
      received = await Connect.find({ "connect.attendant": loggedInId }).select('-connect');
    }
    else if (loggedInUser.role === 'admin') {
      sent = await Connect.find({ createdBy: loggedInId }).select('-connect');
      received = await Connect.find({ "connect.attendant": loggedInId }).select('-connect');
    }

    await Connect.deleteMany({ endDate: { $lt: new Date() } });

    const connects = [...sent, ...received].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    res.status(200).json({ connects });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message })
  }
};