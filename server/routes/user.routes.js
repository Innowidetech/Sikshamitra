const express = require('express');
const { applyOffline, contactUs, applyOnline, verifyRazorpayPayment, getAllSchoolsName, getBlogs, applyForEntranceExamination, getQuestionsToApplicants, submitExamAnswers ,verifyExamResultLogin} = require('../controllers/user.controller');
const multer = require('multer');
const { loginForEntranceExam } = require('../controllers/auth.controller');
const { protectEntranceApplicant } = require('../middleware/auth.middleware');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/schools', getAllSchoolsName);
router.post('/offline', applyOffline);
router.post('/contactUs', contactUs);

router.post('/applyOnline', upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'educationDocuments', maxCount: 12 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'voterId', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
]), applyOnline);

router.post('/verifyOnlinePayment', verifyRazorpayPayment);
router.get('/blogs', getBlogs);
router.post('/entranceExam', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'previousSchoolDetails[documents]', maxCount: 5 }
]), applyForEntranceExamination);
router.post('/examLogin', loginForEntranceExam);
router.get('/questionPaper', protectEntranceApplicant, getQuestionsToApplicants);
router.post('/submitAnswers', protectEntranceApplicant, submitExamAnswers);
router.post('/apply-online-login', verifyExamResultLogin);


module.exports = router;
