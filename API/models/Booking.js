const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'awaiting_payment', 'paid', 'confirmed', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    confirmedAt: {
        type: Date
    },
    paymentDeadline: {
        type: Date
    },
    paidAt: {
        type: Date
    },
    cancelReason: {
        type: String
    },
    rejectReason: {
        type: String
    },
    serviceFee: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        default: function() {
            return this.price + (this.serviceFee || 0) - (this.discount || 0);
        }
    }
}, {
    timestamps: true
});

bookingSchema.pre('save', function(next) {
    this.totalAmount = this.price + (this.serviceFee || 0) - (this.discount || 0);
    next();
});

bookingSchema.index({ status: 1, paymentDeadline: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
    