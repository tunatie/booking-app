const crypto = require('crypto');
const https = require('https');
const Booking = require('../models/Booking');
const Payment = require('../models/payment.model');

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
}; 