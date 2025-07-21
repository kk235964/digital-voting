const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const resultsController = require('../controllers/resultsController');

// Get results for an election
router.get('/:electionId', auth, resultsController.getElectionResults);

module.exports = router; 