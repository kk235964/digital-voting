import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaChartBar, FaUser, FaVoteYea, FaClock } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';

const AnimatedNumber = ({ value, className }) => {
  const controls = useAnimation();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    controls.start({ val: value });
  }, [value, controls]);
  return (
    <motion.span
      className={className}
      animate={controls}
      initial={{ val: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onUpdate={latest => setDisplay(Math.round(latest.val))}
    >
      {display}
    </motion.span>
  );
};

const AnimatedProgressBar = ({ percentage, isLeading }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
    <motion.div
      className={`h-3 rounded-full transition-all duration-500 ${isLeading ? 'bg-green-500' : 'bg-blue-500'}`}
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 1 }}
    />
  </div>
);

const Results = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchResults = useCallback(async () => {
    try {
      const [electionResponse, resultsResponse] = await Promise.all([
        axios.get(`${API_URL}/elections/${electionId}`),
        axios.get(`${API_URL}/results/${electionId}`)
      ]);
      setElection(electionResponse.data);
      setResults(resultsResponse.data.candidates || []);
    } catch (err) {
      setError('Failed to fetch results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  }, [electionId, API_URL]);

  useEffect(() => {
    fetchResults();
  }, [electionId, fetchResults]);

  const calculateTotalVotes = () => {
    return results.reduce((total, candidate) => total + candidate.votes, 0);
  };

  const calculatePercentage = (votes) => {
    const total = calculateTotalVotes();
    return total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
  };

  const getWinner = () => {
    if (results.length === 0) return null;
    return results.reduce((winner, candidate) => 
      candidate.votes > winner.votes ? candidate : winner
    );
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

  const isElectionActive = () => {
    if (!election) return false;
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    return now >= startDate && now <= endDate;
  };

  const isElectionEnded = () => {
    if (!election) return false;
    const now = new Date();
    const endDate = new Date(election.endDate);
    return now > endDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
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
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalVotes = calculateTotalVotes();
  const winner = getWinner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
            <p className="text-gray-600 mb-4">{election.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <FaClock className="h-4 w-4 mr-2" />
                <span>Start: {formatDate(election.startDate)}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="h-4 w-4 mr-2" />
                <span>End: {formatDate(election.endDate)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              {isElectionActive() && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <FaClock className="h-4 w-4 mr-1" />
                  Active
                </span>
              )}
              {isElectionEnded() && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <FaChartBar className="h-4 w-4 mr-1" />
                  Final Results
                </span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Results Summary */}
        <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md p-4 md:p-6 mb-6 border border-white/30 dark:border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <AnimatedNumber value={totalVotes} className="text-3xl font-bold text-blue-600" />
              <div className="text-gray-600 dark:text-gray-200">Total Votes</div>
            </div>
            <div>
              <AnimatedNumber value={results.length} className="text-3xl font-bold text-green-600" />
              <div className="text-gray-600 dark:text-gray-200">Candidates</div>
            </div>
            {winner && (
              <div>
                <AnimatedNumber value={winner.votes} className="text-3xl font-bold text-purple-600" />
                <div className="text-gray-600 dark:text-gray-200">Leading Votes</div>
              </div>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md p-4 md:p-6 border border-white/30 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Election Results</h2>
          
          {results.length === 0 ? (
            <div className="text-center py-8">
              <FaUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
              <p className="text-gray-600">No votes have been cast yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((candidate, index) => {
                const percentage = calculatePercentage(candidate.votes);
                const isLeading = winner && candidate._id === winner._id;
                
                return (
                  <div
                    key={candidate._id}
                    className={`border-2 rounded-lg p-4 ${
                      isLeading ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isLeading 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {candidate.name}
                            {isLeading && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                                <FaVoteYea className="h-3 w-3 mr-1" />
                                Leading
                              </span>
                            )}
                          </h3>
                          {candidate.bio && (
                            <p className="text-gray-600 dark:text-gray-200 text-sm">{candidate.bio}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {candidate.votes}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-200">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <AnimatedProgressBar percentage={percentage} isLeading={isLeading} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Additional Info */}
        {isElectionActive() && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaClock className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Live Results
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Results are being updated in real-time as votes are cast.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results; 