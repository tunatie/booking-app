const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  orderCode: {
    type: Number,
    required: true,
    unique: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'PAID', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'payos'
  },
  transactionId: {
    type: String,
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commission: {
    type: Number
  },
  hostAmount: {
    type: Number
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Đảm bảo các index
transactionSchema.index({ orderCode: 1 }, { unique: true });
transactionSchema.index({ bookingId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema); 