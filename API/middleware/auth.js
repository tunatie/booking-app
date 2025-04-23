const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const User = require('../models/User'); // Changed from user to User
=======
const User = require('../models/user'); // Optional: To check if user still exists
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
require('dotenv').config(); // To access JWT_SECRET from .env

const jwtSecret = process.env.JWT_SECRET || 'asdasdc3dcsxsdasda'; // Use environment variable or default

const verifyToken = async (req, res, next) => {
<<<<<<< HEAD
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    };
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
=======
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
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
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