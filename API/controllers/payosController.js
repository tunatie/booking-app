const Transaction = require('../models/transaction.model');
const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');
const payosService = require('../services/payos.service.new');

// API test thanh toán với PayOS
const testPayment = async (req, res) => {
  try {
    console.log('[DEBUG] Starting testPayment...');
    
    // Tạo mã đơn hàng dạng số
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderCode = parseInt(`${timestamp}${random}`);
    
    console.log('[DEBUG] Creating payment data with orderCode:', orderCode);
    
    const paymentData = {
      orderCode: orderCode,
      amount: 10000,
      description: 'Test thanh toán PayOS'
    };

    console.log('[DEBUG] Calling payosService.createPaymentLink...');
    const result = await payosService.createPaymentLink(paymentData);
    
    return res.json({
      success: true,
      message: 'Test payment link created',
      orderCode: orderCode,
      paymentUrl: result.checkoutUrl
    });
  } catch (error) {
    console.error('[ERROR] testPayment error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create test payment',
      error: error.response?.data || error.message
    });
  }
};

// API kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const paymentInfo = await payosService.checkPaymentStatus(orderCode);
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

// Tạo link thanh toán PayOS
const createPayOSPayment = async (req, res) => {
  try {
    console.log('[DEBUG] Request body:', req.body);
    const { bookingId, amount, description } = req.body;

    // Validate input
    if (!bookingId || !amount) {
      console.log('[DEBUG] Missing required fields:', { bookingId, amount });
      return res.status(400).json({ 
        message: 'Thiếu thông tin thanh toán' 
      });
    }

    // Tìm booking
    console.log('[DEBUG] Finding booking with ID:', bookingId);
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log('[DEBUG] Booking not found:', bookingId);
      return res.status(404).json({ 
        message: 'Không tìm thấy đơn đặt phòng' 
      });
    }

    console.log('[DEBUG] Found booking:', {
      bookingId: booking._id,
      amount: booking.totalPrice,
      status: booking.status
    });

    // Tạo mã đơn hàng từ timestamp và random number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderCode = parseInt(`${timestamp}${random}`);

    // Tạo transaction record
    console.log('[DEBUG] Creating transaction with orderCode:', orderCode);
    const transaction = new Transaction({
      bookingId,
      amount,
      description: description || `Thanh toán đặt phòng #${bookingId.slice(-6)}`,
      orderCode: orderCode,
      paymentMethod: 'payos',
      transactionId: orderCode.toString(),
      status: 'pending',
      hostId: booking.place?.owner,
      guestId: booking.user
    });

    console.log('[DEBUG] Saving transaction...');
    await transaction.save();
    console.log('[DEBUG] Transaction saved successfully');

    // Tạo payment request với PayOS - chỉ dùng các trường cần thiết
    const paymentData = {
      orderCode: orderCode,
      amount: Number(amount),
      description: description || `Thanh toán đặt phòng #${bookingId.slice(-6)}`,
      cancelUrl: process.env.DEV_PAYOS_CANCEL_URL || 'http://localhost:5173/payment/cancel',
      returnUrl: process.env.DEV_PAYOS_RETURN_URL || 'http://localhost:5173/payment/success',
      notifyUrl: process.env.DEV_PAYOS_CALLBACK_URL || 'http://localhost:4001/api/payment/webhook'
    };

    console.log('[DEBUG] PayOS request data:', JSON.stringify(paymentData, null, 2));
    console.log('[DEBUG] Environment variables:', {
      clientId: process.env.PAYOS_CLIENT_ID,
      apiKey: '***' + (process.env.PAYOS_API_KEY || '').slice(-4),
      checksumKey: '***' + (process.env.PAYOS_CHECKSUM_KEY || '').slice(-4),
      cancelUrl: process.env.DEV_PAYOS_CANCEL_URL,
      returnUrl: process.env.DEV_PAYOS_RETURN_URL,
      notifyUrl: process.env.DEV_PAYOS_CALLBACK_URL
    });

    console.log('[DEBUG] Calling PayOS service...');
    const result = await payosService.createPaymentLink(paymentData);
    console.log('[DEBUG] PayOS response:', result);

    // Kiểm tra response từ PayOS
    if (result && result.code === "00") {
        // Response thành công
        res.status(200).json({
            success: true,
            message: 'Tạo link thanh toán thành công',
            paymentUrl: result.data?.checkoutUrl,
            qrCode: result.data?.qrCode,
            accountInfo: {
                accountNo: result.data?.accountNumber,
                accountName: result.data?.accountName,
                bankName: "Ngân hàng TMCP Quân đội",
                amount: paymentData.amount,
                description: paymentData.description
            },
            orderCode: orderCode
        });
    } else {
        // Response thất bại từ PayOS
        throw new Error(result.desc || 'PayOS response không thành công');
    }
  } catch (error) {
    console.error('[ERROR] PayOS payment error:', {
      error: error.response?.data || error,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      message: 'Không thể tạo link thanh toán',
      error: error.response?.data?.desc || error.message 
    });
  }
};

