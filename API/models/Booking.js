const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    place: {type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true},
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    numberOfGuests: {type: Number, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    price: {type: Number, required: true}, // base price
    cleaningFee: {type: Number, required: true},
    serviceFee: {type: Number, required: true},
    totalPrice: {type: Number, required: true}, // total including all fees
    status: {
        type: String,
        enum: ['pending', 'awaiting_payment', 'payment_submitted', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentProof: {type: String}, // URL hoặc base64 của ảnh biên lai
}, {
    timestamps: true
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
    