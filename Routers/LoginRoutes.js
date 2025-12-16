const express = require('express');
const router = express.Router();
const { loginUser } = require('../Controllers/LoginController');

router.post('/user', loginUser);

module.exports = router;