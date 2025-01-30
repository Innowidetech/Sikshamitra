const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { editTeacherProfile, getStudentsOfTeacher, assignmentForStudents, markAndUpdateAttendance, viewMonthlyAttendance, createOrUpdateTimetable, getTimetable, getSyllabus, uploadStudyMaterial, getStudyMaterial, deleteStudyMaterial, createExams, getExams, createResults, getResults, issueBook, setBookAvailabilityTrue, getAssignment } = require('../controllers/teacher.controller');
const { createStudentAndParent, getProfile, createBook, deleteBook, getAllStudentsOfSchool, getBooks, getStudentById, createNotice, getNotice, deleteNotice, addStudentToExistingParent, createDynamicCalendar } = require('../controllers/admin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.get('/getProfile', protect, authorize('teacher'), getProfile);
router.put('/editProfile', protect, authorize('teacher'), upload.single('photo'), editTeacherProfile);
router.post('/registersp', protect, authorize('teacher'), upload.single('photo'), createStudentAndParent);
router.post('/addStudent', protect, authorize('teacher'),upload.single('photo'), addStudentToExistingParent);
router.post('/notice', protect,authorize('teacher'),createNotice);
router.get('/notice', protect, authorize('teacher'),getNotice);
router.delete('/notice/:noticeId',protect, authorize('teacher'), deleteNotice);
router.get('/getStudents', protect, authorize('teacher'), getStudentsOfTeacher);
router.get('/student/:studentId',protect, authorize('teacher'), getStudentById);
router.post('/assignment', protect,authorize('teacher'), upload.single('photo'), assignmentForStudents);
router.get('/assignment', protect, authorize('teacher'), getAssignment);
router.post('/markAttendance', protect, authorize('teacher'), markAndUpdateAttendance);
router.get('/monthlyAttendance', protect, authorize('teacher'), viewMonthlyAttendance);
router.post('/timetable',protect, authorize('teacher'), createOrUpdateTimetable);
router.get('/timetable', protect, authorize('teacher'), getTimetable);
router.get('/syllabus', protect, authorize('teacher'), getSyllabus);
router.post('/studyMaterial', upload.array('files'), protect, authorize('teacher'), uploadStudyMaterial);
router.get('/studyMaterial', protect, authorize('teacher'), getStudyMaterial);
router.delete('/studyMaterial/:materialId', protect, authorize('teacher'), deleteStudyMaterial);
router.post('/exams',protect, authorize('teacher'), createExams);
router.get('/exams', protect, authorize('teacher'), getExams);
router.post('/results/:examId/:studentId',protect, authorize('teacher'),createResults);
router.get('/results',protect, authorize('teacher'), getResults);
router.post('/createBook', protect, authorize('teacher'), createBook);
router.get('/students', protect, authorize('employee'), getAllStudentsOfSchool);
router.get('/books', protect, authorize('teacher'), getBooks);
router.post('/issueBook/:bookId/:studentId', protect, authorize('teacher'), issueBook);
router.put('/bookAvailability/:bookId', protect, authorize('teacher'), setBookAvailabilityTrue);
router.delete('/book/:bookId', protect, authorize('teacher'), deleteBook);
router.post('/calendar', protect, authorize('teacher'), createDynamicCalendar);



module.exports = router;
