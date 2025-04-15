console.log('[APP] app.js starting'); // DEBUG LOG
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();

const app = express();
console.log('[APP] Express app created'); // DEBUG LOG

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));
console.log('[APP] Core middleware applied'); // DEBUG LOG

app.use('/uploads', express.static(__dirname + '/uploads'));
console.log('[APP] Static uploads middleware applied'); // DEBUG LOG

// Connect to MongoDB
console.log('[APP] Connecting to MongoDB...'); // DEBUG LOG
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('[APP] Connected to MongoDB')) // DEBUG LOG on success
  .catch(err => console.error('[APP] MongoDB connection error:', err)); // Log error if connection fails

// Routes
console.log('[APP] Registering routes...'); // DEBUG LOG
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
console.log('[APP] Routes registered'); // DEBUG LOG

console.log('[APP] Starting server...'); // DEBUG LOG
app.listen(4000, () => {
  console.log('Server is running on port 4000');
}); 