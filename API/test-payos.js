const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const payosService = require('./services/payos.service.new');

async function testPayOS() {
  try {
    const paymentData = {
      orderCode: 123456, // Simple fixed number
      amount: 50000,
      description: "Test payment",
      cancelUrl: "http://localhost:3000/cancel",
      returnUrl: "http://localhost:3000/success",
      notifyUrl: "http://localhost:3000/webhook",
      items: [{
        name: "Test Product",
        quantity: 1,
        price: 50000
      }]
    };

    console.log('Testing PayOS API with data:', JSON.stringify(paymentData, null, 2));
    
    try {
      const result = await payosService.createPaymentLink(paymentData);
      console.log('Payment link created successfully:', result);
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      process.exit(1);
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testPayOS().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 