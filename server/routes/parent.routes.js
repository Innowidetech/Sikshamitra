const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getSyllabus, getExams, getResults } = require('../controllers/teacher.controller');
const { editParentProfile,parentDashboard, getResultDetails } = require('../controllers/parent.controller');
const { getAdmitCard } = require('../controllers/student.controller');
const { getNotice } = require('../controllers/admin.controller');
const router = express.Router();

router.get('/dashboard', protect, authorize('parent'), parentDashboard)
router.put('/editProfile', protect, authorize('parent'), editParentProfile);
router.get('/syllabus', protect, authorize('parent'), getSyllabus);
router.get('/exams', protect, authorize('parent'), getExams);
router.get('/result', protect, authorize('parent'), getResultDetails)
router.get('/results/:classParam/:section/:examType/:studentName',protect, authorize('parent'), getResults);
router.get('/admitCard',protect, authorize('parent'), getAdmitCard);
router.get('/notice', protect, authorize('parent'),getNotice);


module.exports = router;