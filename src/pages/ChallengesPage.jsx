import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';

const ChallengesPage = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const challenges = [
    {
      id: 1,
      title: 'Pop Ballad Balance',
      difficulty: 'Beginner',
      description: 'Balance a emotional pop ballad with focus on vocal clarity',
      stems: ['vocal', 'piano', 'strings', 'drums'],
      duration: '3:24',
      genre: 'Pop',
      targetScore: 85
    },
    {
      id: 2,
      title: 'Rock Energy Mix',
      difficulty: 'Intermediate',
      description: 'Create punch and energy in this rock track',
      stems: ['vocal', 'guitar', 'bass', 'drums'],
      duration: '4:12',
      genre: 'Rock',
      targetScore: 90
    },
    {
      id: 3,
      title: 'Electronic Groove',
      difficulty: 'Advanced',
      description: 'Balance electronic elements with organic feel',
      stems: ['vocal', 'synth', 'bass', 'drums'],
      duration: '5:33',
      genre: 'Electronic',
      targetScore: 95
    },
    {
      id: 4,
      title: 'Jazz Ensemble',
      difficulty: 'Expert',
      description: 'Mix complex jazz arrangement with space and dynamics',
      stems: ['vocal', 'piano', 'bass', 'drums'],
      duration: '6:45',
      genre: 'Jazz',
      targetScore: 98
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Mix Challenges
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Test your mixing skills with A/B comparison challenges. Get scored based on how close your mix matches professional references.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ChallengeCard 
              challenge={challenge}
              onSelect={() => setSelectedChallenge(challenge)}
            />
          </motion.div>
        ))}
      </div>

      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
};

export default ChallengesPage;