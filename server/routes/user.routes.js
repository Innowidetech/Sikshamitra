const express = require('express');
const { applyOffline, contactUs, applyOnline, verifyRazorpayPayment, getAllSchoolsName, getBlogs } = require('../controllers/user.controller');
const multer = require('multer');
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

module.exports = router;