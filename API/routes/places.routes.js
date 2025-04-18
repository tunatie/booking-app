const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
        if (isNaN(price) || price < 100000) {
            return res.status(400).json({ 
                error: 'Invalid price. Price must be a number and at least 100,000 VND' 
            });
        }

        const placeData = {
            ...req.body,
            price: price, // Use the converted price
            owner: userData.id,
            draft: false
        };

        console.log('Creating new place:', placeData);
        const place = await Place.create(placeData);
        console.log('Place created:', place);

        res.json(place);
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ 
            error: 'Failed to create place',
            details: error.message 
        });
    }
});

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