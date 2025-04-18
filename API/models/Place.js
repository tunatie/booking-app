const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlaceSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: String,
    checkOut: String,
    maxGuests: Number,
    price: Number,
    draft: {type: Boolean, default: false},
    
    // Thông tin cơ bản
    placeType: String,          // Loại nơi ở (nhà, căn hộ, etc.)
    propertyType: String,       // Loại bất động sản
    privacyType: String,        // Kiểu riêng tư
    location: {                 // Vị trí chi tiết
        country: String,
        street: String,
        city: String,
        state: String,
        postalCode: String
    },

    // Thông tin chi tiết
    floorPlan: {               // Sơ đồ
        guests: Number,
        bedrooms: Number,
        beds: Number,
        bathrooms: Number
    },
    amenities: [String],       // Tiện nghi
    standOut: [String],        // Điểm nổi bật

    // Thông tin đặt phòng
    guestType: String,         // Loại khách
    discounts: {               // Giảm giá
        weekly: Number,
        monthly: Number
    },
    security: {                // Bảo mật
        hasCamera: Boolean,
        hasNoiseDetector: Boolean,
        hasWeapon: Boolean
    }
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel; 