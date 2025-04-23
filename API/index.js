console.log('[APP] Starting...'); // DEBUG LOG
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
<<<<<<< HEAD
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
=======
const imageDownloader = require('image-downloader');
const fs = require('fs');
const Booking = require('./models/Booking');
require('dotenv').config()
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asdasdc3dcsxsdasda';
const multer = require('multer');
const Place = require('./models/Place');
const bookingRoutes = require('./routes/bookings.routes'); // Import booking routes
const paymentRoutes = require('./routes/payment.routes'); // Assuming payment routes exist
const placesRoutes = require('./routes/places.routes'); // Import places routes

// Middleware
app.use(express.json())
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie', 'Date', 'ETag'],
    maxAge: 86400,
}));

mongoose.connect(process.env.MONGO_URL);

// Helper function
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        try {
            const token = req.cookies?.token;
            if (!token) {
                console.log('No token found in cookies');
                resolve(null);
                return;
            }
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd

console.log('[APP] Core middleware applied'); // DEBUG LOG

<<<<<<< HEAD
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
=======
                try {
                    const user = await User.findById(userData.id);
                    if (!user) {
                        console.log('User not found in database');
                        resolve(null);
                        return;
                    }
                    resolve(userData);
                } catch (dbError) {
                    console.error('Database error:', dbError);
                    resolve(null);
                }
            });
        } catch (error) {
            console.error('Error in getUserDataFromReq:', error);
            resolve(null);
        }
    });
}

// Photo upload middleware
const photosMiddleware = multer({dest: 'uploads/'});

// API Routes
const apiRouter = express.Router();

apiRouter.get('/test', (req,res) => {
    res.json('test ok');
});

apiRouter.post('/register', async (req,res) => {
    const {name,email,password} = req.body;
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({userDoc});
});

apiRouter.post('/login', async (req,res) => {
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json('Email và mật khẩu không được để trống');
        }
        const userDoc = await User.findOne({email});
        if (!userDoc) {
            return res.status(400).json('Không tìm thấy tài khoản với email này');
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(422).json('Mật khẩu không đúng');
        }
        jwt.sign({
            email: userDoc.email,
            id: userDoc._id
        }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json(userDoc);
        });
    } catch (error) {
        res.status(500).json('Có lỗi xảy ra khi đăng nhập');
    }
});

apiRouter.get('/profile', async (req,res) => {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json(null);
        }
    const user = await User.findById(userData.id);
        res.json(user);
});

apiRouter.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
});

// Add endpoint to update user's bank information
apiRouter.put('/bank-info', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const {
            bankName,
            bankAccountName,
            bankAccountNumber,
            bankBin,
            bankBranch
        } = req.body;

        // Basic validation (ensure required fields are present)
        if (!bankBin || !bankAccountNumber || !bankAccountName || !bankName) {
            return res.status(400).json({ error: 'Missing required bank information (BIN, Account Number, Account Name, Bank Name)' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userData.id,
            {
                bankName,
                bankAccountName,
                bankAccountNumber,
                bankBin,
                bankBranch: bankBranch || null // Use null if branch is empty
            },
            { new: true } // Return the updated document
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Bank information updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating bank info:', error);
        res.status(500).json({ error: 'Internal server error while updating bank info' });
    }
});

apiRouter.get('/places', async (req,res) => {
    res.json(await Place.find());
});

apiRouter.post('/upload-by-link',async (req,res)=>{
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await  imageDownloader.image({
        url:link,
        dest:__dirname + '/uploads/' + newName,
    });
    res.json(newName);    
});

apiRouter.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    process.stdout.write('[API] STDOUT Write Test - /upload received\n');
    console.error('[API /upload] Request received.');
    const uploadedFiles = [];
    for(let i = 0; i < req.files.length; i++){
        const {path: tempPath, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        // Tạo tên file duy nhất bằng cách thêm timestamp và số random
        const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
        const newFilename = uniqueId + '.' + ext;
        const newPath = __dirname + '/uploads/' + newFilename;
        
        try {
            fs.renameSync(tempPath, newPath);
            uploadedFiles.push(newFilename);
        } catch (renameError) {
            console.error('[API /upload] Error renaming file:', renameError);
        }
    }
    console.error('[API /upload] Generated filenames:', uploadedFiles);
    res.json(uploadedFiles);
});

apiRouter.post('/places', (req, res) => {
    console.error('[API POST /places] Request received. Body:', JSON.stringify(req.body)); // Log toàn bộ body
    const { token } = req.cookies;
    const {
        title, address, 
        photos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price, structure, privacyType,
        floorPlan, standOut, amenities, bookingSettings, guestType,
        discount, security
    } = req.body; 
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) {
            console.error('[API POST /places] JWT Error:', err);
            return res.status(401).json('JWT Error');
        };
        
        // KHÔI PHỤC LẠI CÁC TRƯỜNG ĐẦY ĐỦ
        const placeDataToCreate = {
            owner: userData.id,
            photos, // Giữ lại owner và photos
            title, address, // <--- Khôi phục
            description, perks, extraInfo, checkIn, checkOut, // <--- Khôi phục
            maxGuests, price, structure, privacyType, floorPlan, // <--- Khôi phục
            standOut, amenities, bookingSettings, guestType, // <--- Khôi phục
            discount, security, // <--- Khôi phục
             draft: false // Vẫn giữ draft: false
        };

        try {
            // Thử nghiệm: Tạo instance và gọi save() thay vì dùng create()
            const newPlace = new Place(placeDataToCreate);
            const placeDoc = await newPlace.save();
            
            console.error('[API POST /places] Place created successfully. ID:', placeDoc._id);
            res.json(placeDoc);
        } catch (createError) {
             console.error('[API POST /places] Error during Place.create:', createError);
             res.status(500).json({ error: 'Failed to create place', details: createError });
        }
    });
});

