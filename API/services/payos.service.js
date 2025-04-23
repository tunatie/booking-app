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
      const dataCopy = { ...data };

      // Chuyển đổi tất cả các giá trị thành chuỗi
      for (const key in dataCopy) {
        if (dataCopy[key] === null || dataCopy[key] === undefined) {
          dataCopy[key] = '';
        } else if (typeof dataCopy[key] === 'object') {
          if (Array.isArray(dataCopy[key])) {
            // Nếu là paymentMethodIds thì nối bằng dấu phẩy
            if (key === 'paymentMethodIds') {
              dataCopy[key] = dataCopy[key].join(',');
            } else {
              // Các mảng khác vẫn chuyển thành JSON
              dataCopy[key] = JSON.stringify(dataCopy[key]).replace(/\\/g, '').replace(/^"|"$/g, '');
            }
          } else {
            dataCopy[key] = JSON.stringify(dataCopy[key]).replace(/\\/g, '').replace(/^"|"$/g, '');
          }
        } else {
          dataCopy[key] = String(dataCopy[key]);
        }
      }

      // Sắp xếp các key theo thứ tự alphabet
      const sortedKeys = Object.keys(dataCopy).sort();
      
      // Tạo chuỗi để ký
      const stringToSign = sortedKeys
        .map(key => {
          const value = dataCopy[key];
          if (key === 'items') {
            return `${key}=${value}`;
          }
          return `${key}=${value}`;
        })
        .join('&');
      
      console.log('PayOS Service - String to sign:', stringToSign);
      
      // Tạo chữ ký HMAC SHA256
      const hmac = crypto.createHmac('sha256', this.checksumKey);
      hmac.update(stringToSign);
      const signature = hmac.digest('hex');
      
      console.log('PayOS Service - Generated signature:', signature);
      return signature;
    } catch (error) {
      console.error('PayOS Service - Error creating signature:', error);
      throw error;
    }
  }

  async createPaymentLink(paymentData) {
    try {
      console.log('PayOS Service - Creating payment with data:', JSON.stringify(paymentData, null, 2));

      // Chuẩn bị dữ liệu cho việc tạo chữ ký
      const itemsString = `[{"name":"${paymentData.items[0].name}","quantity":${paymentData.items[0].quantity},"price":${paymentData.items[0].price}}]`;
      const signData = {
        orderCode: String(paymentData.orderCode),
        amount: String(paymentData.amount),
        description: paymentData.description,
        cancelUrl: paymentData.cancelUrl,
        returnUrl: paymentData.returnUrl,
        notifyUrl: paymentData.notifyUrl,
        items: itemsString,
        currency: "VND",
        paymentMethodIds: "2,1,3"
      };

      // Tạo chữ ký
      const signature = this.createSignature(signData);

      // Chuẩn bị dữ liệu để gửi đi
      const requestData = {
        orderCode: String(paymentData.orderCode),
        amount: String(paymentData.amount),
        description: paymentData.description,
        cancelUrl: paymentData.cancelUrl,
        returnUrl: paymentData.returnUrl,
        notifyUrl: paymentData.notifyUrl,
        items: paymentData.items,
        currency: "VND",
        paymentMethodIds: ["2", "1", "3"],
        signature: signature
      };

      console.log('PayOS Service - Final request data:', JSON.stringify(requestData, null, 2));

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

      console.log('PayOS Service - API Response:', JSON.stringify(response.data, null, 2));
      return response.data.data;
    } catch (error) {
      console.error('PayOS Service - API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  }

  verifyWebhook(data, signature) {
    const calculatedSignature = this.createSignature(data);
    return signature === calculatedSignature;
  }
}

module.exports = new PayOSService();
