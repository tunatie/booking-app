const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Changed from user to User
require('dotenv').config(); // To access JWT_SECRET from .env

const jwtSecret = process.env.JWT_SECRET || 'asdasdc3dcsxsdasda'; // Use environment variable or default

const verifyToken = async (req, res, next) => {
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