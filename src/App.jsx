import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import MixerPage from './pages/MixerPage';
import ChallengesPage from './pages/ChallengesPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('mixer');

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <motion.main 
          className="pt-20 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<MixerPage />} />
            <Route path="/mixer" element={<MixerPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;