const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
router.use('/auth', require('./auth'));

// Elections routes
router.use('/elections', require('./elections'));

// Candidates routes
router.use('/candidates', require('./candidates'));

// Vote route
router.use('/vote', require('./vote'));

// Results routes
router.use('/results', require('./results'));

// Reports routes
router.use('/reports', require('./reports'));

module.exports = router; 