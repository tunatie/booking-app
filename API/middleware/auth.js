const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Optional: To check if user still exists
require('dotenv').config(); // To access JWT_SECRET from .env

const jwtSecret = process.env.JWT_SECRET || 'asdasdc3dcsxsdasda'; // Use environment variable or default

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token; // Get token from cookie

    if (!token) {
        return res.status(401).json({ message: 'Không tìm thấy token, vui lòng đăng nhập lại.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);

        // Kiểm tra user trong database
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User not found');
        }

        // Attach user info to the request object
        req.user = user;
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Authentication error:', error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.clearCookie('token'); // Clear invalid/expired token
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại.' });
        }
        res.status(500).json({ message: 'Lỗi xác thực người dùng.' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
        }
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ message: 'Lỗi kiểm tra quyền admin.' });
    }
};

module.exports = {
    verifyToken,
    isAdmin
}; 