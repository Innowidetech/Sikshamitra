const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAllSchools, changeSchoolStatus, postBlog, deleteBlog, getSchoolById, registerSchool, editBlog, addSAStaffMember, getSAStaffMembers, editSAStaffMember, assignTaskToSAStaff, getSAAssignedTasks, getDashboard, addIncome, getUpdatedIncomeHistory, editIncome, addExpense, editExpense, getAccounts, sendQuery, getQueries, replyToQuery } = require('../controllers/superAdmin.controller');
const multer = require('multer');
const { getNotifications, markNotificationAsRead } = require('../controllers/admin.controller');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/register', protect, authorize('superadmin'), registerSchool);
router.get('/schools',protect,authorize('superadmin'),getAllSchools);
router.put('/school/:id/:status', protect,authorize('superadmin'), changeSchoolStatus);
router.get('/dashboard', protect, authorize('superadmin'), getDashboard);
router.post('/income', protect, authorize('superadmin'), addIncome);
router.post('/expense', protect, authorize('superadmin'), addExpense);
router.get('/accounts', protect, authorize('superadmin'), getAccounts);
router.post('/editIncome/:id', protect, authorize('superadmin'), editIncome);
router.get('/incomeHistory/:id', protect, authorize('superadmin'), getUpdatedIncomeHistory);
router.patch('/editExpense/:id', protect, authorize('superadmin'), editExpense);

router.post('/blog', protect, authorize('superadmin'), upload.array('photos'),  postBlog);
router.put('/blog/:id', protect, authorize('superadmin'), upload.array('photos'), editBlog);
router.delete('/blog/:id', protect, authorize('superadmin'), deleteBlog);

router.post('/staff', protect, authorize('superadmin'), addSAStaffMember);
router.get('/staff', protect, authorize('superadmin'), getSAStaffMembers);
router.patch('/staff/:id', protect, authorize('superadmin'), editSAStaffMember);
router.post('/task', protect, authorize('superadmin'), assignTaskToSAStaff);
router.get('/tasks', protect, authorize('superadmin'), getSAAssignedTasks);

router.get('/notifications', protect, authorize('superadmin'), getNotifications);
router.patch('/notification/:id', protect, authorize('superadmin'), markNotificationAsRead);

router.post('/query', protect, authorize('superadmin'), sendQuery);
router.get('/query', protect, authorize('superadmin'), getQueries);
router.post('/query/:id', protect, authorize('superadmin'), replyToQuery);




module.exports = router;