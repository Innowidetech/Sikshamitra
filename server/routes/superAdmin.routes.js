const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAllSchools, registerAdmin, changeSchoolStatus, postBlog, deleteBlog, getSchoolById } = require('../controllers/superAdmin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/register', protect,authorize('superadmin'), registerAdmin);
router.get('/schools',protect,authorize('superadmin'),getAllSchools);
router.get('/school/:schoolId', protect, authorize('superadmin'), getSchoolById);
router.put('/school/:id/:status', protect,authorize('superadmin'),changeSchoolStatus);
router.post('/blog', upload.single('photo'), protect, authorize('superadmin'), postBlog);
router.delete('/blog/:blogId', protect, authorize('superadmin'), deleteBlog);

module.exports = router;