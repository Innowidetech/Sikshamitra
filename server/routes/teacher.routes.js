const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { editTeacherProfile, getStudentsOfTeacher, assignmentForStudents, markAndUpdateAttendance, viewAttendance, createOrUpdateTimetable, getTimetable, getSyllabus, uploadStudyMaterial, getStudyMaterial, deleteStudyMaterial, createExams, getExams, createResults, getResults, issueBook, getAssignment, deleteEducation, createOrUpdateClassPlan, getClassPlan, getTeacherDashboard, getSubmittedAssignments, getStudentsAndExams, getResultById, requestExpense, getClassAccounts, deleteTimetablePeriod, returnBook, editStudyMaterial, deleteExam, editExam, getTeacherExpenseRequests } = require('../controllers/teacher.controller');
const { createStudentAndParent, getProfile, createBook, deleteBook, getAllStudentsOfSchool, getBooks, createNotice, getNotice, deleteNotice, addStudentToExistingParent, createDynamicCalendar, getDynamicCalendar, getDynamicCalendarByDate, getLibraryData, getAimObjective, postSchoolExpensesForm, getAccounts, getAccountsData, editSchoolExpense, deleteSchoolExpense, editNotice, editDynamicCalendar, deleteDynamicCalendar, getExpenseRequest, updateExpenseRequest } = require('../controllers/admin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.get('/getProfile', protect, authorize('teacher'), getProfile);
router.put('/editProfile', protect, authorize('teacher'), upload.single('photo'), editTeacherProfile);
router.delete('/deleteEducation/:educationId', protect, authorize('teacher'), deleteEducation);
router.post('/registersp', protect, authorize('teacher'), upload.single('photo'), createStudentAndParent);
router.post('/addStudent', protect, authorize('teacher'), upload.single('photo'), addStudentToExistingParent);
router.post('/notice', protect, authorize('teacher'), createNotice);
router.get('/notice', protect, authorize('teacher'), getNotice);
router.patch('/notice/:noticeId', protect, authorize('teacher'), editNotice);
router.delete('/notice/:noticeId', protect, authorize('teacher'), deleteNotice);
router.post('/calendar', protect, authorize('teacher'), createDynamicCalendar);
router.get('/calendar', protect, authorize('teacher'), getDynamicCalendar);
router.patch('/calendar/:calendarId', protect, authorize('teacher'), editDynamicCalendar);
router.get('/calendar/:calendarDate', protect, authorize('teacher'), getDynamicCalendarByDate);
router.delete('/calendar/:calendarId', protect, authorize('teacher'), deleteDynamicCalendar);
router.get('/getStudents', protect, authorize('teacher'), getStudentsOfTeacher);
// router.get('/student/:studentId', protect, authorize('teacher'), getStudentById);
router.post('/assignment', protect, authorize('teacher'), upload.single('photo'), assignmentForStudents);
router.get('/assignment', protect, authorize('teacher'), getAssignment);
router.get('/submittedAssignments/:id', protect, authorize('teacher'), getSubmittedAssignments);
router.post('/attendance', protect, authorize('teacher'), markAndUpdateAttendance);
router.get('/attendance', protect, authorize('teacher'), viewAttendance);
router.post('/timetable', protect, authorize('teacher'), createOrUpdateTimetable);
router.get('/timetable', protect, authorize('teacher'), getTimetable);
router.delete('/timetable/:periodId', protect, authorize('teacher'), deleteTimetablePeriod);
router.get('/syllabus', protect, authorize('teacher'), getSyllabus);
router.post('/studyMaterial', protect, authorize('teacher'), upload.single('photo'), uploadStudyMaterial);
router.get('/studyMaterial', protect, authorize('teacher'), getStudyMaterial);
router.patch('/studyMaterial/:materialId', protect, authorize('teacher'), upload.single('photo'), editStudyMaterial)
router.delete('/studyMaterial/:materialId', protect, authorize('teacher'), deleteStudyMaterial);
router.post('/exams', protect, authorize('teacher'), createExams);
router.get('/exams', protect, authorize('teacher'), getExams);
router.patch('/exam/:id', protect, authorize('teacher'), editExam);
router.delete('/exam/:id', protect, authorize('teacher'), deleteExam);
router.post('/classPlan', protect, authorize('teacher'), createOrUpdateClassPlan);
router.get('/classPlan/:className?/:section?', protect, authorize('teacher'), getClassPlan);
router.get('/getSandE', protect, authorize('teacher'), getStudentsAndExams);
router.post('/results', protect, authorize('teacher'), createResults);
router.get('/results', protect, authorize('teacher'), getResults);
router.get('/result/:resultId', protect, authorize('teacher'), getResultById);
router.post('/createBook', protect, authorize('teacher'), createBook);// librarian
router.get('/students', protect, authorize('teacher'), getAllStudentsOfSchool);// librarian
router.get('/books', protect, authorize('teacher'), getBooks);// librarian
router.patch('/issueBook/:requestId', protect, authorize('teacher'), issueBook);// librarian
router.get('/library', protect, authorize('teacher'), getLibraryData);// librarian
router.patch('/returnBook/:requestId', protect, authorize('teacher'), returnBook);// librarian
router.delete('/book/:bookId', protect, authorize('teacher'), deleteBook);// librarian
router.get('/aimobjective', protect, authorize('teacher'), getAimObjective);
router.get('/dashboard', protect, authorize('teacher'), getTeacherDashboard);
router.post('/expenses', protect, authorize('teacher'), postSchoolExpensesForm); // accountant
router.patch('/expenses/:expenseId', protect, authorize('teacher'), editSchoolExpense); // accountant
router.delete('/expenses/:expenseId', protect, authorize('teacher'), deleteSchoolExpense); // accountant
router.post('/expenseRequest', protect, authorize('teacher'), requestExpense); //request item for class
router.get('/requests', protect, authorize('teacher'), getTeacherExpenseRequests); // get request data of teacher
router.get('/expenseRequest', protect, authorize('teacher'), getExpenseRequest); // accountant
router.patch('/expenseRequest/:requestId', protect, authorize('teacher'), updateExpenseRequest); // accountant
router.get('/classAccounts', protect, authorize('teacher'), getClassAccounts);
router.get('/accounts',protect, authorize('teacher'), getAccounts); //accountant
router.get('/accountsData',protect, authorize('teacher'), getAccountsData); //accountant

module.exports = router;
