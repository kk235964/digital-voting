const { Parser } = require('json2csv');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

exports.downloadElectionResultsCSV = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    
    const candidates = await Candidate.find({ election: electionId })
      .select('name bio votes')
      .sort({ votes: -1 });
    
    // Prepare data for CSV
    const csvData = candidates.map(candidate => ({
      'Candidate Name': candidate.name,
      'Bio': candidate.bio || '',
      'Votes': candidate.votes,
      'Percentage': candidates.length > 0 ? ((candidate.votes / candidates.reduce((sum, c) => sum + c.votes, 0)) * 100).toFixed(2) + '%' : '0%'
    }));
    
    // Add election info
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    csvData.unshift({
      'Candidate Name': `Election: ${election.title}`,
      'Bio': `Total Votes: ${totalVotes}`,
      'Votes': '',
      'Percentage': ''
    });
    
    const parser = new Parser();
    const csv = parser.parse(csvData);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${election.title}-results.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 