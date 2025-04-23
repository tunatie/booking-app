const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

class PayOSService {
  constructor() {
    console.log('PayOS Service - Loading environment variables...');
    console.log('PAYOS_CLIENT_ID:', process.env.PAYOS_CLIENT_ID);
    console.log('PAYOS_API_KEY:', process.env.PAYOS_API_KEY);
    console.log('PAYOS_CHECKSUM_KEY:', process.env.PAYOS_CHECKSUM_KEY);
    console.log('PAYOS_BASE_URL:', process.env.PAYOS_BASE_URL);
    console.log('DEV_PAYOS_CALLBACK_URL:', process.env.DEV_PAYOS_CALLBACK_URL);

    this.clientId = process.env.PAYOS_CLIENT_ID;
    this.apiKey = process.env.PAYOS_API_KEY;
    this.checksumKey = process.env.PAYOS_CHECKSUM_KEY;
    this.baseUrl = process.env.PAYOS_BASE_URL || 'https://api-merchant.payos.vn';

    if (!this.clientId || !this.apiKey || !this.checksumKey) {
      console.error('PayOS Service - Missing required environment variables:', {
        clientId: !!this.clientId,
        apiKey: !!this.apiKey,
        checksumKey: !!this.checksumKey
      });
      throw new Error('Missing required PayOS environment variables');
    }

    console.log('PayOS Service - Environment variables loaded successfully');
  }

  createSignature(data) {
    try {
      // Chỉ lấy các trường bắt buộc theo thứ tự alphabet
      const requiredFields = {
        amount: String(data.amount),
        cancelUrl: data.cancelUrl,
        description: data.description,
        orderCode: String(data.orderCode),
        returnUrl: data.returnUrl
      };

      // Tạo chuỗi theo format: amount=xxx&cancelUrl=xxx&description=xxx&orderCode=xxx&returnUrl=xxx
      const stringToSign = Object.entries(requiredFields)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      console.log('PayOS Debug - Required fields:', JSON.stringify(requiredFields, null, 2));
      console.log('PayOS Debug - String to sign:', stringToSign);
      console.log('PayOS Debug - Checksum key:', this.checksumKey);

      // Tạo HMAC SHA256
      const hmac = crypto.createHmac('sha256', this.checksumKey);
      hmac.update(stringToSign);
      const signature = hmac.digest('hex');

      console.log('PayOS Debug - Generated signature:', signature);

      return signature;
    } catch (error) {
      console.error('PayOS createSignature error:', error);
      throw error;
    }
  }

  async createPaymentLink(paymentData) {
    try {
      console.log('PayOS Service - Starting createPaymentLink...');
      console.log('PayOS Service - Environment check:', {
        clientId: this.clientId ? 'Set' : 'Not set',
        apiKey: this.apiKey ? 'Set' : 'Not set',
        checksumKey: this.checksumKey ? 'Set' : 'Not set',
        baseUrl: this.baseUrl
      });

      // Chuẩn bị dữ liệu theo đúng format PayOS
      const data = {
        orderCode: Number(paymentData.orderCode),
        amount: Number(paymentData.amount),
        description: paymentData.description,
        cancelUrl: paymentData.cancelUrl,
        returnUrl: paymentData.returnUrl,
        notifyUrl: paymentData.notifyUrl
      };

      console.log('PayOS Service - Request data before signature:', JSON.stringify(data, null, 2));

      // Tạo signature
      const signature = this.createSignature(data);

      // Thêm signature vào data
      const requestData = {
        ...data,
        signature
      };

      console.log('PayOS Service - Final request data:', JSON.stringify(requestData, null, 2));
      console.log('PayOS Service - API endpoint:', `${this.baseUrl}/v2/payment-requests`);
      console.log('PayOS Service - Headers:', {
        'x-client-id': this.clientId,
        'x-api-key': '***' + this.apiKey.slice(-4),
        'Content-Type': 'application/json'
      });

      try {
        const response = await axios.post(
          `${this.baseUrl}/v2/payment-requests`,
          requestData,
          {
            headers: {
              'x-client-id': this.clientId,
              'x-api-key': this.apiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('PayOS Service - Payment request successful');
        console.log('PayOS Service - Response:', JSON.stringify(response.data, null, 2));

        // Trả về trực tiếp response từ API payment-requests vì nó đã chứa qrCode
        return response.data;
      } catch (apiError) {
        console.error('PayOS Service - API call failed:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          error: apiError.message
        });
        throw apiError;
      }
    } catch (error) {
      console.error('PayOS Service - createPaymentLink error:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  verifyWebhook(data, signature) {
    console.warn("Deprecated: Direct call to verifyWebhook is likely incorrect. Use verifyWebhookSignature instead.");
    return false;
  }

  verifyWebhookSignature(webhookBody, signatureFromBody) {
    try {
      // 1. Lấy data từ webhook body
      const dataToSign = webhookBody.data;
      if (!dataToSign) {
        console.error("verifyWebhookSignature: Missing 'data' object in webhook body");
        return false;
      }

      // Log full data for debugging
      console.log('PayOS Verify Webhook - Full webhook data:', JSON.stringify(webhookBody, null, 2));
      console.log('PayOS Verify Webhook - Data to sign:', JSON.stringify(dataToSign, null, 2));

      // 2. Sắp xếp các key theo thứ tự alphabet
      const sortedData = {};
      Object.keys(dataToSign).sort().forEach(key => {
        let value = dataToSign[key];
        // Xử lý các giá trị null/undefined thành chuỗi rỗng
        if (value === null || value === undefined || value === 'null' || value === 'undefined') {
          value = '';
        } else {
          value = String(value);
        }
        sortedData[key] = value;
      });

      // 3. Tạo chuỗi ký theo format key=value&
      const stringToSign = Object.entries(sortedData)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      console.log('PayOS Verify Webhook - String to sign:', stringToSign);
      console.log('PayOS Verify Webhook - Checksum key:', this.checksumKey);

      // 4. Tạo HMAC SHA256
      const hmac = crypto.createHmac('sha256', this.checksumKey);
      hmac.update(stringToSign);
      const calculatedSignature = hmac.digest('hex');

      console.log('PayOS Verify Webhook - Calculated Signature:', calculatedSignature);
      console.log('PayOS Verify Webhook - Signature from Body:', signatureFromBody);

      // 5. So sánh chữ ký một cách an toàn
      if (!signatureFromBody || calculatedSignature.length !== signatureFromBody.length) {
        console.warn('Webhook signature length mismatch or missing signature from body.');
        return false;
      }

      // Sử dụng crypto.timingSafeEqual để chống tấn công timing attack
      const isValid = crypto.timingSafeEqual(Buffer.from(calculatedSignature), Buffer.from(signatureFromBody));
      
      console.log('PayOS Verify Webhook - Signature valid:', isValid);
      return isValid;

    } catch (error) {
      console.error('Error during webhook signature verification:', error);
      return false;
    }
  }
}

module.exports = new PayOSService(); 