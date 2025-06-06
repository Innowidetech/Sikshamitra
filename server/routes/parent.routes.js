const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getSyllabus, getExams, getResults, getResultById, getClassPlan } = require('../controllers/teacher.controller');
const { editParentProfile,parentDashboard, getChildrenNames, payFees, verifyFeesPayment, getExpenses, getFeesReceipts, postQuery } = require('../controllers/parent.controller');
const { getAdmitCard } = require('../controllers/student.controller');
const { getNotice, getDynamicCalendar, getDynamicCalendarByDate, getAimObjective } = require('../controllers/admin.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/dashboard', protect, authorize('parent'), parentDashboard)
router.get('/calendar', protect, authorize('parent'), getDynamicCalendar);
router.get('/calendar/:calendarDate', protect, authorize('parent'), getDynamicCalendarByDate);
router.put('/editProfile', protect, authorize('parent'), upload.single('photo'), editParentProfile);
router.get('/syllabus', protect, authorize('parent'), getSyllabus);
router.get('/classPlan', protect, authorize('parent'), getClassPlan);
router.get('/exams', protect, authorize('parent'), getExams);
router.get('/results/:studentName?',protect, authorize('parent'), getResults);
router.get('/result/:studentName?/:resultId', protect, authorize('parent'), getResultById)
router.get('/admitCard',protect, authorize('parent'), getAdmitCard);
router.get('/notice', protect, authorize('parent'),getNotice);
router.get('/aimobjective', protect, authorize('parent'), getAimObjective);
router.get('/children', protect, authorize('parent'), getChildrenNames);
router.post('/payFee', protect, authorize('parent'), payFees);
router.post('/verifyFeePayment', protect, authorize('parent'), verifyFeesPayment);
router.get('/getExpenses', protect, authorize('parent'), getExpenses);
router.get('/getFeesReceipts', protect, authorize('parent'), getFeesReceipts);
router.post('/query', protect, authorize('parent'), postQuery);

module.exports = router;