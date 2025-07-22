import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VoterDashboard from './pages/VoterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VotingPage from './pages/VotingPage';
import Results from './pages/Results';
import PrivateRoute from './components/PrivateRoute';
import ManageCandidates from './pages/ManageCandidates';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <Home />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <Register />
          </motion.div>
        } />
        <Route path="/voter-dashboard" element={
          <PrivateRoute role="voter">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <VoterDashboard />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/admin-dashboard" element={
          <PrivateRoute role="admin">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <AdminDashboard />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/vote/:electionId" element={
          <PrivateRoute role="voter">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <VotingPage />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/results/:electionId" element={
          <PrivateRoute>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <Results />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/admin/elections/:electionId/candidates" element={
          <PrivateRoute role="admin">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <ManageCandidates />
            </motion.div>
          </PrivateRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
