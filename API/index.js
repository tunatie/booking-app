console.log('[API] index.js starting...');
process.stdout.write('[API] STDOUT Write Test - Top of file\n');

const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const fs = require('fs');
const Booking = require('./models/Booking');
require('dotenv').config()
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asdasdc3dcsxsdasda';
const multer = require('multer');
const Place = require('./models/Place');




app.use(express.json())
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie', 'Date', 'ETag'],
    maxAge: 86400, // 24 hours in seconds
}));

mongoose.connect(process.env.MONGO_URL);
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

                try {
                    // Verify user still exists in database
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
app.get('/test',(req,res)=>{
    res.json('test ok');
});

app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    });

    res.json({userDoc});
});

app.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json('Email và mật khẩu không được để trống');
        }

        // Find user
        const userDoc = await User.findOne({email});
        console.log('Login attempt for email:', email);
        
        if (!userDoc) {
            console.log('User not found for email:', email);
            return res.status(400).json('Không tìm thấy tài khoản với email này');
        }

        // Check password
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            console.log('Invalid password for email:', email);
            return res.status(422).json('Mật khẩu không đúng');
        }

        // Generate token
        jwt.sign({
            email: userDoc.email,
            id: userDoc._id
        }, jwtSecret, {}, (err,token) => {
            if (err) {
                console.error('JWT sign error:', err);
                return res.status(500).json('Lỗi tạo token');
            }

            // Set cookie with better configuration
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                path: '/'
            }).json(userDoc);
            
            console.log('Login successful for email:', email);
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json('Có lỗi xảy ra khi đăng nhập');
    }
});

