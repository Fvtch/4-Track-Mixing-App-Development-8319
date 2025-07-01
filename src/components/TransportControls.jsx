import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiPause, FiSquare, FiRotateCcw } = FiIcons;

const TransportControls = ({ onPlayStateChange, onAudioContextChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            onPlayStateChange(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, onPlayStateChange]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    try {
      // Create AudioContext if it doesn't exist
      if (!audioContext) {
        const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(newAudioContext);
        onAudioContextChange(newAudioContext);
        
        // Resume if suspended
        if (newAudioContext.state === 'suspended') {
          await newAudioContext.resume();
        }
      } else {
        // Resume existing context if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      }
      
      const newPlayState = !isPlaying;
      setIsPlaying(newPlayState);
      onPlayStateChange(newPlayState);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onPlayStateChange(false);
  };

  const handleRewind = () => {
    setCurrentTime(0);
  };

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-white font-semibold mb-4">Transport</h3>
      
      {/* Time Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-mono text-white mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-400">
          / {formatTime(duration)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
            animate={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Transport Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          onClick={handleRewind}
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiRotateCcw} className="text-xl mx-auto" />
        </motion.button>
        
        <motion.button
          onClick={handlePlay}
          className={`p-3 rounded-xl transition-all ${
            isPlaying 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-xl mx-auto" />
        </motion.button>
      </div>

      <motion.button
        onClick={handleStop}
        className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiSquare} className="text-xl mx-auto" />
      </motion.button>
      
      {/* Audio Status */}
      <div className="mt-4 text-center">
        <div className={`text-xs font-semibold ${isPlaying ? 'text-green-400' : 'text-gray-500'}`}>
          {isPlaying ? 'ALL TRACKS PLAYING' : 'READY'}
        </div>
        {audioContext && (
          <div className="text-xs text-blue-400 mt-1">
            Audio Context: {audioContext.state}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransportControls;