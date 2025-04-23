const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');
const payosService = require('../services/payosService');

// API test thanh toán với PayOS
exports.testPayment = async (req, res) => {
  try {
    const orderCode = 'TEST-' + Date.now();
    const amount = 10000; // 10,000 VND for testing

    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: 'Test payment',
      cancelUrl: `${process.env.DEV_PAYOS_CALLBACK_URL}/payment/cancel`,
      returnUrl: `${process.env.DEV_PAYOS_CALLBACK_URL}/payment/success`,
      items: [{
        name: "Test Item",
        quantity: 1,
        price: amount
      }]
    };

    console.log('Test payment data:', paymentData);

    const result = await payosService.createPaymentLink(paymentData);

    res.status(200).json({
      message: 'Payment link created successfully',
      paymentUrl: result.checkoutUrl,
      orderCode: orderCode
    });
  } catch (error) {
    console.error('PayOS test payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to create payment link',
      error: error.response?.data || error.message 
    });
  }
};

// Tạo đơn hàng thanh toán
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;
    
    // Lấy thông tin booking
    const booking = await Booking.findById(bookingId)
      .populate('propertyId')
      .populate('userId');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Tính toán phí hoa hồng (ví dụ: 10%)
    const commission = amount * 0.1;
    const hostAmount = amount - commission;

    // Tạo transaction mới
    const transaction = new Transaction({
      bookingId,
      amount,
      paymentMethod,
      transactionId: uuidv4(),
      hostId: booking.propertyId.userId,
      guestId: booking.userId,
      commission,
      hostAmount
    });

    await transaction.save();

    // Tạo URL thanh toán (sẽ tích hợp với VNPay/Momo sau)
    const paymentUrl = `https://your-payment-gateway.com/pay?transactionId=${transaction.transactionId}`;

    res.status(200).json({
      message: 'Payment created successfully',
      paymentUrl,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xử lý callback từ cổng thanh toán
exports.handlePaymentCallback = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Cập nhật trạng thái giao dịch
    transaction.status = status;
    await transaction.save();

    if (status === 'completed') {
      // Cập nhật trạng thái booking
      await Booking.findByIdAndUpdate(transaction.bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid'
      });

      // Gửi thông báo cho chủ nhà và khách hàng
      // TODO: Implement notification system
    }

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy lịch sử giao dịch
exports.getTransactionHistory = async (req, res) => {
  try {
    const { userId, role } = req.user; // role: 'host' hoặc 'guest'

    const query = role === 'host' ? { hostId: userId } : { guestId: userId };
    
    const transactions = await Transaction.find(query)
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Webhook handler cho Zalopay
exports.zalopayWebhook = async (req, res) => {
  try {
    const { 
      app_id,
      app_trans_id,
      app_time,
      app_user,
      amount,
      zp_trans_id,
      server_time,
      channel,
      merchant_user_id,
      user_fee_amount,
      discount_amount,
      status
    } = req.body;

    // Verify signature
    const data = `${app_id}|${app_trans_id}|${app_time}|${amount}|${status}|${server_time}`;
    const signature = crypto
      .createHmac('sha256', process.env.ZALOPAY_KEY2)
      .update(data)
      .digest('hex');

    if (signature !== req.headers['x-zp-signature']) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Tìm transaction
    const transaction = await Transaction.findOne({ transactionId: app_trans_id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Cập nhật trạng thái giao dịch
    transaction.status = status === 1 ? 'completed' : 'failed';
    transaction.paymentDate = new Date(server_time * 1000);
    await transaction.save();

    if (status === 1) { // Thanh toán thành công
      // Cập nhật trạng thái booking
      await Booking.findByIdAndUpdate(transaction.bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid'
      });

      // Gửi thông báo cho chủ nhà và khách hàng
      // TODO: Implement notification system
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tạo link thanh toán PayOS
exports.createPayOSPayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = await Booking.findById(bookingId)
      .populate('propertyId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const orderCode = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: `Thanh toán đặt phòng #${bookingId.slice(-6)}`,
      cancelUrl: `${process.env.CLIENT_URL}/payment/cancel`,
      returnUrl: `${process.env.CLIENT_URL}/payment/success`,
      items: [{
        name: `Đặt phòng #${bookingId.slice(-6)}`,
        quantity: 1,
        price: amount
      }]
    };

    console.log('Payment data being sent to PayOS:', paymentData);

    const paymentUrl = await payosService.createPaymentLink(paymentData);

    const commission = Math.round(amount * 0.1); // 10% commission
    const hostAmount = amount - commission;

    const transaction = new Transaction({
      bookingId: bookingId,
      amount: amount,
      commission: commission,
      hostAmount: hostAmount,
      orderCode: orderCode,
      status: 'pending'
    });

    await transaction.save();

    return res.status(200).json({
      message: 'Payment link created successfully',
      paymentUrl: paymentUrl
    });

  } catch (error) {
    console.error('Error in createPayOSPayment:', error);
    return res.status(500).json({
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// Webhook handler cho PayOS
exports.payosWebhook = async (req, res) => {
  try {
    const { 
      code,
      desc,
      data,
      signature
    } = req.body;

    // Xác thực webhook
    if (!payosService.verifyWebhook(data, signature)) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const { 
      orderCode,
      amount,
      description,
      status,
      createdAt,
      transactionId
    } = data;

    // Tìm transaction
    const transaction = await Transaction.findOne({ transactionId: orderCode });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Cập nhật trạng thái giao dịch
    transaction.status = status === 'PAID' ? 'completed' : 'failed';
    transaction.paymentDate = new Date(createdAt);
    await transaction.save();

    if (status === 'PAID') {
      // Cập nhật trạng thái booking
      await Booking.findByIdAndUpdate(transaction.bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid'
      });

      // Gửi thông báo cho chủ nhà và khách hàng
      // TODO: Implement notification system
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('PayOS Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// API kiểm tra trạng thái thanh toán
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    
    // Gọi API PayOS để kiểm tra trạng thái
    const paymentInfo = await payosService.getPaymentInfo(orderCode);

    res.status(200).json({
      message: 'Payment status retrieved successfully',
      paymentInfo
    });
  } catch (error) {
    console.error('PayOS check status error:', error);
    res.status(500).json({ 
      message: 'Failed to check payment status',
      error: error.message 
    });
  }
}; 