app.get('/profile', async (req,res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json(null);
        }

        const user = await User.findById(userData.id).select('name email _id');
        if (!user) {
            return res.status(401).json(null);
        }

        res.json(user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json(null);
    }
});
app.post('/logout',(req,res)=>{
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0)
    }).json(true);
});
console.log(__dirname);
app.post('/upload-by-link',async (req,res)=>{
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await  imageDownloader.image({
        url:link,
        dest:__dirname + '/uploads/' + newName,
    });
    res.json(newName);    
});

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    process.stdout.write('[API] STDOUT Write Test - /upload received\n');
    console.error('[API /upload] Request received.');
    const uploadedFiles = [];
    for(let i =0; i < req.files.length; i++){
        const {path: tempPath, originalname} = req.files[i]; // Đổi tên `path` thành `tempPath` để tránh nhầm lẫn    
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newFilename = Date.now() + '.' + ext; // Tạo tên file duy nhất
        const newPath = __dirname + '/uploads/' + newFilename; // Đường dẫn đầy đủ mới
        
        try {
             fs.renameSync(tempPath, newPath); // Đổi tên file
             uploadedFiles.push(newFilename); // Chỉ lưu tên file mới vào mảng
        } catch (renameError) {
            console.error('[API /upload] Error renaming file:', renameError);
            // Có thể không thêm file này vào uploadedFiles hoặc trả về lỗi
        }
    }
    console.error('[API /upload] Generated filenames:', uploadedFiles);
    res.json(uploadedFiles);
});
app.post('/places', (req, res) => {
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
app.get('/places', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});
app.get('/user-places', async (req, res) => {
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

app.get('/places/:id',async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});
app.put('/places',async (req,res)=>{   
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
     app.post('/bookings', async (req, res) => {
        const userData = await getUserDataFromReq(req);
         const { token } = req.cookies;
         jwt.verify(token, jwtSecret, {}, async (err, userData) => {
             if (err) return res.status(401).json({ error: 'Unauthorized' });
             const { place, checkIn, checkOut, name, phone, numberOfGuests, price } = req.body;
             try {
                 const booking = await Booking.create({
                     place,
                     user: userData.id,
                     checkIn,
                     checkOut,
                     numberOfGuests,
                     name,
                     phone,
                     price,
                     status: 'pending'
                 });
                 res.json(booking);
             } catch (error) {
                 console.error('Error creating booking:', error);
                 res.status(500).json({ error: 'Failed to create booking' });
             }
         });
     });


     app.get('/bookings', async (req, res) => {
        try {
            const userData = await getUserDataFromReq(req);
            if (!userData) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const bookings = await Booking.find({ user: userData.id })
                .populate('place')
                .sort('-createdAt');

            const formattedBookings = bookings.map(booking => {
                const bookingObj = booking.toObject();
                return {
                    ...bookingObj,
                    checkIn: booking.checkIn?.toISOString(),
                    checkOut: booking.checkOut?.toISOString(),
                    createdAt: booking.createdAt?.toISOString(),
                    updatedAt: booking.updatedAt?.toISOString()
                };
            });

            res.json(formattedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Failed to fetch bookings' });
        }
    });

app.get('/places-form-data', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userData = await getUserDataFromReq(req);
        let formData = await Place.findOne({ 
            owner: userData.id,
            draft: true
        }).sort({ createdAt: -1 });

        if (!formData) {
            // Create a new draft place if none exists
            formData = await Place.create({
                owner: userData.id,
                draft: true,
                photos: [],
                title: '',
                description: '',
                price: 0,
                structure: '',
                privacyType: '',
                floorPlan: '',
                standOut: [],
                amenities: [],
                bookingSettings: {
                    minNights: 1,
                    maxNights: 30,
                    advanceNotice: 1
                },
                guestType: '',
                discount: {
                    weekly: 0,
                    monthly: 0
                },
                security: {
                    deposit: 0,
                    rules: []
                }
            });
        }

        res.json(formData);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ error: 'Failed to fetch form data' });
    }
});

app.put('/places-form-data', async (req, res) => {
    process.stdout.write('[API] STDOUT Write Test - PUT /places-form-data received\n');
    console.error('[API PUT /places-form-data] Request received.');
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userData = await getUserDataFromReq(req);
        let formData = await Place.findOne({ 
            owner: userData.id,
            draft: true
        }).sort({ createdAt: -1 });

        const updateData = req.body; 

        if (!formData) {
            formData = await Place.create({
                owner: userData.id,
                draft: true,
                // Đặt giá trị mặc định cho tất cả các trường
                title: '', description: '', address: '', photos: [], perks: [], extraInfo: '',
                checkIn: '', checkOut: '', maxGuests: 1, price: 0, structure: '', privacyType: '',
                floorPlan: '', standOut: [], amenities: [],
                bookingSettings: { bookingType: 'review', minNights: 1, maxNights: 30, advanceNotice: 1 },
                guestType: 'any',
                discount: { newListing: 0, weekly: 0, monthly: 0 },
                security: { hasCamera: false, hasNoiseDetector: false, hasWeapon: false, deposit: 0, rules: [] },
                // Sau đó ghi đè bằng updateData
                ...updateData 
            });
        } else {
            // Cập nhật tường minh, cải thiện xử lý nested objects
            for (const key in updateData) {
                if (Place.schema.path(key)) {
                    // Nếu cả giá trị mới và cũ đều là object (không phải array) thì merge
                    if (
                        typeof updateData[key] === 'object' && !Array.isArray(updateData[key]) && updateData[key] !== null &&
                        typeof formData[key] === 'object' && !Array.isArray(formData[key]) && formData[key] !== null
                    ) {
                        Object.assign(formData[key], updateData[key]);
                    } else {
                        // Ngược lại, gán trực tiếp (bao gồm cả array, primitives, hoặc khi kiểu không khớp)
                        formData[key] = updateData[key];
                    }
                } else {
                    // Kiểm tra xem có phải là path lồng nhau hợp lệ không (ví dụ: 'discount.weekly')
                    // Cách đơn giản hơn: Bỏ qua kiểm tra schema ở đây và dựa vào validation của Mongoose khi save
                    // Tuy nhiên, để an toàn hơn, chúng ta sẽ chỉ cập nhật các key đã biết hoặc key lồng trong các object đã biết
                    const topLevelKey = key.split('.')[0];
                    if (Place.schema.path(topLevelKey) && typeof formData[topLevelKey] === 'object') {
                         // Thử cập nhật path lồng nhau - Mongoose có thể xử lý được điều này
                         // Lưu ý: Cách này có thể không hoạt động hoàn hảo cho mọi trường hợp phức tạp
                         // Một cách tiếp cận khác là dùng $set trong findByIdAndUpdate
                         try {
                            // Dùng lodash.set hoặc một hàm tương tự sẽ an toàn hơn
                            // Tạm thời gán trực tiếp nếu là key đơn giản trong object đã biết
                            if (!key.includes('.')) { // Chỉ gán nếu là key trực tiếp của formData
                                 formData[key] = updateData[key];
                            } else {
                                console.warn(`[API PUT /places-form-data] Skipping potentially nested key update: ${key}`);
                            }
                         } catch (e) {
                            console.warn(`[API PUT /places-form-data] Error trying to set nested key ${key}:`, e);
                         }
                    } else {
                        console.warn(`[API PUT /places-form-data] Ignoring invalid or unhandled key: ${key}`);
                    }
                }
            }

            // Thêm { optimisticConcurrency: false } để tránh VersionError cho bản nháp
            await formData.save({ optimisticConcurrency: false }); 
        }

        res.json(formData);
    } catch (error) {
        console.error('Error updating form data:', error);
        if (error.name === 'ValidationError') {
             res.status(400).json({ error: 'Validation Error', details: error.errors });
        } else {
             res.status(500).json({ error: 'Failed to update form data' });
        }
    }
});

// Delete draft place
app.delete('/places-form-data', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userData = await getUserDataFromReq(req);
        await Place.deleteOne({ 
            owner: userData.id,
            draft: true
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting draft place:', error);
        res.status(500).json({ error: 'Failed to delete draft place' });
    }
});

// API endpoint để xem dữ liệu Place
app.get('/debug/places', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

app.delete('/bookings/:id', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if the user is the owner of the booking
        if (booking.user.toString() !== userData.id) {
            return res.status(403).json({ error: 'Not authorized to cancel this booking' });
        }

        // Check if the booking can be cancelled (e.g., not too close to check-in date)
        const checkInDate = new Date(booking.checkIn);
        const now = new Date();
        const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilCheckIn < 1) {
            return res.status(400).json({ error: 'Cannot cancel booking less than 24 hours before check-in' });
        }

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Get single booking
app.get('/bookings/:id', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id)
            .populate('place');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if the user owns this booking
        if (booking.user.toString() !== userData.id) {
            return res.status(403).json({ error: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Update booking status
app.put('/bookings/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();
        
        res.json(booking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

app.listen(4000);
