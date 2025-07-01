import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiClock, FiTarget, FiTrendingUp } = FiIcons;

const ChallengeCard = ({ challenge, onSelect }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-orange-400 bg-orange-400/10';
      case 'expert': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 cursor-pointer group"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <SafeIcon icon={FiClock} className="mr-1" />
          {challenge.duration}
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
        {challenge.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {challenge.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500">
          Genre: <span className="text-gray-300">{challenge.genre}</span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <SafeIcon icon={FiTarget} className="mr-1" />
          Target: {challenge.targetScore}%
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {challenge.stems.map((stem, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg"
          >
            {stem}
          </span>
        ))}
      </div>

      <motion.button
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiPlay} />
        <span>Start Challenge</span>
      </motion.button>
    </motion.div>
  );
};

export default ChallengeCard;