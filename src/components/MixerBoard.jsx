import React from 'react';
import { motion } from 'framer-motion';
import ChannelStrip from './ChannelStrip';

const MixerBoard = ({ isPlaying, masterVolume, audioContext, currentTime }) => {
  const channels = [
    {
      id: 1,
      name: 'Kick Drum',
      color: 'from-red-500 to-orange-500',
      type: 'kick'
    },
    {
      id: 2,
      name: 'Overheads', 
      color: 'from-orange-500 to-yellow-500',
      type: 'overheads'
    },
    {
      id: 3,
      name: 'Bass',
      color: 'from-blue-500 to-indigo-500',
      type: 'bass'
    },
    {
      id: 4,
      name: 'Vocal',
      color: 'from-pink-500 to-rose-500',
      type: 'vocal'
    }
  ];

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel, index) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ChannelStrip 
              channel={channel} 
              isPlaying={isPlaying}
              masterVolume={masterVolume}
              audioContext={audioContext}
              currentTime={currentTime}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MixerBoard;