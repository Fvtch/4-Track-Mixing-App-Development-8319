import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiVolume2, FiHeadphones, FiSave } = FiIcons;

const MasterSection = ({ onVolumeChange, isPlaying }) => {
  const [masterVolume, setMasterVolume] = useState(80);
  const [leftLevel, setLeftLevel] = useState(0);
  const [rightLevel, setRightLevel] = useState(0);

  useEffect(() => {
    onVolumeChange(masterVolume);
  }, [masterVolume, onVolumeChange]);

  useEffect(() => {
    // Simulate master level animation
    let animationFrame;
    const animate = () => {
      if (isPlaying) {
        const baseLevel = (masterVolume / 100) * 70;
        setLeftLevel(baseLevel + Math.random() * 15);
        setRightLevel(baseLevel + Math.random() * 15);
      } else {
        setLeftLevel(0);
        setRightLevel(0);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, masterVolume]);

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <SafeIcon icon={FiVolume2} className="mr-2" />
        Master Output
      </h3>
      
      {/* Master Level Meters */}
      <div className="flex space-x-2 mb-6">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">L</div>
          <div className="w-full h-32 bg-gray-800 rounded-lg p-1 flex items-end">
            <div className="w-full bg-gray-700 rounded flex flex-col-reverse">
              <motion.div
                className={`w-full rounded transition-all duration-100 ${
                  leftLevel > 80 ? 'bg-red-500' : leftLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ height: `${leftLevel}%` }}
                animate={{ height: `${leftLevel}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">R</div>
          <div className="w-full h-32 bg-gray-800 rounded-lg p-1 flex items-end">
            <div className="w-full bg-gray-700 rounded flex flex-col-reverse">
              <motion.div
                className={`w-full rounded transition-all duration-100 ${
                  rightLevel > 80 ? 'bg-red-500' : rightLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ height: `${rightLevel}%` }}
                animate={{ height: `${rightLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Master Volume */}
      <div className="mb-6">
        <label className="text-xs text-gray-400 block mb-2">MASTER VOLUME</label>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={(e) => setMasterVolume(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-xs text-gray-400 text-center mt-1">{masterVolume}</div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl font-semibold transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('Mix saved! (Demo function)')}
        >
          <SafeIcon icon={FiSave} className="mr-2" />
          Save Mix
        </motion.button>
        
        <motion.button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('Monitor enabled! (Demo function)')}
        >
          <SafeIcon icon={FiHeadphones} className="mr-2" />
          Monitor
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MasterSection;