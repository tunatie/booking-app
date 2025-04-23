const express = require('express');
const router = express.Router();
const payosService = require('../services/payos.service.new');

// Create payment link
router.post('/create', async (req, res) => {
  try {
    const { orderCode, amount, description, items } = req.body;
    
    const paymentData = {
      orderCode: parseInt(orderCode),
      amount: parseInt(amount),
      description,
      cancelUrl: `${process.env.CLIENT_URL}/payment/cancel`,
      returnUrl: `${process.env.CLIENT_URL}/payment/success`,
      notifyUrl: `${process.env.API_URL}/payment/webhook`,
      items: items || [{
        name: "Booking Payment",
        quantity: 1,
        price: parseInt(amount)
      }]
    };

    const result = await payosService.createPaymentLink(paymentData);
    res.json(result);
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Verify payment
router.get('/verify/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const result = await payosService.getPaymentLinkInfomation(paymentId);
    res.json(result);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const { data, signature } = req.body;
    const isValid = payosService.verifyWebhook(data, signature);
    
    if (isValid) {
      // Process the payment notification
      console.log('Valid webhook received:', data);
      res.json({ success: true });
    } else {
      console.error('Invalid webhook signature');
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 