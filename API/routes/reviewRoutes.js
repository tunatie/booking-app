const express = require('express');
const router = express.Router();

// Basic review routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all reviews' });
});

module.exports = router; 