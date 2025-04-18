const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new mongoose.Schema({
 name: String,
 email: {type: String, unique: true},
 password: String,
 avatar: String,
 phone: { type: String, default: null },
 isKycVerified: { type: Boolean, default: false },
 isAdmin: { type: Boolean, default: false },
 // Bank Info - Added for VietQR payment
 bankName: { type: String, default: null }, // e.g., Vietcombank
 bankAccountName: { type: String, default: null }, // Account Holder Name
 bankAccountNumber: { type: String, default: null }, // Account Number
 bankBin: { type: String, default: null }, // Bank BIN (Required for VietQR) - e.g., 970436 for VCB
 bankBranch: { type: String, default: null }, // Optional: Bank Branch
 placeDraft: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// Prevent OverwriteModelError by checking if model exists
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
