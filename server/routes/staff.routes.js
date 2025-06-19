const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAssignedTasks, getNotifications, markNotificationAsRead } = require('../controllers/admin.controller');
const { editSchoolTaskStatus, editSATaskStatus } = require('../controllers/staff.controller');
const { getSAAssignedTasks, editBlog, postBlog, deleteBlog, sendQuery, getQueries, replyToQuery } = require('../controllers/superAdmin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

//admin
router.get('/stasks', protect, authorize('teacher'), getAssignedTasks);
router.patch('/stask/:id', protect, authorize('teacher'), editSchoolTaskStatus);

router.get('/notifications', protect, authorize('teacher'), getNotifications);
router.patch('/notification/:id', protect, authorize('teacher'), markNotificationAsRead);

router.post('/query', protect, authorize('teacher'), sendQuery);
router.get('/query', protect, authorize('teacher'), getQueries);
router.post('/query/:id', protect, authorize('teacher'), replyToQuery);



//super admin
router.get('/satasks', protect, authorize('superadmin'), getSAAssignedTasks);
router.patch('/satask/:id', protect, authorize('superadmin'), editSATaskStatus);

router.post('/blog', protect, authorize('superadmin'), upload.array('photos'),  postBlog);
router.put('/blog/:id', protect, authorize('superadmin'), upload.array('photos'), editBlog);
router.delete('/blog/:id', protect, authorize('superadmin'), deleteBlog);

router.get('/sanotifications', protect, authorize('superadmin'), getNotifications);
router.patch('/sanotification/:id', protect, authorize('superadmin'), markNotificationAsRead);

router.post('/saquery', protect, authorize('superadmin'), sendQuery);
router.get('/saquery', protect, authorize('superadmin'), getQueries);
router.post('/saquery/:id', protect, authorize('superadmin'), replyToQuery);


module.exports = router;