import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload, 
  FaUsers, 
  FaChartBar,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editElection, setEditElection] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  }, []);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/elections`, formData);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', startDate: '', endDate: '' });
      fetchElections();
    } catch (err) {
      setError('Failed to create election');
      console.error('Error creating election:', err);
    }
  };

  const handleDeleteElection = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        await axios.delete(`${API_URL}/elections/${electionId}`);
        fetchElections();
      } catch (err) {
        setError('Failed to delete election');
        console.error('Error deleting election:', err);
      }
    }
  };

  const handleEditElection = (election) => {
    setEditElection(election);
    setFormData({
      title: election.title,
      description: election.description,
      startDate: election.startDate ? election.startDate.slice(0, 16) : '',
      endDate: election.endDate ? election.endDate.slice(0, 16) : ''
    });
    setShowEditForm(true);
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/elections/${editElection._id}`, formData);
      setShowEditForm(false);
      setEditElection(null);
      setFormData({ title: '', description: '', startDate: '', endDate: '' });
      fetchElections();
    } catch (err) {
      setError('Failed to update election');
    }
  };

  const downloadCSV = async (electionId, electionTitle) => {
    try {
      const response = await axios.get(`${API_URL}/reports/${electionId}/csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${electionTitle}-results.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download report');
      console.error('Error downloading report:', err);
    }
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-200 text-sm sm:text-base">
                Manage elections, candidates, and view results
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mt-4 md:mt-0"
            >
              <FaPlus className="h-4 w-4" />
              <span>Create Election</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Create Election Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Election</h3>
              <form onSubmit={handleCreateElection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Election Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Election</h3>
              <form onSubmit={handleUpdateElection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEditForm(false); setEditElection(null); }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Elections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {elections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FaChartBar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Elections Created</h3>
              <p className="text-gray-600">Create your first election to get started.</p>
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

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Link
                      to={`/admin/elections/${election._id}/candidates`}
                      className="bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                    >
                      <FaUsers className="h-4 w-4 inline mr-1" />
                      Manage Candidates
                    </Link>
                    <Link
                      to={`/results/${election._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                    >
                      <FaEye className="h-4 w-4 inline mr-1" />
                      View Results
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => downloadCSV(election._id, election.title)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                      title="Download CSV Report"
                    >
                      <FaDownload className="h-4 w-4 inline" />
                    </button>
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                      title="Edit Election"
                      onClick={() => handleEditElection(election)}
                    >
                      <FaEdit className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteElection(election._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                      title="Delete Election"
                    >
                      <FaTrash className="h-4 w-4 inline" />
                    </button>
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

export default AdminDashboard; 