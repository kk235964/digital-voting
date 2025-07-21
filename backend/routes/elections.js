const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const electionController = require('../controllers/electionController');

// Create election (admin only)
router.post('/', auth, role('admin'), electionController.createElection);

// Get all elections
router.get('/', auth, electionController.getAllElections);

// Get single election by ID
router.get('/:id', auth, electionController.getElectionById);

// Update election (admin only)
router.put('/:id', auth, role('admin'), electionController.updateElection);

// Delete election (admin only)
router.delete('/:id', auth, role('admin'), electionController.deleteElection);

module.exports = router; 