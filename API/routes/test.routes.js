const express = require('express');
const router = express.Router();
const payosService = require('../services/payos.service.new');

router.get('/ping', (req, res) => {
  console.log('[DEBUG] Test ping route hit');
  res.json({ message: 'Test routes are working!' });
});

router.post('/payos-signature', async (req, res) => {
    try {
        // Tạo orderCode là số ngẫu nhiên 8 chữ số
        const orderCode = Math.floor(10000000 + Math.random() * 90000000);

        // Tạo dữ liệu test cơ bản theo đúng format PayOS yêu cầu
        const testData = {
            orderCode,  // Số nguyên
            amount: 50000,
            description: 'Test thanh toán PayOS',
            cancelUrl: process.env.DEV_PAYOS_CANCEL_URL,
            returnUrl: process.env.DEV_PAYOS_RETURN_URL,
            notifyUrl: process.env.DEV_PAYOS_CALLBACK_URL
        };

        console.log('Test Route - Request Data:', JSON.stringify(testData, null, 2));

        // Gọi API PayOS
        const response = await payosService.createPaymentLink(testData);

        res.json({
            success: true,
            requestData: testData,
            response
        });
    } catch (error) {
        console.error('Test PayOS Error:', error.response?.data || error);
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
            requestData: testData
        });
    }
});

module.exports = router; 