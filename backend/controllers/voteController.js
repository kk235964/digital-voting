const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

exports.castVote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { electionId, candidateId } = req.body;
    // Check if user is a voter
    if (req.user.role !== 'voter') {
      return res.status(403).json({ message: 'Only voters can vote.' });
    }
    // Check if user already voted in this election
    const user = await User.findById(userId);
    if (user.votedElections.includes(electionId)) {
      return res.status(400).json({ message: 'You have already voted in this election.' });
    }
    // Check if election and candidate exist
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: 'Election not found.' });
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
    // Check if candidate belongs to the election
    if (String(candidate.election) !== String(electionId)) {
      return res.status(400).json({ message: 'Candidate does not belong to this election.' });
    }
    // Increment candidate's vote count
    candidate.votes += 1;
    await candidate.save();
    // Mark user as voted in this election
    user.votedElections.push(electionId);
    await user.save();
    res.json({ message: 'Vote cast successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 