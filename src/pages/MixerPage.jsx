import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MixerBoard from '../components/MixerBoard';
import TransportControls from '../components/TransportControls';
import MasterSection from '../components/MasterSection';

const MixerPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(80);
  const [audioContext, setAudioContext] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayStateChange = (playing) => {
    setIsPlaying(playing);
  };

  const handleMasterVolumeChange = (volume) => {
    setMasterVolume(volume);
  };

  const handleAudioContextChange = (context) => {
    setAudioContext(context);
  };

  const handleTimeChange = (time) => {
    setCurrentTime(time);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Professional 4-Track Mixer
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Mix real professional audio stems from Google Drive: Kick Drum, Drum Overheads, Bass, and Vocals. 
          Experience studio-quality mixing with full EQ, panning, and level control.
        </p>
        
        {/* Audio Notice */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl max-w-lg mx-auto">
          <p className="text-purple-300 text-sm font-semibold">
            🎵 Loading Professional Audio Stems...
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Real studio recordings loaded directly from cloud storage
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <MixerBoard 
            isPlaying={isPlaying}
            masterVolume={masterVolume}
            audioContext={audioContext}
            currentTime={currentTime}
          />
        </div>
        <div className="space-y-6">
          <TransportControls 
            onPlayStateChange={handlePlayStateChange}
            onAudioContextChange={handleAudioContextChange}
            onTimeChange={handleTimeChange}
          />
          <MasterSection 
            onVolumeChange={handleMasterVolumeChange}
            isPlaying={isPlaying}
          />
        </div>
      </div>

      {/* Audio Sources Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-8"
      >
        <h3 className="text-white font-semibold mb-4 text-center">Audio Stems Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold">Kick Drum</h4>
            <p className="text-gray-400 text-sm">Professional kick drum track</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-4">
            <h4 className="text-orange-400 font-semibold">Drum Overheads</h4>
            <p className="text-gray-400 text-sm">Cymbal and room ambience</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold">Bass</h4>
            <p className="text-gray-400 text-sm">Deep bass line foundation</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-4">
            <h4 className="text-pink-400 font-semibold">Vocal</h4>
            <p className="text-gray-400 text-sm">Lead vocal performance</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MixerPage;