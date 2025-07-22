import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaChartBar, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-primary dark:bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaChartBar className="h-8 w-8" />
              <span className="text-xl font-bold">ElectionVote</span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun className="h-5 w-5 text-yellow-300" /> : <FaMoon className="h-5 w-5 text-blue-200" />}
            </button>
            {user ? (
              <>
                <span className="flex items-center space-x-2">
                  <FaUser className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <span className="bg-blue-500 px-2 py-1 rounded text-sm">
                    {user.role}
                  </span>
                </span>
                {user.role === 'admin' ? (
                  <Link 
                    to="/admin-dashboard"
                    className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/voter-dashboard"
                    className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Voter Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-green-500 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-primary dark:bg-gray-900 px-4 pb-4 pt-2 space-y-2 z-50">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun className="h-5 w-5 text-yellow-300" /> : <FaMoon className="h-5 w-5 text-blue-200" />}
            </button>
            {user && (
              <span className="flex items-center space-x-2">
                <FaUser className="h-4 w-4" />
                <span>{user.name}</span>
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">
                  {user.role}
                </span>
              </span>
            )}
          </div>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link 
                  to="/admin-dashboard"
                  className="block w-full bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link 
                  to="/voter-dashboard"
                  className="block w-full bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Voter Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full bg-red-500 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors mt-2"
              >
                <FaSignOutAlt className="h-4 w-4 mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="block w-full bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="block w-full bg-green-500 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 