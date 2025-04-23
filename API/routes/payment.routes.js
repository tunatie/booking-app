const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
<<<<<<< HEAD
const { 
  testPayment, 
  checkPaymentStatus, 
  createPayOSPayment, 
  handlePayOSReturn, 
  handlePayOSCancel, 
  handlePayOSWebhook 
} = require('../controllers/payosController');
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd

// Tạo thanh toán MoMo
router.post('/momo/:bookingId', verifyToken, paymentController.createMoMoPayment);

// Callback URL cho MoMo (client redirect)
router.get('/callback', paymentController.handleMoMoCallback);

// IPN URL cho MoMo (server notification)
router.post('/notify', paymentController.handleMoMoIPNCallback);

// Webhook từ ngân hàng
router.post('/bank-webhook', paymentController.handleBankWebhook);

// Kiểm tra trạng thái thanh toán
router.get('/status/:bookingId', verifyToken, paymentController.checkPaymentStatus);

// Xác nhận thanh toán thủ công (admin only)
router.post('/verify/:bookingId', verifyToken, isAdmin, paymentController.verifyPayment);

<<<<<<< HEAD
// PayOS routes
router.post('/test', testPayment);
router.post('/create', createPayOSPayment);
router.get('/status/:orderCode', checkPaymentStatus);
router.get('/return', handlePayOSReturn);
router.get('/cancel', handlePayOSCancel);
router.post('/webhook', handlePayOSWebhook);

=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
module.exports = router; 