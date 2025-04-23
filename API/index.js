console.log('[APP] Starting...'); // DEBUG LOG
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const placesRoutes = require('./routes/places.routes');
const bookingRoutes = require('./routes/bookings.routes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/payment.routes');
const testRoutes = require('./routes/test.routes');
const uploadRoutes = require('./routes/upload.routes');
const path = require('path');
require('dotenv').config();

// Log environment variables
console.log('[APP] Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PAYOS_CLIENT_ID:', process.env.PAYOS_CLIENT_ID);
console.log('PAYOS_API_KEY:', process.env.PAYOS_API_KEY);
console.log('PAYOS_CHECKSUM_KEY:', process.env.PAYOS_CHECKSUM_KEY);
console.log('PAYOS_BASE_URL:', process.env.PAYOS_BASE_URL);
console.log('DEV_PAYOS_CALLBACK_URL:', process.env.DEV_PAYOS_CALLBACK_URL);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
console.log('[APP] Express app created'); // DEBUG LOG

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

// Body parser middleware
app.use(express.json());
app.use(cookieParser());

console.log('[APP] Core middleware applied'); // DEBUG LOG

// Di chuyển paymentRoutes lên đầu tiên sau middleware cơ bản
app.use('/api/payment', paymentRoutes);
console.log('[APP] Payment routes registered early'); // DEBUG LOG

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('[APP] Static uploads middleware applied'); // DEBUG LOG

// Connect to MongoDB
console.log('[APP] Connecting to MongoDB...'); // DEBUG LOG
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('[APP] Connected to MongoDB')) // DEBUG LOG on success
  .catch(err => console.error('[APP] MongoDB connection error:', err)); // Log error if connection fails

// Routes
console.log('[APP] Registering other routes...'); // DEBUG LOG

// Mount other routes
app.use('/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', placesRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

console.log('[APP] Other routes registered'); // DEBUG LOG

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_booking_room', (bookingId) => {
    socket.join(`booking_${bookingId}`);
    console.log(`Client ${socket.id} joined room: booking_${bookingId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to our router
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
console.log('[APP] Starting server...'); // DEBUG LOG
const PORT = process.env.PORT || 4001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 