const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { editTeacherProfile, getStudentsOfTeacher, assignmentForStudents, markAndUpdateAttendance, viewAttendance, createOrUpdateTimetable, getTimetable, getSyllabus, uploadStudyMaterial, getStudyMaterial, deleteStudyMaterial, createExams, getExams, createResults, getResults, issueBook, setBookAvailabilityTrue, getAssignment, createOrUpdateSyllabus, deleteEducation, createOrUpdateClassPlan, getClassPlan, getTeacherDashboard, getSubmittedAssignments, getStudentsAndExams, getResultById } = require('../controllers/teacher.controller');
const { createStudentAndParent, getProfile, createBook, deleteBook, getAllStudentsOfSchool, getBooks, getStudentById, createNotice, getNotice, deleteNotice, addStudentToExistingParent, createDynamicCalendar, getDynamicCalendar, getDynamicCalendarByDate, getLibraryData, getAimObjective } = require('../controllers/admin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.get('/getProfile', protect, authorize('teacher'), getProfile);
router.put('/editProfile', protect, authorize('teacher'), upload.single('photo'), editTeacherProfile);
router.delete('/deleteEducation/:educationId', protect, authorize('teacher'), deleteEducation);
router.post('/registersp', protect, authorize('teacher'), upload.single('photo'), createStudentAndParent);
router.post('/addStudent', protect, authorize('teacher'),upload.single('photo'), addStudentToExistingParent);
router.post('/notice', protect,authorize('teacher'),createNotice);
router.get('/notice', protect, authorize('teacher'),getNotice);
router.delete('/notice/:noticeId',protect, authorize('teacher'), deleteNotice);
router.post('/calendar', protect, authorize('teacher'), createDynamicCalendar);
router.get('/calendar', protect, authorize('teacher'), getDynamicCalendar);
router.get('/calendar/:calendarDate', protect, authorize('teacher'), getDynamicCalendarByDate);
router.get('/getStudents', protect, authorize('teacher'), getStudentsOfTeacher);
router.get('/student/:studentId',protect, authorize('teacher'), getStudentById);
router.post('/assignment', protect,authorize('teacher'), upload.single('photo'), assignmentForStudents);
router.get('/assignment', protect, authorize('teacher'), getAssignment);
router.get('/submittedAssignments/:id', protect, authorize('teacher'), getSubmittedAssignments);
router.post('/attendance', protect, authorize('teacher'), markAndUpdateAttendance);
router.get('/attendance', protect, authorize('teacher'), viewAttendance);
router.post('/timetable',protect, authorize('teacher'), createOrUpdateTimetable);
router.get('/timetable', protect, authorize('teacher'), getTimetable);
router.post('/syllabus', protect, authorize('teacher'), upload.single('photo'), createOrUpdateSyllabus);
router.get('/syllabus', protect, authorize('teacher'), getSyllabus);
router.post('/studyMaterial', upload.array('files'), protect, authorize('teacher'), uploadStudyMaterial);
router.get('/studyMaterial', protect, authorize('teacher'), getStudyMaterial);
router.delete('/studyMaterial/:materialId', protect, authorize('teacher'), deleteStudyMaterial);
router.post('/exams',protect, authorize('teacher'), createExams);
router.get('/exams', protect, authorize('teacher'), getExams);
router.post('/classPlan', protect, authorize('teacher'), createOrUpdateClassPlan);
router.get('/classPlan', protect, authorize('teacher'), getClassPlan);
router.get('/getSandE',protect, authorize('teacher'), getStudentsAndExams);
router.post('/results',protect, authorize('teacher'),createResults);
router.get('/results',protect, authorize('teacher'), getResults);
router.get('/result/:resultId', protect, authorize('teacher'), getResultById);
router.post('/createBook', protect, authorize('teacher'), createBook);
router.get('/students', protect, authorize('teacher'), getAllStudentsOfSchool);
router.get('/books', protect, authorize('teacher'), getBooks);
router.post('/issueBook', protect, authorize('teacher'), issueBook);
router.get('/library', protect, authorize('teacher'), getLibraryData);
router.put('/bookAvailability/:bookId', protect, authorize('teacher'), setBookAvailabilityTrue);
router.delete('/book/:bookId', protect, authorize('teacher'), deleteBook);
router.get('/aimobjective', protect, authorize('teacher'), getAimObjective);
router.get('/dashboard', protect, authorize('teacher'), getTeacherDashboard);




module.exports = router;
