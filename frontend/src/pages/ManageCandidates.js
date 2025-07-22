import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ManageCandidates = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '' });

  useEffect(() => {
    fetchElectionAndCandidates();
  }, [electionId]);

  const fetchElectionAndCandidates = async () => {
    setLoading(true);
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/elections/${electionId}`),
        axios.get(`http://localhost:5000/api/candidates`)
      ]);
      setElection(electionRes.data);
      const electionCandidates = candidatesRes.data.filter(c => {
        const candidateElectionId =
          typeof c.election === 'object' && c.election !== null
            ? c.election._id
            : c.election;
        return String(candidateElectionId) === String(electionId);
      });
      setCandidates(electionCandidates);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/candidates', {
        ...formData,
        election: electionId
      });
      setShowForm(false);
      setFormData({ name: '', bio: '' });
      fetchElectionAndCandidates();
    } catch (err) {
      setError('Failed to add candidate');
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditCandidate(candidate);
    setFormData({ name: candidate.name, bio: candidate.bio });
    setShowForm(true);
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/candidates/${editCandidate._id}`, {
        ...formData,
        election: electionId
      });
      setEditCandidate(null);
      setShowForm(false);
      setFormData({ name: '', bio: '' });
      fetchElectionAndCandidates();
    } catch (err) {
      setError('Failed to update candidate');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await axios.delete(`http://localhost:5000/api/candidates/${candidateId}`);
        fetchElectionAndCandidates();
      } catch (err) {
        setError('Failed to delete candidate');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FaArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold mb-2">Manage Candidates for: {election?.title}</h1>
        <p className="mb-6 text-gray-600">Add, edit, or remove candidates for this election.</p>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        <button
          onClick={() => { setShowForm(true); setEditCandidate(null); setFormData({ name: '', bio: '' }); }}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Candidate
        </button>

        {/* Candidate Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">{editCandidate ? 'Edit Candidate' : 'Add Candidate'}</h3>
              <form onSubmit={editCandidate ? handleUpdateCandidate : handleAddCandidate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    {editCandidate ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditCandidate(null); }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Candidates List */}
        <div className="glass bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-gray-800/80 dark:to-indigo-900/60 rounded-lg shadow-md p-4 md:p-6 mt-4 border border-white/30 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Candidates</h2>
          {candidates.length === 0 ? (
            <div className="text-gray-500">No candidates added yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {candidates.map(candidate => (
                <li key={candidate._id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-gray-600 text-sm">{candidate.bio}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCandidate(candidate)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(candidate._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCandidates; 