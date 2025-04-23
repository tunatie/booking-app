const payosService = require('./services/payos.service');

const testData = {
  amount: 450000,
  description: 'Test payment 9',
  orderCode: 6001,
  cancelUrl: 'https://72d4-42-119-148-171.ngrok-free.app/api/payment/cancel',
  returnUrl: 'https://72d4-42-119-148-171.ngrok-free.app/api/payment/return',
  items: [{
    name: 'Test Item 9',
    quantity: 3,
    price: 150000
  }]
};

console.log('Test signature:', payosService.createSignature(testData)); 