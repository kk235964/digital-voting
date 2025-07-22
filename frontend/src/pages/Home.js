import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaVoteYea, FaShieldAlt, FaChartBar, FaUsers } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-10 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Secure Digital Voting Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto">
            Experience transparent, secure, and efficient voting with our blockchain-inspired 
            digital voting system. Your vote matters, and we ensure it's protected.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === 'admin' ? (
                <Link
                  to="/admin-dashboard"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/voter-dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Vote Now
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12">
          Why Choose Our Platform?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaShieldAlt className="h-12 w-12 text-blue-600 dark:text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-200">
              Your vote is encrypted and your identity is protected. 
              No one can see who you voted for.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaVoteYea className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">One Vote Per Person</h3>
            <p className="text-gray-600">
              Advanced verification ensures each person can only vote once 
              per election.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaChartBar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
            <p className="text-gray-600">
              View live election results and detailed analytics 
              as votes are cast.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FaUsers className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple, intuitive interface that works on any device. 
              Vote from anywhere, anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 ElectionVote. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 