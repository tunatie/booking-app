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
    credentials:true,
    origin:'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies.token; // Lấy token từ cookies
        if (!token) return reject(new Error('No token provided'));

        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) return reject(err);
            resolve(userData); // Trả về thông tin người dùng
        });
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
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,
                }, 
                jwtSecret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json(userDoc);
            });
        } else {
            res.status(422).json('password not ok');
        }
    } else {
        res.status(400).json('user not found');
    }
});

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    if (token){
        jwt.verify(token,jwtSecret,{}, async (err,userData)=>{
        if(err) throw err;
        const {name,email,_id} = await User.findById(userData.id);
        res.json({name,email,_id});
        
    });
    } else {
        res.json(null);
    }
});
app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
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
    const uploadedFiles = [];
    for(let i =0; i < req.files.length; i++){
        const {path,originalname} = req.files[i];     
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads',''));
    }
    res.json(uploadedFiles);
});
app.post('/places',(req,res)=>{
    const {token} = req.cookies;
    const {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body; 
    jwt.verify(token,jwtSecret,{}, async (err,userData)=>{
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        });
        res.json(placeDoc);
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
app.get('/user-places',async (req,res)=>{
   const {token} = req.cookies;
   jwt.verify(token,jwtSecret,{},async (err,userData)=>{
    const {id} = userData;
    res.json(await Place.find({owner:id}));
   });
});

app.get('/places/:id',async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});
app.put('/places',async (req,res)=>{   
    const {token} = req.cookies;
    const {
        id, title,address,addedPhotos,description,
        perks,extraInfo,checkIn,
        checkOut,maxGuests,price  } = req.body;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()){
        placeDoc.set({title,address,photos:addedPhotos,description,
            perks,extraInfo,checkIn,
            checkOut,maxGuests,price
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
             const { place, checkIn, checkOut, name, phone, numberOfGuests, price, } = req.body;
             try {
                 const booking = await Booking.create({
                     place,
                     user:userData.id,
                     checkIn,
                     checkOut,
                     numberOfGuests,
                     name,
                     phone,
                     price,
                 });
                 res.json(booking);
             } catch (error) {
                 console.error('Error creating booking:', error);
                 res.status(500).json({ error: 'Failed to create booking' });
             }
         });
     });


     app.get('/bookings', async (req, res) => {
      
            const userData = await getUserDataFromReq(req); // Sử dụng hàm để lấy thông tin người dùng
            res.json(await Booking.find({ user: userData.id }).populate('place'));
        
    });
app.listen(4000)
