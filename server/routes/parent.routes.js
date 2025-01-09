const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getSyllabus, getExams, getResults } = require('../controllers/teacher.controller');
const { getProfile, getNotice } = require('../controllers/admin.controller');
const { editParentProfile } = require('../controllers/parent.controller');
const { getAdmitCard } = require('../controllers/student.controller');
const router = express.Router();

router.get('/getProfile', protect, authorize('parent'), getProfile);
router.put('/editProfile', protect, authorize('parent'), editParentProfile);
router.get('/syllabus', protect, authorize('parent'), getSyllabus);
router.get('/exams', protect, authorize('parent'), getExams);
router.get('/results',protect, authorize('parent'), getResults);
router.get('/admitCard',protect, authorize('parent'), getAdmitCard);
router.get('/notice', protect, authorize('parent'),getNotice);



module.exports = router;