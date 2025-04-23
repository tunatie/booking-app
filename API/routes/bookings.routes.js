const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Place = require('../models/Place');
<<<<<<< HEAD

// Lấy JWT secret từ biến môi trường
const jwtSecret = process.env.JWT_SECRET || 'asdasdc3dcsxsdasda';
=======
const User = require('../models/User');

const jwtSecret = 'asdasdc3dcsxsdasda';
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        try {
<<<<<<< HEAD
            // Kiểm tra token từ cả cookie và header
            const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
            if (!token) {
                console.log('No token found');
=======
            const token = req.cookies?.token;
            if (!token) {
                console.log('No token found in cookies');
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD
            place: placeId,
=======
            place,
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD
            placeId,
=======
            place,
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD
        if (!placeId) missingFields.push('place');
=======
        if (!place) missingFields.push('place');
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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

<<<<<<< HEAD
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
=======
        const bookingDoc = await Booking.create({
            place,
            user: userData.id,
            checkIn,
            checkOut,
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD
        const { type, status } = req.query;
        const userData = await getUserDataFromReq(req);
        
=======
        const { type } = req.query;
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userData = await getUserDataFromReq(req);
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let query = {};
<<<<<<< HEAD
        
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
=======
        if (type === 'host') {
            // Get all places owned by the user
            const userPlaces = await Place.find({ owner: userData.id });
            const placeIds = userPlaces.map(place => place._id);
            
            // Find bookings for these places
            query.place = { $in: placeIds };
        } else {
            // Regular user bookings
            query.user = userData.id;
        }
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd

        const bookings = await Booking.find(query)
            .populate('place')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

<<<<<<< HEAD
        console.log('Found bookings:', bookings.length);
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD
            .populate('place')
            .sort({ createdAt: -1 });

        res.json(bookings);
=======
            .populate({
                path: 'place',
                populate: {
                    path: 'owner',
                    select: 'bankBin bankAccountNumber bankAccountName'
                }
            })
            .sort({ createdAt: -1 });
            
        // Process bookings to add vietQRString if applicable
        const processedBookings = bookings.map(booking => {
            const bookingObj = booking.toObject();
            if (
                bookingObj.status === 'awaiting_payment' &&
                bookingObj.place?.owner?.bankBin &&
                bookingObj.place?.owner?.bankAccountNumber &&
                bookingObj.totalPrice > 0
            ) {
                const owner = bookingObj.place.owner;
                const amount = bookingObj.totalPrice;
                const description = `Thanh toan BOOKING${bookingObj._id.toString().slice(-6)}`;
                bookingObj.vietQRString = `${owner.bankBin}|${owner.bankAccountNumber}|print|${amount}|${description}`;
            } else {
                 bookingObj.vietQRString = null;
            }
            return bookingObj;
        });

        res.json(processedBookings);
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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
<<<<<<< HEAD

        // Kiểm tra quyền truy cập
=======
        
        // Fetch owner details separately to get bank info
        const owner = await User.findById(booking.place.owner).select('bankBin bankAccountNumber bankAccountName');

        // Check access rights after fetching booking
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        if (booking.user._id.toString() !== userData.id && 
            booking.place.owner.toString() !== userData.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

<<<<<<< HEAD
        console.log('Booking found:', booking);
        res.json(booking);
=======
        // Convert to plain object to add vietQRString
        const bookingObj = booking.toObject();
        bookingObj.vietQRString = null; // Initialize as null

        if (
            bookingObj.status === 'awaiting_payment' &&
            owner?.bankBin &&
            owner?.bankAccountNumber &&
            bookingObj.totalPrice > 0
        ) {
            const amount = bookingObj.totalPrice;
            const description = `Thanh toan BOOKING${bookingObj._id.toString().slice(-6)}`;
            bookingObj.vietQRString = `${owner.bankBin}|${owner.bankAccountNumber}|print|${amount}|${description}`;
        }

        console.log('Booking found (with QR attempt):', bookingObj);
        res.json(bookingObj); // Send the modified object
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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

<<<<<<< HEAD
        const validStatuses = ['awaiting_payment', 'cancelled'];
=======
        const validStatuses = ['pending', 'awaiting_payment', 'cancelled', 'confirmed', 'completed'];
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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

<<<<<<< HEAD
        // Check if the booking is in a state that allows status change (e.g., pending)
        if (booking.status !== 'pending') {
            return res.status(400).json({ error: `Cannot change status from ${booking.status}` });
        }

        booking.status = status;
=======
        // Check valid status transitions
        const validTransitions = {
            'pending': ['awaiting_payment', 'cancelled'],
            'awaiting_payment': ['confirmed', 'cancelled'],
            'confirmed': ['completed', 'cancelled'],
            'completed': []
        };

        if (!validTransitions[booking.status]?.includes(status)) {
            return res.status(400).json({ 
                error: `Cannot change status from ${booking.status} to ${status}`,
                validTransitions: validTransitions[booking.status]
            });
        }

        booking.status = status;
        if (status === 'awaiting_payment') {
            // Set payment due time to 24 hours from now
            booking.paymentDueBy = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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

<<<<<<< HEAD
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

=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
module.exports = router; 