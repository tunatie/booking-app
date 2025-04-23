const express = require('express');
const router = express.Router();
const { 
  testPayment, 
  checkPaymentStatus, 
  createPayOSPayment, 
  handlePayOSReturn, 
  handlePayOSCancel, 
  handlePayOSWebhook 
} = require('../controllers/payosController');

// Test routes
router.get('/ping', (req, res) => {
  console.log('[DEBUG] PayOS ping route hit');
  res.json({ message: 'PayOS routes are working!' });
});

router.post('/test', testPayment);

// Payment routes
router.post('/create', createPayOSPayment);
router.get('/status/:orderCode', checkPaymentStatus);

// Return URLs
router.get('/return', handlePayOSReturn);
router.get('/cancel', handlePayOSCancel);

// Webhook
router.post('/webhook', handlePayOSWebhook);

module.exports = router; 