const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { editStudentProfile, attendanceReport, getAdmitCard } = require('../controllers/student.controller');
const { getTimetable, getSyllabus, getStudyMaterial, getExams, getResults, getAssignment } = require('../controllers/teacher.controller');
const { getProfile, getNotice } = require('../controllers/admin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/getProfile', protect, authorize('student'), getProfile);
router.put('/editProfile', protect, authorize('student'), upload.single('photo'), editStudentProfile);
router.get('/timetable',protect,authorize('student'), getTimetable);
router.get('/attendance',protect,authorize('student'), attendanceReport);
router.get('/assignment', protect, authorize('student'), getAssignment);
router.get('/syllabus', protect, authorize('student'), getSyllabus);
router.get('/studyMaterial', protect, authorize('student'), getStudyMaterial);
router.get('/exams', protect, authorize('student'), getExams);
router.get('/results',protect, authorize('student'), getResults);
router.get('/admitCard',protect, authorize('student'), getAdmitCard);
router.get('/notice', protect, authorize('student'),getNotice);


module.exports = router;