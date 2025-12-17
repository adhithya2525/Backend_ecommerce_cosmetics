const express = require('express');
const router = express.Router();
const { verifyEmail, resetPassword } = require('../Controllers/ForgotPasswordController');

router.post('/verify-email', verifyEmail);
router.post('/reset', resetPassword);

module.exports = router;