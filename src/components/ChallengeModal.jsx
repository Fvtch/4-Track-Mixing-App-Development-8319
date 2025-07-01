import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiPlay, FiPause, FiRefreshCw, FiCheck, FiTarget } = FiIcons;

const ChallengeModal = ({ challenge, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const [userScore, setUserScore] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    // Simulate scoring algorithm
    const score = Math.floor(Math.random() * 20) + 80; // 80-100 range
    setUserScore(score);
    setCompleted(true);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setUserScore(null);
    setCompleted(false);
    setShowReference(false);
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    if (score >= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{challenge.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{challenge.genre}</span>
                <span>{challenge.duration}</span>
                <span className="capitalize">{challenge.difficulty}</span>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </motion.button>
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-6">{challenge.description}</p>

          {/* Challenge Instructions */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
            <h3 className="text-purple-300 font-semibold mb-2">Challenge Instructions:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Mix the provided stems to match the reference as closely as possible</li>
              <li>• Use the A/B comparison to check your progress</li>
              <li>• Submit your mix when you're satisfied with the balance</li>
              <li>• Target score: {challenge.targetScore}%</li>
            </ul>
          </div>

          {/* Stems */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Available Stems:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {challenge.stems.map((stem, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-gray-300 font-medium capitalize">{stem}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-xl ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-xl" />
              </motion.button>
              
              <motion.button
                onClick={() => setShowReference(!showReference)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  showReference 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-700 text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showReference ? 'Your Mix' : 'Reference'}
              </motion.button>
            </div>

            <motion.button
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiRefreshCw} className="text-xl" />
            </motion.button>
          </div>

          {/* Score Display */}
          {completed && (
            <motion.div
              className="bg-black/40 rounded-xl p-6 mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-4">
                <SafeIcon icon={FiTarget} className="text-4xl text-purple-400 mr-3" />
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor(userScore)}`}>
                    {userScore}%
                  </div>
                  <div className="text-gray-400">Your Score</div>
                </div>
              </div>
              
              <div className="text-lg text-white mb-2">
                {userScore >= challenge.targetScore ? '🎉 Excellent Mix!' : '💪 Keep Practicing!'}
              </div>
              
              <div className="text-sm text-gray-400">
                Target: {challenge.targetScore}% | 
                {userScore >= challenge.targetScore ? ' Target Achieved!' : ' Try Again?'}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {!completed ? (
              <motion.button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiCheck} />
                <span>Submit Mix</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            )}
            
            <motion.button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChallengeModal;