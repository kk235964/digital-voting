const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const candidateController = require('../controllers/candidateController');

// Create candidate (admin only)
router.post('/', auth, role('admin'), candidateController.createCandidate);

// Get all candidates
router.get('/', auth, candidateController.getAllCandidates);

// Get single candidate by ID
router.get('/:id', auth, candidateController.getCandidateById);

// Update candidate (admin only)
router.put('/:id', auth, role('admin'), candidateController.updateCandidate);

// Delete candidate (admin only)
router.delete('/:id', auth, role('admin'), candidateController.deleteCandidate);

module.exports = router; 