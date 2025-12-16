const express = require('express');
const router = express.Router();  
const { signupUser } = require('../Controllers/SignupController');

router.post('/user', signupUser); 
module.exports = router;

