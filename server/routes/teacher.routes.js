const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { editTeacherProfile, getStudentsOfTeacher, assignmentForStudents, markAndUpdateAttendance, viewAttendance, createOrUpdateTimetable, getOnlineLecturesAndTimetable, getSyllabus, uploadStudyMaterial, getStudyMaterial, deleteStudyMaterial, createExams, getExams, createResults, getResults, getAssignment, deleteEducation, createOrUpdateClassPlan, getClassPlan, getTeacherDashboard, getSubmittedAssignments, getStudentsAndExams, getResultById, requestExpense, getTeacherAccounts, deleteTimetablePeriod, editStudyMaterial, deleteExam, editExam, getTeacherExpenseRequests, editTeacherExpenseRequests, editResult, createOnlineLectures, getClassAndSectionFor } = require('../controllers/teacher.controller');
const { createStudentAndParent, getProfile, createBook, deleteBook, getBooks, createNotice, getNotice, deleteNotice, addStudentToExistingParent, createDynamicCalendar, getDynamicCalendar, getDynamicCalendarByDate, getLibraryData, getAimObjective, postSchoolExpensesForm, getAccounts, getAccountsData, editSchoolExpense, deleteSchoolExpense, editNotice, editDynamicCalendar, deleteDynamicCalendar, getExpenseRequest, updateExpenseRequest, getUpdatedSchoolIncomeHistory, editSchoolIncome, addSchoolIncome, editBook, issueAndReturnBook, editLibraryFineAmount, resolveBookRequest, getNotifications, markNotificationAsRead, getNewAdmissions, getAdmissionRequests, createInstantAccount, getStudentsBasedOnClassAndSection, addStock, getInventory, saleStockTo, getSaleStock } = require('../controllers/admin.controller');
const multer = require('multer');
const { sendQuery, getQueries, replyToQuery } = require('../controllers/superAdmin.controller');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

router.get('/getProfile', protect, authorize('teacher'), getProfile);
router.put('/editProfile', protect, authorize('teacher'), upload.single('photo'), editTeacherProfile);
router.delete('/deleteEducation/:educationId', protect, authorize('teacher'), deleteEducation);
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
router.post('/assignment', protect, authorize('teacher'), upload.single('photo'), assignmentForStudents);
router.get('/assignment', protect, authorize('teacher'), getAssignment);
router.get('/submittedAssignments/:id', protect, authorize('teacher'), getSubmittedAssignments);
router.post('/attendance', protect, authorize('teacher'), markAndUpdateAttendance);
router.get('/attendance', protect, authorize('teacher'), viewAttendance);
router.post('/timetable', protect, authorize('teacher'), createOrUpdateTimetable);
router.post('/onlineLectures', protect, authorize('teacher'), createOnlineLectures);
router.get('/timetable', protect, authorize('teacher'), getOnlineLecturesAndTimetable);
router.delete('/timetable/:periodId', protect, authorize('teacher'), deleteTimetablePeriod);
router.get('/syllabus/:className?', protect, authorize('teacher'), getSyllabus);
router.post('/studyMaterial', protect, authorize('teacher'), upload.single('photo'), uploadStudyMaterial);
router.get('/studyMaterial', protect, authorize('teacher'), getStudyMaterial);
router.patch('/studyMaterial/:materialId', protect, authorize('teacher'), upload.single('photo'), editStudyMaterial)
router.delete('/studyMaterial/:materialId', protect, authorize('teacher'), deleteStudyMaterial);
router.post('/exams', protect, authorize('teacher'), createExams);
router.get('/exams', protect, authorize('teacher'), getExams);
router.patch('/exam/:id', protect, authorize('teacher'), editExam);
router.delete('/exam/:id', protect, authorize('teacher'), deleteExam);
router.post('/classPlan', protect, authorize('teacher'), createOrUpdateClassPlan);
router.get('/get', protect, authorize('teacher'), getClassAndSectionFor);
router.get('/classPlan/:className?/:section?', protect, authorize('teacher'), getClassPlan);
router.get('/getSandE', protect, authorize('teacher'), getStudentsAndExams);
router.post('/results', protect, authorize('teacher'), createResults);
router.get('/results', protect, authorize('teacher'), getResults);
router.patch('/results/:id', protect, authorize('teacher'), editResult);
router.get('/result/:resultId', protect, authorize('teacher'), getResultById);
router.get('/aimobjective', protect, authorize('teacher'), getAimObjective);
router.get('/dashboard', protect, authorize('teacher'), getTeacherDashboard);
router.post('/expenseRequest', protect, authorize('teacher'), requestExpense); //request item for class
router.get('/requests', protect, authorize('teacher'), getTeacherExpenseRequests); // get request data of teacher
router.patch('/expenseRequested/:id', protect, authorize('teacher'), editTeacherExpenseRequests);
router.get('/classAccounts', protect, authorize('teacher'), getTeacherAccounts);

