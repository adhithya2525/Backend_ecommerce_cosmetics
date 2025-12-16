const express = require('express');
const router = express.Router();
const { updateSubscription } = require('../Controllers/SubscriptionController');

router.post('/update', updateSubscription);

module.exports = router;