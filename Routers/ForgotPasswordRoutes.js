const express = require('express');
const router = express.Router();
const { resetPassword } = require('../Controllers/ForgotPasswordController');

router.post('/reset', resetPassword);

module.exports = router;