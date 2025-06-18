const express = require('express');

const { editSchool, createTeacher, createStudentAndParent, getAllTeachersOfSchool, getAllStudentsOfSchool, getAllParentsOfSchool, getStudentsRatio, updateStudentData, updateTeacherData, getProfile, getNewAdmissions, createBook, deleteBook, getBooks, numberOfSPTE, createNotice, getNotice, deleteNotice, addStudentToExistingParent, createClass, editClass, createDynamicCalendar, getClasses, getDynamicCalendar, getDynamicCalendarByDate, createClassWiseFees, getClassWiseFees, editClassWiseFees, getUpdatedStudentData, addStock, getInventory, saleStockTo, getSaleStock, getLibraryData, createAimObjective, getAimObjective, deleteAimObjective, getTeacherNames, updateAandLBody, updateAandLParams, postSchoolExpensesForm, getAccounts, getAccountsData, getAandLUpdatesHistory, editSchoolExpense, deleteSchoolExpense, editNotice, editDynamicCalendar, deleteDynamicCalendar, createOrUpdateSyllabus, getExpenseRequest, updateExpenseRequest, addSchoolIncome, editSchoolIncome, getUpdatedSchoolIncomeHistory, editBook, getAdmissionRequests, createInstantAccount, issueAndReturnBook, editLibraryFineAmount, resolveBookRequest, addStaffMember, getStaffMembers, editStaffMember, assignTaskToStaff, getAssignedTasks, getStudentsBasedOnClassAndSection, getEntranceExamApplications, createOrUpdateQuestionPaperForEntranceExam, getEntranceExamQuestionPapers, sendEntranceExamDetailsToApplicants, getEntranceExamResults, sendEntranceExamResultToApplicants, getNotifications, markNotificationAsRead, createOrEditAuthorityAccess, editAimObjective } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getResults, getSyllabus, getExams } = require('../controllers/teacher.controller');
const multer = require('multer');
const { getQueries } = require('../controllers/superAdmin.controller');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/getProfile', protect, authorize('admin'), getProfile);
router.put('/edit', protect, authorize('admin'), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), editSchool);
router.post('/authorityAccess', protect, authorize('admin'), createOrEditAuthorityAccess);

router.post('/class', protect, authorize('admin'), createClass);
router.patch('/class/:classId', protect, authorize('admin'), editClass);
router.get('/classes', protect, authorize('admin'), getClasses);
router.post('/classwisefees', protect, authorize('admin'), createClassWiseFees);
router.get('/classwisefees', protect, authorize('admin'), getClassWiseFees);
router.put('/classwisefees/:classWiseFessId', protect, authorize('admin'), editClassWiseFees);
router.get('/count',protect,authorize('admin'), numberOfSPTE);
router.get('/students/ratio', protect, authorize('admin'), getStudentsRatio);
router.post('/notice', protect,authorize('admin'),createNotice);
router.get('/notice', protect, authorize('admin'),getNotice);
router.patch('/notice/:noticeId', protect, authorize('admin'), editNotice);
router.delete('/notice/:noticeId',protect, authorize('admin'), deleteNotice);
router.post('/calendar', protect, authorize('admin'), createDynamicCalendar);
router.get('/calendar', protect, authorize('admin'), getDynamicCalendar);
router.patch('/calendar/:calendarId', protect, authorize('admin'), editDynamicCalendar);
router.get('/calendar/:calendarDate', protect, authorize('admin'), getDynamicCalendarByDate);
router.delete('/calendar/:calendarId', protect, authorize('admin'), deleteDynamicCalendar);
router.post('/register', protect, authorize('admin'), upload.single('photo'), createTeacher);
router.get('/teacherNames', protect, authorize('admin'), getTeacherNames);
router.post('/authorityb', protect, authorize('admin'), updateAandLBody);
// router.get('/history', protect, authorize('admin'), getAandLUpdatesHistory);
// router.post('/authorityp/:employeeType/:action/:position?', protect, authorize('admin'), updateAandLParams);
router.post('/teacher/:teacherId', protect, authorize('admin'), updateTeacherData);
router.get('/teachers', protect, authorize('admin'), getAllTeachersOfSchool);

router.post('/registersp', protect, authorize('admin'), upload.single('photo'), createStudentAndParent);
router.get('/students/:className/:section', protect, authorize('admin'), getStudentsBasedOnClassAndSection);
router.post('/addStudent', protect, authorize('admin'),upload.single('photo'), addStudentToExistingParent);