// Xử lý return URL từ PayOS
const handlePayOSReturn = async (req, res) => {
  try {
    const { orderCode } = req.query;
    
    // Tìm transaction và booking để lấy thông tin
    const transaction = await Transaction.findOne({ transactionId: orderCode });
    if (transaction) {
      const booking = await Booking.findById(transaction.bookingId);
      if (booking) {
        res.redirect(`${process.env.CLIENT_URL}/payment/success?orderCode=${orderCode}&bookingId=${booking._id}&status=success`);
        return;
      }
    }
    res.redirect(`${process.env.CLIENT_URL}/payment/success?orderCode=${orderCode}&status=success`);
  } catch (error) {
    console.error('PayOS return error:', error);
    res.redirect(`${process.env.CLIENT_URL}/trips?status=error`);
  }
};

// Xử lý cancel URL từ PayOS
const handlePayOSCancel = async (req, res) => {
  try {
    const { orderCode } = req.query;
    res.redirect(`${process.env.CLIENT_URL}/payment/cancelled?orderCode=${orderCode}`);
  } catch (error) {
    console.error('PayOS cancel error:', error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
  }
};

// Xử lý webhook từ PayOS
const handlePayOSWebhook = async (req, res) => {
  const webhookData = req.body;
  const signatureFromBody = webhookData.signature;

  console.log('\n------ Webhook Received ------');
  console.log('Webhook Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Webhook Body:', JSON.stringify(webhookData, null, 2));

  if (!signatureFromBody) {
    console.warn('Webhook received without signature in body.');
    return res.status(200).json({ message: 'Missing signature in body, webhook acknowledged.' }); 
  }
  
  try {
    const isValidSignature = payosService.verifyWebhookSignature(webhookData, signatureFromBody);

    if (!isValidSignature) {
      console.warn('Invalid webhook signature (calculated vs body).');
      return res.status(200).json({ message: 'Invalid signature, webhook acknowledged.' }); 
    }

    console.log('Webhook signature verified successfully.');

    const isSuccess = webhookData.code === '00' && webhookData.success === true;
    const orderCode = webhookData.data?.orderCode;
    const statusFromWebhook = webhookData.data?.status || (isSuccess ? 'PAID' : 'FAILED');

    if (!orderCode) {
      console.warn('Webhook verified, but missing orderCode in data.');
      return res.status(200).json({ message: 'Missing orderCode, webhook acknowledged.' });
    }

    // Tìm Transaction
    const transaction = await Transaction.findOne({ transactionId: orderCode });
    if (!transaction) {
      console.warn(`Webhook verified, but transactionId not found: ${orderCode}`);
      return res.status(200).json({ message: 'Transaction not found, webhook acknowledged.' });
    }

    // Chỉ cập nhật nếu trạng thái thay đổi
    if (transaction.status !== statusFromWebhook) {
      transaction.status = statusFromWebhook;
      await transaction.save();
      console.log(`Webhook: Updated transaction ${orderCode} status to ${statusFromWebhook}`);

      // Cập nhật Booking nếu trạng thái là thành công
      if (isSuccess) { 
        const booking = await Booking.findByIdAndUpdate(transaction.bookingId, {
          status: 'confirmed',
          paymentStatus: 'paid'
        }, { new: true });
        
        console.log(`Webhook: Updated booking ${transaction.bookingId} status to confirmed/paid`);

        // Gửi thông báo qua Socket.IO
        const io = req.app.get('io');
        if (io) {
          io.to(`booking_${transaction.bookingId}`).emit('payment_success', {
            bookingId: transaction.bookingId,
            amount: transaction.amount,
            message: 'Thanh toán thành công!'
          });
        }
      } else {
        const paymentStatus = statusFromWebhook.toLowerCase();
        console.log(`Webhook: Transaction ${orderCode} has status ${statusFromWebhook}.`);
        await Booking.findByIdAndUpdate(transaction.bookingId, {
          paymentStatus: paymentStatus
        });
        console.log(`Webhook: Updated booking ${transaction.bookingId} paymentStatus to ${paymentStatus}`);
      }
    } else {
      console.log(`Webhook: Transaction ${orderCode} already has status ${statusFromWebhook}. No update needed.`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Error processing PayOS webhook:', error);
    res.status(200).json({ message: 'Internal server error processing webhook, acknowledged.' });
  }
};

module.exports = {
  testPayment,
  checkPaymentStatus,
  createPayOSPayment,
  handlePayOSReturn,
  handlePayOSCancel,
  handlePayOSWebhook
};