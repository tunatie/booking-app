import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Update this with your actual API URL

export const createPaymentLink = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/payment/create`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/payment/verify/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 