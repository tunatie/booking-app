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
    
    // Các trường mới
    structure: String,           // Loại chỗ ở
    privacyType: String,         // Kiểu riêng tư
    floorPlan: String,           // Sơ đồ tầng
    standOut: [String],          // Điểm nổi bật
    amenities: [String],         // Tiện ích
    bookingSettings: {           // Cài đặt đặt phòng
        minNights: Number,
        maxNights: Number,
        advanceNotice: Number
    },
    guestType: String,           // Loại khách
    discount: {                  // Giảm giá
        weekly: Number,
        monthly: Number
    },
    security: {                  // Bảo mật
        deposit: Number,
        rules: [String]
    }
});

const PlaceModel = mongoose.model('Place',PlaceSchema);

module.exports = PlaceModel; 