router.get('/notifications', protect, authorize('teacher'), getNotifications);
router.patch('/notification/:id', protect, authorize('teacher'), markNotificationAsRead);


router.post('/createBook', protect, authorize('teacher'), upload.single('photo'), createBook);
router.get('/books', protect, authorize('teacher'), getBooks);// librarian
router.patch('/bookRequest/:requestId', protect, authorize('teacher'), issueAndReturnBook);// librarian
router.patch('/resolveBookRequest/:requestId', protect, authorize('teacher'), resolveBookRequest); //librarian
router.get('/library', protect, authorize('teacher'), getLibraryData);// librarian
router.patch('/fineAmount', protect, authorize('admin'), editLibraryFineAmount); //librarian
router.patch('/book/:id', protect, authorize('teacher'), upload.single('photo'), editBook);
router.delete('/book/:bookId', protect, authorize('teacher'), deleteBook);// librarian

router.post('/query', protect, authorize('teacher'), sendQuery);
router.get('/query', protect, authorize('teacher'), getQueries);
router.post('/query/:id', protect, authorize('teacher'), replyToQuery);


router.post('/expenses', protect, authorize('teacher'), postSchoolExpensesForm); // accountant
router.patch('/expenses/:expenseId', protect, authorize('teacher'), editSchoolExpense); // accountant
router.delete('/expenses/:expenseId', protect, authorize('teacher'), deleteSchoolExpense); // accountant
router.get('/expenseRequest', protect, authorize('teacher'), getExpenseRequest); // accountant
router.patch('/expenseRequest/:requestId', protect, authorize('teacher'), updateExpenseRequest); // accountant
router.get('/accounts', protect, authorize('teacher'), getAccounts); //accountant
router.get('/accountsData', protect, authorize('teacher'), getAccountsData); //accountant
router.post('/income', protect, authorize('teacher'), addSchoolIncome); //accountant
router.post('/income/:id', protect, authorize('teacher'), editSchoolIncome); //accountant
router.get('/updatedIncomeHistory/:id', protect, authorize('teacher'), getUpdatedSchoolIncomeHistory); //accountant


router.get('/newAdmission', protect, authorize('teacher'), getNewAdmissions); // admissions manager
router.get('/admission', protect, authorize('teacher'), getAdmissionRequests); // admissions manager
router.post('/admission/:id', protect, authorize('teacher'), createInstantAccount); // admissions manager
router.post('/registersp', protect, authorize('teacher'), upload.single('photo'), createStudentAndParent); // admissions manager
router.get('/students/:className/:section', protect, authorize('teacher'), getStudentsBasedOnClassAndSection); // admissions manager
router.post('/addStudent', protect, authorize('teacher'),upload.single('photo'), addStudentToExistingParent); // admissions manager


router.post('/inventory/add', protect, authorize('teacher'), addStock); // inventory clerk
router.get('/inventory', protect, authorize('teacher'), getInventory); // inventory clerk
router.post('/inventory/sale', protect, authorize('teacher'), saleStockTo); // inventory clerk
router.get('/inventory/sale', protect, authorize('teacher'), getSaleStock); // inventory clerk




module.exports = router;
