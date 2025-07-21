const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

exports.getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const candidates = await Candidate.find({ election: electionId })
      .select('name bio votes')
      .sort({ votes: -1 });
    res.json({ election: election.title, candidates });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 