import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaVoteYea, FaEye, FaClock, FaTimesCircle } from 'react-icons/fa';

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'https://digital-voting-2gdr.onrender.com/api/';

  const fetchElections = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data);
    } catch (err) {
      setError('Failed to fetch elections');
      console.error('Error fetching elections:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const isElectionActive = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    return now >= startDate && now <= endDate;
  };

  const isElectionUpcoming = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    return now < startDate;
  };

  const isElectionEnded = (election) => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    return now > endDate;
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
          <p className="mt-4 text-gray-600">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Voter Dashboard</h1>
          <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-200 text-sm sm:text-base">
            View and participate in available elections
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Elections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {elections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FaVoteYea className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Elections Available</h3>
              <p className="text-gray-600">There are currently no elections to vote in.</p>
            </div>
          ) : (
            elections.map((election) => (
              <div key={election._id} className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {election.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {isElectionActive(election) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaClock className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      )}
                      {isElectionUpcoming(election) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FaClock className="h-3 w-3 mr-1" />
                          Upcoming
                        </span>
                      )}
                      {isElectionEnded(election) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FaTimesCircle className="h-3 w-3 mr-1" />
                          Ended
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-200 mb-4 line-clamp-2">
                    {election.description || 'No description available'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="h-4 w-4 mr-2" />
                      <span>Start: {formatDate(election.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="h-4 w-4 mr-2" />
                      <span>End: {formatDate(election.endDate)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {isElectionActive(election) && (
                      <Link
                        to={`/vote/${election._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                      >
                        <FaVoteYea className="h-4 w-4 inline mr-2" />
                        Vote Now
                      </Link>
                    )}
                    
                    <Link
                      to={`/results/${election._id}`}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      <FaEye className="h-4 w-4 inline mr-2" />
                      View Results
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard; 