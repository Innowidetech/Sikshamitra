const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAssignedTasks } = require('../controllers/admin.controller');
const { editSchoolTaskStatus, editSATaskStatus } = require('../controllers/staff.controller');
const { getSAAssignedTasks } = require('../controllers/superAdmin.controller');
const router = express.Router();

//admin
router.get('/stasks', protect, authorize('teacher'), getAssignedTasks);
router.patch('/stask/:id', protect, authorize('teacher'), editSchoolTaskStatus);

//super admin
router.get('/satasks', protect, authorize('superadmin'), getSAAssignedTasks);
router.patch('/satask/:id', protect, authorize('superadmin'), editSATaskStatus);


module.exports = router;