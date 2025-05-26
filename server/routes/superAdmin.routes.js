const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAllSchools, changeSchoolStatus, postBlog, deleteBlog, getSchoolById, registerSchool, editBlog } = require('../controllers/superAdmin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/register', protect, authorize('superadmin'), registerSchool);
router.get('/schools',protect,authorize('superadmin'),getAllSchools);
// router.get('/school/:schoolId', protect, authorize('superadmin'), getSchoolById);
router.put('/school/:id/:status', protect,authorize('superadmin'), changeSchoolStatus);
router.post('/blog', protect, authorize('superadmin'), upload.array('photos'),  postBlog);
router.put('/blog/:id', protect, authorize('superadmin'), upload.array('photos'), editBlog);
router.delete('/blog/:id', protect, authorize('superadmin'), deleteBlog);
// router.delete('/blogDetail/:blogId', protect, authorize('superadmin'), deleteBlog);

module.exports = router;