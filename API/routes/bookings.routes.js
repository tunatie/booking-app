const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Place = require('../models/Place');

// Lấy JWT secret từ biến môi trường
const jwtSecret = process.env.JWT_SECRET || 'asdasdc3dcsxsdasda';

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        try {
            // Kiểm tra token từ cả cookie và header
            const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
            if (!token) {
                console.log('No token found');
                resolve(null);
                return;
            }

            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) {
                    console.error('JWT verification error:', err);
                    resolve(null);
                    return;
                }
                resolve(userData);
            });
        } catch (error) {
            console.error('Error in getUserDataFromReq:', error);
            resolve(null);
        }
    });
}

// Create new booking
router.post('/', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const {
            place: placeId,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            cleaningFee,
            serviceFee,
            totalPrice
        } = req.body;

        // Log request data
        console.log('Booking request data:', {
            placeId,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            cleaningFee,
            serviceFee,
            totalPrice,
            userId: userData.id
        });

        // Validate required fields
        const missingFields = [];
        if (!placeId) missingFields.push('place');
        if (!checkIn) missingFields.push('checkIn');
        if (!checkOut) missingFields.push('checkOut');
        if (!numberOfGuests) missingFields.push('numberOfGuests');
        if (!name) missingFields.push('name');
        if (!phone) missingFields.push('phone');
        if (!price) missingFields.push('price');
        if (!cleaningFee) missingFields.push('cleaningFee');
        if (!serviceFee) missingFields.push('serviceFee');
        if (!totalPrice) missingFields.push('totalPrice');

        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({ 
                error: 'Missing required fields',
                missingFields: missingFields
            });
        }

        // Kiểm tra place có tồn tại không
        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        // Kiểm tra ngày hợp lệ
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            return res.status(400).json({ error: 'Check-in date cannot be in the past' });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out date must be after check-in date' });
        }

        // Kiểm tra xem có booking nào trong khoảng thời gian này không
        const existingBooking = await Booking.findOne({
            place: placeId,
            $or: [
                {
                    checkIn: { $lte: checkOutDate },
                    checkOut: { $gte: checkInDate }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ error: 'Place is already booked for these dates' });
        }

        // Kiểm tra số lượng khách
        if (numberOfGuests > place.maxGuests) {
            return res.status(400).json({ 
                error: `Maximum number of guests allowed is ${place.maxGuests}` 
            });
        }

        // Tạo booking mới
        const bookingDoc = await Booking.create({
            place: placeId,
            user: userData.id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            numberOfGuests,
            name,
            phone,
            price,
            cleaningFee,
            serviceFee,
            totalPrice,
            status: 'pending'
        });

        console.log('Booking created successfully:', bookingDoc);
        res.json(bookingDoc);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            error: 'Failed to create booking', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get bookings (for both users and hosts)
router.get('/', async (req, res) => {
    try {
        const { type, status } = req.query;
        const userData = await getUserDataFromReq(req);
        
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let query = {};
        
        // Xử lý query dựa trên type (host/user)
        if (type === 'host') {
            // Lấy tất cả places của host
            const places = await Place.find({ owner: userData.id });
            const placeIds = places.map(place => place._id);
            
            // Tìm bookings cho các places của host
            query.place = { $in: placeIds };
        } else {
            // Mặc định là lấy bookings của user
            query.user = userData.id;
        }
        
        // Map frontend status to database status
        const statusMap = {
            'pending_host': 'pending',
            'pending_payment': 'awaiting_payment',
            'confirmed': 'confirmed',
            'completed': 'completed',
            'cancelled': 'cancelled'
        };

        // Nếu có status, thêm vào query với mapping
        if (status) {
            query.status = statusMap[status] || status;
        }

        console.log('Fetching bookings with query:', query);

        const bookings = await Booking.find(query)
            .populate('place')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        console.log('Found bookings:', bookings.length);
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's bookings with optional status filter
router.get('/user/:userId', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { userId } = req.params;
        const { status } = req.query;

        // Verify that the requesting user is accessing their own bookings
        if (userData.id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You can only access your own bookings' });
        }

        let query = { user: userId };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('place')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching booking with ID:', id);

        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findById(id)
            .populate('place')
            .populate('user', 'name email');

        if (!booking) {
            console.log('Booking not found:', id);
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Kiểm tra quyền truy cập
        if (booking.user._id.toString() !== userData.id && 
            booking.place.owner.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('Booking found:', booking);
        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update booking status (PATCH /:id)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userData = await getUserDataFromReq(req);

        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!status) {
            return res.status(400).json({ error: 'Missing status in request body' });
        }

        const validStatuses = ['awaiting_payment', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const booking = await Booking.findById(id).populate('place');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Authorization check: Only the owner of the place can confirm/reject
        if (booking.place.owner.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden: Only the place owner can update this booking status' });
        }

        // Check if the booking is in a state that allows status change (e.g., pending)
        if (booking.status !== 'pending') {
            return res.status(400).json({ error: `Cannot change status from ${booking.status}` });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);

    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH route to cancel a booking
router.patch('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await getUserDataFromReq(req);

        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Only the user who made the booking can cancel it
        if (booking.user.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden: You cannot cancel this booking' });
        }

        // Add logic for cancellation eligibility (e.g., cannot cancel if check-in is too close)
        // if (/* cannot cancel condition */) {
        //     return res.status(400).json({ error: 'Cannot cancel booking at this time' });
        // }

        // Update status to 'cancelled'
        booking.status = 'cancelled';
        await booking.save();

        console.log('Booking cancelled successfully:', booking);
        res.json(booking); // Return the updated booking
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route to delete a booking if status is 'pending'
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await getUserDataFromReq(req);

        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Only the user who made the booking can delete it
        if (booking.user.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden: You cannot delete this booking' });
        }

        // Only allow deletion if the status is 'pending'
        if (booking.status !== 'pending') {
            return res.status(400).json({ error: 'Cannot delete booking that is not in pending state' });
        }

        // Delete the booking
        await Booking.findByIdAndDelete(id);

        console.log('Booking deleted successfully:', id);
        res.status(204).send(); // Send 204 No Content for successful deletion
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Confirm payment with proof
router.patch('/:id/confirm-payment', async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentProof } = req.body;
        const userData = await getUserDataFromReq(req);

        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!paymentProof) {
            return res.status(400).json({ error: 'Payment proof is required' });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify that this booking belongs to the user
        if (booking.user.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden: You can only confirm payment for your own bookings' });
        }

        // Verify booking is in awaiting_payment status
        if (booking.status !== 'awaiting_payment') {
            return res.status(400).json({ error: 'This booking is not awaiting payment' });
        }

        // Save payment proof and update status
        booking.paymentProof = paymentProof;
        booking.status = 'payment_submitted';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Host confirms payment received
router.patch('/:id/confirm-payment-received', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await getUserDataFromReq(req);

        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findById(id).populate('place');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify that this booking is for a place owned by the user
        if (booking.place.owner.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden: You can only confirm payments for your own properties' });
        }

        // Verify booking is in payment_submitted status
        if (booking.status !== 'payment_submitted') {
            return res.status(400).json({ error: 'Payment has not been submitted for this booking' });
        }

        // Update status to confirmed
        booking.status = 'confirmed';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Error confirming payment received:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 