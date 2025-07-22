import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaVoteYea, FaUser, FaClock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Confetti from 'react-confetti';
import AnimatedButton from '../components/AnimatedButton';

const VotingPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const API_URL = 'https://digital-voting-1.onrender.com/api/';

  const fetchElectionData = useCallback(async () => {
    try {
      const [electionResponse, candidatesResponse] = await Promise.all([
        axios.get(`${API_URL}/elections/${electionId}`),
        axios.get(`${API_URL}/candidates`)
      ]);
      setElection(electionResponse.data);
      const electionCandidates = candidatesResponse.data.filter(c => {
        const candidateElectionId =
          typeof c.election === 'object' && c.election !== null
            ? c.election._id
            : c.election;
        return String(candidateElectionId) === String(electionId);
      });
      setCandidates(electionCandidates);
    } catch (err) {
      setError('Failed to fetch election data');
      console.error('Error fetching election data:', err);
    } finally {
      setLoading(false);
    }
  }, [electionId, API_URL]);

  useEffect(() => {
    fetchElectionData();
  }, [electionId, fetchElectionData]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to vote for');
      return;
    }

    setVoting(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/vote', {
        electionId,
        candidateId: selectedCandidate
      });
      
      setSuccess('Your vote has been cast successfully!');
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/voter-dashboard');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
      console.error('Error casting vote:', err);
    } finally {
      setVoting(false);
    }
  };

  const isElectionActive = () => {
    if (!election) return false;
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    return now >= startDate && now <= endDate;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election...</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Not Found</h2>
          <p className="text-gray-600 mb-4">The election you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/voter-dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isElectionActive()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Not Active</h2>
          <p className="text-gray-600 mb-4">
            This election is not currently active for voting.
          </p>
          <button
            onClick={() => navigate('/voter-dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-indigo-900">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} />} 
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/voter-dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md p-4 md:p-6 border border-white/30 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
            <p className="text-gray-600 mb-4">{election.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FaClock className="h-4 w-4 mr-2" />
                <span>Start: {formatDate(election.startDate)}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="h-4 w-4 mr-2" />
                <span>End: {formatDate(election.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* Candidates */}
        <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Candidate</h2>
          
          {candidates.length === 0 ? (
            <div className="text-center py-8">
              <FaUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Candidates Available</h3>
              <p className="text-gray-600">There are no candidates for this election yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCandidate === candidate._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCandidate(candidate._id)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-4 ${
                      selectedCandidate === candidate._id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedCandidate === candidate._id && (
                        <FaCheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.name}
                      </h3>
                      {candidate.bio && (
                        <p className="text-gray-600 mt-1">{candidate.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vote Button */}
          {candidates.length > 0 && (
            <div className="mt-8">
              <AnimatedButton
                onClick={handleVote}
                disabled={!selectedCandidate || voting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-md font-semibold text-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
              >
                {voting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Casting Vote...
                  </>
                ) : (
                  <>
                    <FaVoteYea className="h-5 w-5 mr-2" />
                    Cast Your Vote
                  </>
                )}
              </AnimatedButton>
              
              {!selectedCandidate && (
                <p className="text-center text-gray-500 mt-2">
                  Please select a candidate to cast your vote
                </p>
              )}
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaVoteYea className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>• You can only vote once per election</p>
                <p>• Your vote is anonymous and secure</p>
                <p>• You cannot change your vote after submission</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage; 