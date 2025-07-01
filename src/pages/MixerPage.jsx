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
          Mix realistic musical loops: Full Drum Kit, Bass Line, Vocal Melody, and String Pad. 
          Experience studio-quality mixing with full EQ, panning, and level control.
        </p>

        {/* Audio Notice */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl max-w-lg mx-auto">
          <p className="text-purple-300 text-sm font-semibold">
            🎵 Realistic Musical Loops
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Professional-sounding 8-second loops created with Web Audio API
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

      {/* Audio Stems Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-8"
      >
        <h3 className="text-white font-semibold mb-4 text-center">Musical Loops</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold">Drums</h4>
            <p className="text-gray-400 text-sm">Full kit with kick, snare, hi-hats</p>
            <div className="text-xs text-gray-500 mt-1">120 BPM groove</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold">Bass</h4>
            <p className="text-gray-400 text-sm">Walking bass line in C major</p>
            <div className="text-xs text-gray-500 mt-1">C-D-E-F progression</div>
          </div>
          <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-4">
            <h4 className="text-pink-400 font-semibold">Vocal</h4>
            <p className="text-gray-400 text-sm">Melodic vocal with vibrato</p>
            <div className="text-xs text-gray-500 mt-1">Formant-rich tones</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4">
            <h4 className="text-green-400 font-semibold">Other (Strings)</h4>
            <p className="text-gray-400 text-sm">String pad chord progression</p>
            <div className="text-xs text-gray-500 mt-1">C-Dm-Em-F chords</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <h4 className="text-purple-300 font-semibold mb-2">🎛️ Mixing Tips:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <strong>EQ Guidelines:</strong>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Drums: Boost low (kick) and high (cymbals)</li>
                <li>• Bass: Boost low-mids, cut highs</li>
                <li>• Vocal: Boost presence (2-5kHz)</li>
                <li>• Strings: Cut low-mids to make room</li>
              </ul>
            </div>
            <div>
              <strong>Panning:</strong>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Drums & Bass: Keep centered</li>
                <li>• Vocal: Slight left or right</li>
                <li>• Strings: Wide stereo spread</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MixerPage;