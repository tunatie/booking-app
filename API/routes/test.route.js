const express = require('express');
const router = express.Router();
const payosService = require('../services/payos.service.new');

router.post('/payos-signature', async (req, res) => {
    try {
        // Tạo dữ liệu test cơ bản
        const testData = {
            orderCode: 'TEST_' + Date.now(),
            amount: 50000,
            description: 'Test thanh toán PayOS',
            cancelUrl: process.env.PAYOS_CANCEL_URL || "http://localhost:3000/payment/cancel",
            returnUrl: process.env.PAYOS_RETURN_URL || "http://localhost:3000/payment/success",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            items: [{
                name: "Test",
                quantity: 1,
                price: 50000
            }],
            currency: "VND",
            paymentMethodIds: ["ZALOPAY", "VISA", "MASTERCARD", "JCB", "QRCODE"]
        };

        // Tạo signature
        const signature = payosService.createSignature(testData);
        
        // Thêm signature vào data
        testData.signature = signature;

        // Gọi API PayOS
        const response = await payosService.createPaymentLink(testData);

        res.json({
            success: true,
            testData,
            signature,
            payosResponse: response
        });
    } catch (error) {
        console.error('Test PayOS Error:', error.response?.data || error);
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
            testData: req.body
        });
    }
});

module.exports = router; 