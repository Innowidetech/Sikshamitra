const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { editStudentProfile, attendanceReport, getAdmitCard, submitAssignment, requestBook, getBookRequests } = require('../controllers/student.controller');
const { getTimetable, getSyllabus, getStudyMaterial, getExams, getResults, getAssignment, getClassPlan, getSubmittedAssignments, getResultById } = require('../controllers/teacher.controller');
const { getProfile, getNotice, getDynamicCalendar, getDynamicCalendarByDate, getAimObjective, getBooks } = require('../controllers/admin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/getProfile', protect, authorize('student'), getProfile);
router.get('/notice', protect, authorize('student'), getNotice);
router.get('/calendar', protect, authorize('student'), getDynamicCalendar);
router.get('/calendar/:calendarDate', protect, authorize('student'), getDynamicCalendarByDate);
router.put('/editProfile', protect, authorize('student'), upload.single('photo'), editStudentProfile);
router.get('/timetable', protect, authorize('student'), getTimetable);
router.get('/attendance/:month?/:year?', protect, authorize('student'), attendanceReport);
router.get('/assignment', protect, authorize('student'), getAssignment);
router.post('/assignment/:assignmentId', protect, authorize('student'), upload.single('photo'), submitAssignment)
router.get('/submittedAssignments', protect, authorize('student'), getSubmittedAssignments);
router.get('/syllabus', protect, authorize('student'), getSyllabus);
router.get('/studyMaterial', protect, authorize('student'), getStudyMaterial);
router.get('/exams', protect, authorize('student'), getExams);
router.get('/classPlan', protect, authorize('student'), getClassPlan);
router.get('/results', protect, authorize('student'), getResults);
router.get('/result/:resultId', protect, authorize('student'), getResultById);
router.get('/admitCard', protect, authorize('student'), getAdmitCard);
router.get('/aimobjective', protect, authorize('student'), getAimObjective);
router.get('/books', protect, authorize('student'), getBooks);
router.post('/requestBook/:bookId', protect, authorize('student'), requestBook)
router.get('/bookRequests', protect, authorize('student'), getBookRequests)
module.exports = router;