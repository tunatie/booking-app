const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'amount_mismatch', 'booking_not_found'],
        default: 'pending'
    },
    description: String,
    bankDetails: {
        debitAccount: String,
        bankName: String,
        transactionDate: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Payment', paymentSchema); 