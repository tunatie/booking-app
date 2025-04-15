const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const Place = require('../models/Place');

// Create a new booking
router.post('/', auth, async (req, res) => {
    try {
        const booking = new Booking({
            ...req.body,
            user: req.user._id
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all bookings for a user
router.get('/user', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('place')
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single booking
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('place')
            .populate('user', 'name email');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the user is the owner of the booking
        if (booking.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the user is the owner of the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(booking, req.body);
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the user is the owner of the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await booking.deleteOne();
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// NEW ROUTE: Get bookings for the host
router.get('/host', auth, async (req, res) => {
    try {
        const hostId = req.user._id; // Get host ID from authenticated user
        const requestedStatus = req.query.status;

        // 1. Find places owned by the host
        const hostPlaces = await Place.find({ owner: hostId }).select('_id');
        const hostPlaceIds = hostPlaces.map(p => p._id);

        // 2. Build the query for bookings
        const query = { place: { $in: hostPlaceIds } };

        // 3. Filter by status
        if (requestedStatus && requestedStatus !== 'all') {
            let backendStatus = requestedStatus;
            if (requestedStatus === 'upcoming') {
                backendStatus = 'pending'; // Assuming 'pending' is the status for upcoming bookings
            } else if (requestedStatus === 'completed') {
                backendStatus = 'completed'; // Adjust if your status name is different
            } else if (requestedStatus === 'cancelled') {
                backendStatus = 'cancelled'; // Adjust if your status name is different
            }

            if (backendStatus !== 'all') {
                query.status = backendStatus;
            }
        }

        // 4. Find bookings, populate place and user info
        const bookings = await Booking.find(query)
                                   .populate('place', 'title photos price') // Populate necessary place fields
                                   .populate('user', 'name') // Populate user name only
                                   .sort('-createdAt'); // Sort by creation date

        res.json(bookings);

    } catch (error) {
        console.error("Error fetching host bookings:", error);
        res.status(500).json({ message: 'Failed to fetch bookings.' });
    }
});

module.exports = router; 