const crypto = require('crypto');
const https = require('https');
const Booking = require('../models/Booking');
const Payment = require('../models/payment.model');
<<<<<<< HEAD
const Transaction = require('../models/transaction.model');
const payosService = require('../services/payos.service');
const Place = require('../models/Place');
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd

// MoMo Config
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/payment/callback',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:4000/api/payment/notify'
};

const createMoMoSignature = (rawSignature, secretKey) => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
};

exports.createMoMoPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Lấy thông tin booking
    const booking = await Booking.findById(bookingId).populate('place');
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
    }

    // Tạo mã đơn hàng unique
    const orderId = `${bookingId}_${Date.now()}`;
    
    // Chuẩn bị dữ liệu thanh toán
    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: orderId,
      amount: booking.price,
      orderId: orderId,
      orderInfo: `Thanh toan dat phong: ${booking.place.title}`,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      requestType: 'captureWallet',
      extraData: '',
      lang: 'vi'
    };

    // Tạo chữ ký
    const rawSignature = `accessKey=${requestData.accessKey}&amount=${requestData.amount}&extraData=${requestData.extraData}&ipnUrl=${requestData.ipnUrl}&orderId=${requestData.orderId}&orderInfo=${requestData.orderInfo}&partnerCode=${requestData.partnerCode}&redirectUrl=${requestData.redirectUrl}&requestId=${requestData.requestId}&requestType=${requestData.requestType}`;
    requestData.signature = createMoMoSignature(rawSignature, MOMO_CONFIG.secretKey);

    // Gọi API MoMo
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(requestData))
      }
    };

    const momoRequest = https.request(options, momoRes => {
      let responseData = '';
      
      momoRes.on('data', chunk => {
        responseData += chunk;
      });

      momoRes.on('end', () => {
        const momoResponse = JSON.parse(responseData);
        
        // Lưu thông tin thanh toán vào booking
        booking.paymentDetails = {
          provider: 'momo',
          orderId: orderId,
          amount: requestData.amount,
          status: 'pending'
        };
        booking.save();

        res.json({
          payUrl: momoResponse.payUrl,
          orderId: orderId
        });
      });
    });

    momoRequest.on('error', error => {
      console.error('Error calling MoMo API:', error);
      res.status(500).json({ message: 'Lỗi khi tạo thanh toán' });
    });

    momoRequest.write(JSON.stringify(requestData));
    momoRequest.end();

  } catch (error) {
    console.error('Create MoMo payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.handleMoMoCallback = async (req, res) => {
  try {
    const { orderId, resultCode, amount, message } = req.query;
    const bookingId = orderId.split('_')[0];

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
    }

    if (resultCode === '0') {
      // Thanh toán thành công
      booking.status = 'confirmed';
      booking.paymentDetails.status = 'completed';
      await booking.save();
      
      res.redirect(`/trips?payment=success&bookingId=${bookingId}`);
    } else {
      // Thanh toán thất bại
      booking.paymentDetails.status = 'failed';
      booking.paymentDetails.failureMessage = message;
      await booking.save();
      
      res.redirect(`/trips?payment=failed&bookingId=${bookingId}&message=${encodeURIComponent(message)}`);
    }
  } catch (error) {
    console.error('MoMo callback error:', error);
    res.redirect('/trips?payment=error');
  }
};

