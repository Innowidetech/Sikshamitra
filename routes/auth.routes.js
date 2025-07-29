const express = require('express');
const router = express.Router();
const { userLogin, forgotPassword, resetPassword, logout } = require('../controllers/auth.controller');
const {protect} = require('../middleware/auth.middleware');

router.post('/login', userLogin);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword',resetPassword);
router.post('/logout',protect, logout)

module.exports = router;