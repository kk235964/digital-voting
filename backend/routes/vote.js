const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const voteController = require('../controllers/voteController');

// Cast vote (voter only)
router.post('/', auth, voteController.castVote);

module.exports = router; 