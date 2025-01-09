const express = require('express');

const { editSchool, createSchool, createTeacher, createStudentAndParent, changeStudentStatus, getAllTeachersOfSchool, getAllStudentsOfSchool, getAllParentsOfSchool, getStudentsIsActiveRatio, getStudentsGenderRatio, promoteStudent, changeTeacherSalary, getProfile, getCurriculum, newAdmission, createBook, deleteBook, getBooks, numberOfSPT, getStudentById, createNotice, getNotice, deleteNotice } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getResults } = require('../controllers/teacher.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router()

router.get('/getProfile', protect, authorize('admin'), getProfile);
router.post('/create-school', protect, authorize('admin'), createSchool);
router.patch('/edit/:id', protect, authorize('admin'), editSchool);
router.post('/register', protect, authorize('admin'), upload.single('photo'), createTeacher);
router.post('/registersp', protect, authorize('admin'), upload.single('photo'), createStudentAndParent);
router.put('/student/:id/:isActive', protect, authorize('admin'), changeStudentStatus);
router.get('/teachers', protect, authorize('admin'), getAllTeachersOfSchool);
router.get('/students', protect, authorize('admin'), getAllStudentsOfSchool);
router.get('/student/:studentId',protect, authorize('admin'), getStudentById);
router.get('/parents', protect, authorize('admin'), getAllParentsOfSchool);
router.get('/count',protect,authorize('admin'), numberOfSPT);
router.get('/students/isActive/:schoolId', protect, authorize('admin'), getStudentsIsActiveRatio);
router.get('/students/gender', protect, authorize('admin'), getStudentsGenderRatio);
router.post('/student/promote/:studentId', protect, authorize('admin'), promoteStudent);
router.post('/teacher/salary/:teacherId', protect, authorize('admin'), changeTeacherSalary);
router.get('/newAdmission', protect, authorize('admin'), newAdmission);
router.get('/curriculum', protect, authorize('admin'), getCurriculum);
router.post('/createBook', protect, authorize('admin'), createBook);
router.get('/books',protect,authorize('admin'),getBooks);
router.delete('/book/:bookId', protect,authorize('admin'), deleteBook);
router.get('/results',protect, authorize('admin'), getResults);
router.post('/notice', protect,authorize('admin'),createNotice);
router.get('/notice', protect, authorize('admin'),getNotice);
router.delete('/notice/:noticeId',protect, authorize('admin'), deleteNotice);

    
module.exports = router;
