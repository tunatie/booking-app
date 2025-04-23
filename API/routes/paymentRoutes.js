const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Test payment route
router.post('/test', paymentController.testPayment);

console.log('[DEBUG] Payment routes registered');
module.exports = router; 