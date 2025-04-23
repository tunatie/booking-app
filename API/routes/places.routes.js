const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const Place = require('../models/Place');
const { verifyToken } = require('../middleware/auth');
require('dotenv').config();

const getUserDataFromReq = (req) => {
    try {
        // Get token from Authorization header or cookies
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : req.cookies?.token;

            if (!token) {
            throw new Error('No token provided');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        throw error;
    }
};

// Get all places (public)
router.get('/places', async (req, res) => {
    try {
        console.log('Fetching places with query:', req.query); // Debug log

        // Parse pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Validate pagination parameters
        if (page < 1 || limit < 1) {
            return res.status(400).json({ 
                error: 'Invalid pagination parameters. Page and limit must be positive numbers.' 
            });
        }

        // Get total count for pagination
        const total = await Place.countDocuments({ draft: false });

        // Fetch paginated places
        const places = await Place.find({ draft: false })
            .populate('owner', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        console.log(`Found ${places.length} places`); // Debug log

        res.json({
            places,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ 
            error: 'Failed to fetch places',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get user's places (protected)
router.get('/places/user-places', verifyToken, async (req, res) => {
    try {
        console.log('User from token:', req.user); // Debug log
        
        const places = await Place.find({ 
            owner: req.user.id,
            draft: false 
        }).sort({ createdAt: -1 });

        console.log('Found places:', places); // Debug log
        res.json(places);
    } catch (error) {
        console.error('Error fetching user places:', error);
        res.status(500).json({ 
            error: 'Failed to fetch places',
            details: error.message,
            stack: error.stack // Debug info
        });
    }
});

// Get form data (protected)
router.get('/places-form-data', verifyToken, async (req, res) => {
    try {
        // Find or create a draft place for the user
        let place = await Place.findOne({ 
            owner: req.user.id,
            draft: true
        });

        if (!place) {
            place = await Place.create({
                owner: req.user.id,
                draft: true,
                formData: {}
            });
        }

        console.log('Getting form data for user:', req.user.id, place.formData);
        res.json(place.formData);
    } catch (error) {
        console.error('Error getting form data:', error);
        res.status(500).json({ 
            error: 'Failed to get form data',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update form data (protected)
router.put('/places-form-data', verifyToken, async (req, res) => {
    try {
        // Find or create a draft place for the user
        let place = await Place.findOne({ 
            owner: req.user.id,
            draft: true
        });

        if (!place) {
            place = await Place.create({
                owner: req.user.id,
                draft: true,
                formData: {}
            });
        }

        // Update form data
        place.formData = {
            ...place.formData,
            ...req.body
        };

        await place.save();
        
        console.log('Updated form data for user:', req.user.id, place.formData);
        res.json(place.formData);
    } catch (error) {
        console.error('Error updating form data:', error);
        res.status(500).json({ 
            error: 'Failed to update form data',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Delete form data (protected)
router.delete('/places-form-data', verifyToken, async (req, res) => {
    try {
        // Find and update the draft place
        const result = await Place.findOneAndUpdate(
            { owner: req.user.id, draft: true },
            { formData: {} },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'No draft place found' });
        }

        res.json({ success: true, message: 'Form data deleted successfully' });
    } catch (error) {
        console.error('Error deleting form data:', error);
        res.status(500).json({ 
            error: 'Failed to delete form data',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Create a new place (protected)
router.post('/places', verifyToken, async (req, res) => {
    try {
        const { formData } = req.body;
        
        // Validate required fields
        if (!formData) {
            return res.status(400).json({ error: 'Form data is required' });
        }

        // Validate and convert price to number
        const price = Number(formData.price);
=======
const jwtSecret = 'asdasdc3dcsxsdasda';
const Place = require('../models/Place');

// In-memory storage for form data (you may want to use MongoDB instead in production)
const formDataStorage = new Map();

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        try {
            const token = req.cookies?.token;
            if (!token) {
                console.log('No token found in cookies');
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

// Create a new place
router.post('/places', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate and convert price to number
        const price = Number(req.body.price);
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        if (isNaN(price) || price < 100000) {
            return res.status(400).json({ 
                error: 'Invalid price. Price must be a number and at least 100,000 VND' 
            });
        }

<<<<<<< HEAD
        // Convert form data to place data structure
        const placeData = {
            owner: req.user.id,
            title: formData.title,
            address: formData.location?.street,
            photos: formData.photos || [],
            description: formData.description,
            perks: formData.amenities || [],
            extraInfo: formData.extraInfo,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            maxGuests: formData.floorPlan?.guests,
            price: price,
            draft: false,
            
            // Thông tin cơ bản
            placeType: formData.placeType,
            propertyType: formData.propertyType,
            privacyType: formData.privacyType,
            location: {
                country: formData.location?.country,
                street: formData.location?.street,
                city: formData.location?.city,
                state: formData.location?.state,
                postalCode: formData.location?.postalCode
            },

            // Thông tin chi tiết
            floorPlan: {
                guests: formData.floorPlan?.guests,
                bedrooms: formData.floorPlan?.bedrooms,
                beds: formData.floorPlan?.beds,
                bathrooms: formData.floorPlan?.bathrooms
            },
            amenities: formData.amenities || [],
            standOut: formData.standOut || [],

            // Thông tin đặt phòng
            guestType: formData.guestType,
            discounts: {
                weekly: formData.discounts?.weekly,
                monthly: formData.discounts?.monthly
            },
            security: {
                hasCamera: formData.security?.hasCamera || false,
                hasNoiseDetector: formData.security?.hasNoiseDetector || false,
                hasWeapon: formData.security?.hasWeapon || false
            }
=======
        const placeData = {
            ...req.body,
            price: price, // Use the converted price
            owner: userData.id,
            draft: false
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        };

        console.log('Creating new place:', placeData);
        const place = await Place.create(placeData);
        console.log('Place created:', place);

<<<<<<< HEAD
        // Clear form data after successful creation
        await Place.findOneAndUpdate(
            { owner: req.user.id, draft: true },
            { formData: {} }
        );

=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        res.json(place);
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ 
            error: 'Failed to create place',
            details: error.message 
        });
    }
});

<<<<<<< HEAD
// Get a single place by ID (public)
=======
// Get form data
router.get('/places-form-data', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const formData = formDataStorage.get(userData.id) || {};
        console.log('Getting form data for user:', userData.id, formData);
        res.json(formData);
    } catch (error) {
        console.error('Error getting form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update form data
router.put('/places-form-data', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get existing data
        const existingData = formDataStorage.get(userData.id) || {};
        
        // Merge with new data
        const updatedData = {
            ...existingData,
            ...req.body
        };

        // Store updated data
        formDataStorage.set(userData.id, updatedData);
        
        console.log('Updated form data for user:', userData.id, updatedData);
        res.json(updatedData);
    } catch (error) {
        console.error('Error updating form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete form data
router.delete('/places-form-data', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        formDataStorage.delete(userData.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single place by ID
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
router.get('/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place.findById(id)
            .populate('owner', 'name email avatar');

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(place);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ error: 'Failed to fetch place' });
    }
});

module.exports = router; 