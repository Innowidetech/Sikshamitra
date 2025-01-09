const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getAllSchools, userRegister, changeSchoolStatus } = require('../controllers/superAdmin.controller');
const router = express.Router();

router.post('/register', protect,authorize('superadmin'), userRegister);
router.get('/get-all-schools',protect,authorize('superadmin'),getAllSchools);
router.put('/school/:id/:status', protect,authorize('superadmin'),changeSchoolStatus);

module.exports = router;
