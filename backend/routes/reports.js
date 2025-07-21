const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const reportController = require('../controllers/reportController');

// Download election results as CSV (admin only)
router.get('/:electionId/csv', auth, role('admin'), reportController.downloadElectionResultsCSV);

module.exports = router; 