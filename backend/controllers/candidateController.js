const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

exports.createCandidate = async (req, res) => {
  try {
    const { name, bio, election } = req.body;
    // Ensure election exists
    const foundElection = await Election.findById(election);
    if (!foundElection) return res.status(404).json({ message: 'Election not found' });
    const candidate = new Candidate({ name, bio, election });
    await candidate.save();
    // Optionally add candidate to election's candidates array
    foundElection.candidates.push(candidate._id);
    await foundElection.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('election', 'title');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('election', 'title');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    // Optionally remove candidate from election's candidates array
    await Election.findByIdAndUpdate(candidate.election, { $pull: { candidates: candidate._id } });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 