exports.handleMoMoIPNCallback = async (req, res) => {
  try {
    const { orderId, resultCode, amount, signature } = req.body;
    
    // Verify signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=&orderId=${orderId}&partnerCode=${MOMO_CONFIG.partnerCode}&requestId=${orderId}`;
    const checkSignature = createMoMoSignature(rawSignature, MOMO_CONFIG.secretKey);
    
    if (signature !== checkSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const bookingId = orderId.split('_')[0];
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (resultCode === '0') {
      booking.status = 'confirmed';
      booking.paymentDetails.status = 'completed';
      await booking.save();
    }

    res.json({ message: 'OK' });
  } catch (error) {
    console.error('MoMo IPN callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Xử lý webhook từ MB Bank
exports.handleBankWebhook = async (req, res) => {
    try {
        // 1. Verify webhook signature from MB Bank
        const mbSignature = req.headers['x-mb-signature'];
        const requestBody = req.body;
        
        // TODO: Implement signature verification with MB Bank's method
        // if (!verifyMBSignature(requestBody, mbSignature)) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Invalid signature'
        //     });
        // }

        // 2. Parse MB Bank webhook data
        const { 
            refNo,              // Mã giao dịch của MB
            transactionDate,    // Ngày giao dịch
            creditAmount,       // Số tiền nhận
            description,        // Nội dung chuyển khoản
            creditAccount,      // Tài khoản nhận
            debitAccount,       // Tài khoản chuyển
            bankName           // Tên ngân hàng chuyển
        } = requestBody;

        // 3. Kiểm tra duplicate transaction
        const existingPayment = await Payment.findOne({ transactionId: refNo });
        if (existingPayment) {
            console.log('Duplicate transaction:', refNo);
            return res.status(200).json({
                success: true,
                message: 'Giao dịch đã được xử lý trước đó'
            });
        }

        // 4. Tìm booking ID trong nội dung chuyển khoản
        const bookingId = description.trim();
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            console.error('Booking not found:', bookingId);
            // Lưu log giao dịch không tìm thấy booking
            await Payment.create({
                transactionId: refNo,
                amount: creditAmount,
                status: 'booking_not_found',
                description: `Không tìm thấy booking: ${bookingId}`
            });
            
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn đặt phòng'
            });
        }

        // 5. Validate amount
        const expectedAmount = booking.price + (booking.serviceFee || 0) - (booking.discount || 0);
        if (creditAmount !== expectedAmount) {
            console.warn('Amount mismatch:', {
                expected: expectedAmount,
                received: creditAmount,
                bookingId
            });
            
            await Payment.create({
                booking: bookingId,
                amount: creditAmount,
                transactionId: refNo,
                status: 'amount_mismatch',
                description: `Expected: ${expectedAmount}, Received: ${creditAmount}`,
                bankDetails: {
                    debitAccount,
                    bankName,
                    transactionDate
                }
            });

            return res.status(400).json({
                success: false,
                message: 'Số tiền không khớp'
            });
        }

        // 6. Create payment record
        await Payment.create({
            booking: bookingId,
            amount: creditAmount,
            transactionId: refNo,
            status: 'completed',
            description: 'Thanh toán thành công',
            bankDetails: {
                debitAccount,
                bankName,
                transactionDate
            }
        });

        // 7. Update booking status
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        booking.confirmedAt = new Date();
        await booking.save();

        // 8. Async: Send notifications
        setImmediate(async () => {
            try {
                // TODO: Implement email/notification service
                // await sendPaymentConfirmation(booking);
                console.log('Should send payment confirmation for booking:', bookingId);
            } catch (error) {
                console.error('Failed to send notification:', error);
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Xử lý thanh toán thành công'
        });

    } catch (error) {
        console.error('MB Bank webhook error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xử lý webhook'
        });
    }
};

// Kiểm tra trạng thái thanh toán
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
        }

        // Kiểm tra quyền truy cập (chỉ user đặt phòng hoặc chủ phòng mới được xem)
        if (booking.user.toString() !== req.user._id.toString() && 
            booking.place.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const paymentStatus = booking.paymentDetails?.status || 'pending';
        res.json({
            status: paymentStatus,
            booking: booking
        });

    } catch (error) {
        console.error('Check payment status error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xác nhận thanh toán thủ công (admin only)
exports.verifyPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { transactionId, verificationNote } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
        }

        // Cập nhật trạng thái booking và payment
        booking.status = 'confirmed';
        booking.paymentDetails = {
            ...booking.paymentDetails,
            status: 'completed',
            verifiedAt: new Date(),
            verifiedBy: req.user._id,
            transactionId,
            verificationNote
        };

        await booking.save();

        // Tạo bản ghi payment mới
        const payment = new Payment({
            booking: bookingId,
            amount: booking.price,
            status: 'completed',
            method: 'bank_transfer',
            transactionId,
            verifiedBy: req.user._id,
            verificationNote
        });

        await payment.save();

        res.json({
            message: 'Xác nhận thanh toán thành công',
            booking: booking
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
<<<<<<< HEAD
};

exports.createPayment = async (req, res) => {
  try {
    console.log('Payment Controller - Received request with data:', JSON.stringify(req.body, null, 2));
    
    const paymentData = {
      ...req.body,
      notifyUrl: process.env.DEV_PAYOS_CALLBACK_URL
    };

    console.log('Payment Controller - Payment data with notifyUrl:', JSON.stringify(paymentData, null, 2));

    try {
      const result = await payosService.createPaymentLink(paymentData);
      console.log('Payment Controller - PayOS service result:', JSON.stringify(result, null, 2));

      if (!result) {
        throw new Error('PayOS service returned null result');
      }

      // Create transaction record
      const transaction = new Transaction({
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        status: 'pending',
        paymentMethod: 'payos',
        transactionId: result?.id || `PAYOS_${Date.now()}`
      });

      await transaction.save();
      console.log('Payment Controller - Transaction saved:', JSON.stringify(transaction, null, 2));

      res.json(result);
    } catch (payosError) {
      console.error('Payment Controller - PayOS Error:', {
        message: payosError.message,
        response: payosError.response?.data,
        status: payosError.response?.status,
        headers: payosError.response?.headers,
        stack: payosError.stack
      });
      res.status(500).json({ 
        error: 'Error creating payment',
        details: payosError.response?.data || payosError.message
      });
    }
  } catch (error) {
    console.error('Payment Controller - Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { data, signature } = req.body;
    
    // Verify webhook signature
    const isValid = payosService.verifyWebhook(data, signature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Find and update transaction
    const transaction = await Transaction.findOne({ orderCode: data.orderCode });
    if (!transaction) {
      console.error('Transaction not found:', data.orderCode);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction status
    transaction.status = data.status === 'PAID' ? 'completed' : 'failed';
    await transaction.save();

    // If payment successful, update booking
    if (data.status === 'PAID') {
      const booking = await Booking.findById(transaction.bookingId);
      if (booking) {
        booking.status = 'confirmed';
        await booking.save();
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      message: 'Error processing webhook',
      error: error.message
    });
  }
};

exports.testPayment = async (req, res) => {
  try {
    const orderCode = 'TEST-' + Date.now();
    const amount = 122000; // 122,000 VND for testing

    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: 'Test payment',
      cancelUrl: `https://ddb1-42-119-148-171.ngrok-free.app/api/payment/cancel`,
      returnUrl: `https://ddb1-42-119-148-171.ngrok-free.app/api/payment/return`,
      notifyUrl: process.env.DEV_PAYOS_CALLBACK_URL,
      items: [{
        name: "Test Item",
        quantity: 1,
        price: amount
      }],
      currency: "VND"
    };

    console.log('Test payment data:', JSON.stringify(paymentData, null, 2));

    const result = await payosService.createPaymentLink(paymentData);
    console.log('PayOS response:', result);

    if (!result || !result.checkoutUrl) {
      throw new Error('Invalid PayOS response');
    }

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
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
}; 