apiRouter.get('/user-places', async (req,res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json([]);
        }
        const places = await Place.find({ owner: userData.id });
        res.json(places);
    } catch (error) {
        console.error('Error fetching user places:', error);
        res.status(500).json([]);
    }
});

apiRouter.get('/places/:id',async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});

apiRouter.put('/places',async (req,res)=>{   
    const {token} = req.cookies;
    const {
        id, title, address, addedPhotos, description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price, structure, privacyType,
        floorPlan, standOut, amenities, bookingSettings, guestType,
        discount, security
    } = req.body;
    
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests,
                price, structure, privacyType, floorPlan, standOut,
                amenities, bookingSettings, guestType, discount,
                security
            });
            await placeDoc.save();
            res.json('ok')
             }
         });
     });

// --- Place Form Draft Routes --- 

// GET draft data
apiRouter.get('/places-form-data', async (req, res) => {
    console.log('[API GET /places-form-data] Request received.');
            const userData = await getUserDataFromReq(req);
            if (!userData) {
        console.log('[API GET /places-form-data] Unauthorized - No user data from token.');
        return res.status(401).json(null);
    }
    try {
        const user = await User.findById(userData.id);
        if (!user) {
             console.log('[API GET /places-form-data] User not found in DB for ID:', userData.id);
             return res.status(404).json({ error: 'User not found' });
        }
        console.log('[API GET /places-form-data] Sending draft data:', user.placeDraft || {});
        res.json(user.placeDraft || {}); // Trả về draft hoặc object rỗng
    } catch (error) {
        console.error('[API GET /places-form-data] Error:', error);
        res.status(500).json({ error: 'Failed to get draft data' });
    }
});

// PUT (Update) draft data
apiRouter.put('/places-form-data', async (req, res) => {
    console.log('[API PUT /places-form-data] Request received. Body:', req.body);
    const userData = await getUserDataFromReq(req);
    if (!userData) {
        console.log('[API PUT /places-form-data] Unauthorized - No user data from token.');
        return res.status(401).json(null);
    }
    try {
        const user = await User.findById(userData.id);
        if (!user) {
            console.log('[API PUT /places-form-data] User not found in DB for ID:', userData.id);
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize placeDraft if it doesn't exist
        if (!user.placeDraft) {
            user.placeDraft = {};
        }

        // Special handling for photos array
        if (req.body.photos) {
            user.placeDraft.photos = req.body.photos;
        }

        // Merge other data
        const updatedDraft = {
            ...user.placeDraft,
            ...req.body
        };

        // Ensure nested objects are merged correctly
        if (req.body.discount && typeof req.body.discount === 'object') {
            updatedDraft.discount = { ...(user.placeDraft.discount || {}), ...req.body.discount };
        }
        if (req.body.security && typeof req.body.security === 'object') {
            updatedDraft.security = { ...(user.placeDraft.security || {}), ...req.body.security };
        }
        if (req.body.bookingSettings && typeof req.body.bookingSettings === 'object') {
            updatedDraft.bookingSettings = { ...(user.placeDraft.bookingSettings || {}), ...req.body.bookingSettings };
        }

        // Save the updated draft
        user.placeDraft = updatedDraft;
        await user.save();

        // Log the saved data
        console.log('[API PUT /places-form-data] Draft data updated successfully:', user.placeDraft);
        
        // Return the complete draft data
        res.json(user.placeDraft);
    } catch (error) {
        console.error("[API PUT /places-form-data] Error updating draft data:", error);
        res.status(500).json({ error: 'Failed to update draft data' });
    }
});

// DELETE draft data
apiRouter.delete('/places-form-data', async (req, res) => {
     console.log('[API DELETE /places-form-data] Request received.');
        const userData = await getUserDataFromReq(req);
        if (!userData) {
        console.log('[API DELETE /places-form-data] Unauthorized - No user data from token.');
        return res.status(401).json(null);
     }
     try {
        // Use findByIdAndUpdate with $unset to remove the field
        const updatedUser = await User.findByIdAndUpdate(userData.id, { $unset: { placeDraft: "" } }, { new: true }); 
        if (!updatedUser) {
             console.log('[API DELETE /places-form-data] User not found for delete operation.');
             return res.status(404).json({ error: 'User not found' });
        }
        console.log('[API DELETE /places-form-data] Draft data deleted successfully.');
        res.json({ message: 'Draft data deleted' });
    } catch (error) {
        console.error("[API DELETE /places-form-data] Error deleting draft data:", error);
        res.status(500).json({ error: 'Failed to delete draft data' });
    }
});

// Mount routes
app.use('/api', apiRouter);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/places', placesRoutes);

// Thêm error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ 
        error: 'Có lỗi xảy ra',
        message: err.message 
    });
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
