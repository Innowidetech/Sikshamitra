const express = require('express');

const { editSchool, createSchool, createTeacher, createStudentAndParent, changeStudentStatus, getAllTeachersOfSchool, getAllStudentsOfSchool, getAllParentsOfSchool, getStudentsIsActiveRatio, getStudentsRatio, updateStudentData, changeTeacherSalary, getProfile, getCurriculum, newAdmission, createBook, deleteBook, getBooks, numberOfSPT, getStudentById, createNotice, getNotice, deleteNotice, addStudentToExistingParent, createOrUpdateSyllabus, createClass, editClass, createDynamicCalendar, getClasses } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getResults, getSyllabus } = require('../controllers/teacher.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router()

router.get('/getProfile', protect, authorize('admin'), getProfile);
router.post('/create-school', protect, authorize('admin'), upload.single('photo'), createSchool);
router.post('/class', protect, authorize('admin'), createClass);
router.patch('/class/:classId', protect, authorize('admin'), editClass);
router.get('/classes', protect, authorize('admin'), getClasses);
router.put('/edit', protect, authorize('admin'), upload.single('photo'), editSchool);
router.post('/register', protect, authorize('admin'), upload.single('photo'), createTeacher);
router.get('/teachers', protect, authorize('admin'), getAllTeachersOfSchool);
router.post('/registersp', protect, authorize('admin'), upload.single('photo'), createStudentAndParent);
router.post('/addStudent', protect, authorize('admin'),upload.single('photo'), addStudentToExistingParent);
router.get('/students', protect, authorize('admin'), getAllStudentsOfSchool);
router.get('/student/:studentId',protect, authorize('admin'), getStudentById);
router.get('/parents', protect, authorize('admin'), getAllParentsOfSchool);
router.get('/count',protect,authorize('admin'), numberOfSPT);
router.get('/students/isActive', protect, authorize('admin'), getStudentsIsActiveRatio);
router.get('/students/gender', protect, authorize('admin'), getStudentsRatio);
router.post('/notice', protect,authorize('admin'),createNotice);
router.get('/notice', protect, authorize('admin'),getNotice);
router.delete('/notice/:noticeId',protect, authorize('admin'), deleteNotice);
router.post('/calendar', protect, authorize('admin'), createDynamicCalendar);
router.post('/syllabus', protect, authorize('admin'), upload.single('photo'), createOrUpdateSyllabus);
router.get('/syllabus', protect, authorize('admin'), getSyllabus);
router.put('/student/:id/:isActive', protect, authorize('admin'), changeStudentStatus);
router.post('/student/promote/:studentId', protect, authorize('admin'), updateStudentData);
router.post('/teacher/salary/:teacherId', protect, authorize('admin'), changeTeacherSalary);
router.get('/newAdmission', protect, authorize('admin'), newAdmission);
router.get('/curriculum', protect, authorize('admin'), getCurriculum);
router.post('/createBook', protect, authorize('admin'), createBook);
router.get('/books',protect,authorize('admin'),getBooks);
router.delete('/book/:bookId', protect,authorize('admin'), deleteBook);
router.get('/results',protect, authorize('admin'), getResults);

    
module.exports = router;