router.get('/students', protect, authorize('admin'), getAllStudentsOfSchool);
// router.get('/student/:studentId',protect, authorize('admin'), getStudentById);
router.post('/student/:studentId', protect, authorize('admin'), updateStudentData);
router.get('/updatedStudentData/:studentId', protect, authorize('admin'), getUpdatedStudentData);
router.get('/parents', protect, authorize('admin'), getAllParentsOfSchool);

router.post('/inventory/add', protect, authorize('admin'), addStock);
router.get('/inventory', protect, authorize('admin'), getInventory);
router.post('/inventory/sale', protect, authorize('admin'), saleStockTo);
// router.post('/inventory/sale/:id', protect, authorize('admin'), saleStockTo);
router.get('/inventory/sale', protect, authorize('admin'), getSaleStock);

router.post('/syllabus', protect, authorize('admin'), upload.single('file'), createOrUpdateSyllabus);
router.get('/syllabus/:className?', protect, authorize('admin'), getSyllabus);

router.get('/newAdmission', protect, authorize('admin'), getNewAdmissions);
router.get('/admission', protect, authorize('admin'), getAdmissionRequests);
router.post('/admission/:id', protect, authorize('admin'), createInstantAccount);

router.post('/staff', protect, authorize('admin'), addStaffMember);
router.get('/staff', protect, authorize('admin'), getStaffMembers);
router.patch('/staff/:id', protect, authorize('admin'), editStaffMember);
router.post('/task', protect, authorize('admin'), assignTaskToStaff);
router.get('/tasks', protect, authorize('admin'), getAssignedTasks);

router.post('/aimobjective', protect, authorize('admin'), createAimObjective);
router.get('/aimobjective', protect, authorize('admin'), getAimObjective);
router.delete('/aimobjective/:aimobjectiveId', protect, authorize('admin'), deleteAimObjective);
router.patch('/aimobjective/:id', protect, authorize('admin'), editAimObjective);
router.post('/createBook', protect, authorize('admin'), upload.single('photo'), createBook);
router.get('/books',protect,authorize('admin'),getBooks);
router.get('/library', protect, authorize('admin'), getLibraryData);
router.patch('/fineAmount', protect, authorize('admin'), editLibraryFineAmount);
router.patch('/book/:id', protect,authorize('admin'), upload.single('photo'), editBook);
router.delete('/book/:bookId', protect,authorize('admin'), deleteBook);
router.patch('/bookRequest/:requestId', protect, authorize('admin'), issueAndReturnBook);
router.patch('/resolveBookRequest/:requestId', protect, authorize('admin'), resolveBookRequest);
router.get('/exams', protect, authorize('admin'), getExams);
router.get('/results',protect, authorize('admin'), getResults);
router.post('/expenses', protect, authorize('admin'), postSchoolExpensesForm);
router.patch('/expenses/:expenseId', protect, authorize('admin'), editSchoolExpense);
router.delete('/expenses/:expenseId', protect, authorize('admin'), deleteSchoolExpense);
router.get('/expenseRequest', protect, authorize('admin'), getExpenseRequest);
router.patch('/expenseRequest/:requestId', protect, authorize('admin'), updateExpenseRequest);
// router.delete('/expenseRequest/:requestId', protect, authorize('admin'), deleteExpenseRequest);
router.get('/accounts',protect, authorize('admin'), getAccounts);
router.get('/accountsData',protect, authorize('admin'), getAccountsData);
router.post('/income', protect, authorize('admin'), addSchoolIncome);
router.post('/income/:id', protect, authorize('admin'), editSchoolIncome);
router.get('/updatedIncomeHistory/:id', protect, authorize('admin'), getUpdatedSchoolIncomeHistory);

router.get('/applicants', protect, authorize('admin'), getEntranceExamApplications);
router.post('/questionPaper', protect, authorize('admin'), upload.any(), createOrUpdateQuestionPaperForEntranceExam);
router.get('/questionPaper/:className', protect, authorize('admin'), getEntranceExamQuestionPapers);
router.post('/sendExamDetails', protect, authorize('admin'), sendEntranceExamDetailsToApplicants);
router.get('/eeresults', protect, authorize('admin'), getEntranceExamResults);
router.post('/eeresults', protect, authorize('admin'), sendEntranceExamResultToApplicants);

router.get('/notifications', protect, authorize('admin'), getNotifications);
router.patch('/notification/:id', protect, authorize('admin'), markNotificationAsRead);

router.get('/query', protect, authorize('admin'), getQueries);


module.exports = router;

