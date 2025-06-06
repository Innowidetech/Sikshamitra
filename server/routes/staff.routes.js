const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAssignedTasks } = require('../controllers/admin.controller');
const { editSchoolTaskStatus } = require('../controllers/staff.controller');
const router = express.Router();

router.get('/tasks', protect, authorize('teacher'), getAssignedTasks);
router.patch('/task/:id', protect, authorize('teacher'), editSchoolTaskStatus);

module.exports = router;