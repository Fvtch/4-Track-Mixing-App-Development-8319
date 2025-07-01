import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiVolume2, FiVolumeX, FiHeadphones } = FiIcons;

const ChannelStrip = ({ channel, isPlaying, masterVolume, audioContext, currentTime }) => {
  const [volume, setVolume] = useState(75);
  const [gain, setGain] = useState(0);
  const [highEQ, setHighEQ] = useState(0);
  const [midEQ, setMidEQ] = useState(0);
  const [lowEQ, setLowEQ] = useState(0);
  const [pan, setPan] = useState(0);
  const [muted, setMuted] = useState(false);
  const [solo, setSolo] = useState(false);
  const [level, setLevel] = useState(0);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const panNodeRef = useRef(null);
  const eqNodesRef = useRef({ high: null, mid: null, low: null });
  const analyzerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioContext) return;

    // Create audio nodes
    const gainNode = audioContext.createGain();
    const panNode = audioContext.createStereoPanner();
    const analyzer = audioContext.createAnalyser();
    
    // Configure analyzer
    analyzer.fftSize = 256;
    analyzer.smoothingTimeConstant = 0.8;
    
    // Create EQ nodes
    const highEQ = audioContext.createBiquadFilter();
    const midEQ = audioContext.createBiquadFilter();
    const lowEQ = audioContext.createBiquadFilter();
    
    highEQ.type = 'highshelf';
    highEQ.frequency.value = 10000;
    midEQ.type = 'peaking';
    midEQ.frequency.value = 1000;
    midEQ.Q.value = 1;
    lowEQ.type = 'lowshelf';
    lowEQ.frequency.value = 100;
    
    // Store references
    gainNodeRef.current = gainNode;
    panNodeRef.current = panNode;
    eqNodesRef.current = { high: highEQ, mid: midEQ, low: lowEQ };
    analyzerRef.current = analyzer;

    // Create realistic audio immediately
    createRealisticAudio();

    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (e) {
          console.log('Source cleanup:', e.message);
        }
      }
    };
  }, [audioContext, channel.type]);

  const createRealisticAudio = async () => {
    if (!audioContext) return;
    
    console.log(`🎵 Creating realistic ${channel.type} loop`);
    setIsLoading(true);
    setDebugInfo('Creating loop...');
    
    // Create 4-bar loop (8 seconds at 120 BPM)
    const duration = 8;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(2, duration * sampleRate, sampleRate);
    const bpm = 120;
    const beatLength = 60 / bpm; // 0.5 seconds per beat
    
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const channelData = buffer.getChannelData(ch);
      
      switch (channel.type) {
        case 'drums':
          // Create full drum kit loop: kick, snare, hi-hats
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const beatTime = (t % beatLength) / beatLength; // 0-1 within each beat
            const beatNumber = Math.floor(t / beatLength) % 16; // 16 beats in 4 bars
            
            let sample = 0;
            
            // Kick drum on beats 1, 5, 9, 13 (every 4th beat)
            if (beatNumber % 4 === 0 && beatTime < 0.1) {
              const envelope = Math.exp(-beatTime * 20);
              const kick = Math.sin(2 * Math.PI * 60 * beatTime) * envelope * 0.8;
              const click = Math.sin(2 * Math.PI * 2000 * beatTime) * envelope * 0.3;
              sample += kick + click;
            }
            
            // Snare on beats 5, 13 (backbeat)
            if ((beatNumber === 4 || beatNumber === 12) && beatTime < 0.15) {
              const envelope = Math.exp(-beatTime * 15);
              const snare = (Math.random() * 2 - 1) * envelope * 0.6;
              const tone = Math.sin(2 * Math.PI * 200 * beatTime) * envelope * 0.4;
              sample += snare + tone;
            }
            
            // Hi-hats on every beat
            if (beatTime < 0.05) {
              const envelope = Math.exp(-beatTime * 40);
              const hihat = (Math.random() * 2 - 1) * envelope * 0.3;
              sample += hihat;
            }
            
            // Closed hi-hats on off-beats
            if ((beatTime > 0.4 && beatTime < 0.45)) {
              const envelope = Math.exp(-(beatTime - 0.4) * 50);
              const closedHat = (Math.random() * 2 - 1) * envelope * 0.2;
              sample += closedHat;
            }
            
            channelData[i] = sample * 0.7;
          }
          break;
          
        case 'bass':
          // Create walking bass line in C major
          const bassNotes = [65.41, 73.42, 82.41, 87.31]; // C2, D2, E2, F2
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const noteIndex = Math.floor(t / 2) % bassNotes.length; // Change note every 2 seconds
            const freq = bassNotes[noteIndex];
            
            // Create rich bass tone with multiple harmonics
            const fundamental = Math.sin(2 * Math.PI * freq * t) * 0.6;
            const octave = Math.sin(2 * Math.PI * freq * 2 * t) * 0.3;
            const fifth = Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.2;
            
            // Add subtle envelope for rhythm
            const beatTime = t % beatLength;
            const envelope = beatTime < 0.1 ? 1 : 0.8;
            
            channelData[i] = (fundamental + octave + fifth) * envelope * 0.5;
          }
          break;
          
        case 'vocal':
          // Create melodic vocal line with vibrato and formants
          const vocalNotes = [261.63, 293.66, 329.63, 349.23]; // C4, D4, E4, F4
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const phraseTime = t % 4; // 4-second phrases
            
            if (phraseTime < 3) { // Sing for 3 seconds, rest for 1
              const noteIndex = Math.floor(phraseTime / 0.75) % vocalNotes.length;
              const baseFreq = vocalNotes[noteIndex];
              
              // Add vibrato
              const vibrato = Math.sin(2 * Math.PI * 5 * t) * 8;
              const freq = baseFreq + vibrato;
              
              // Create formants for vowel sounds
              const formant1 = Math.sin(2 * Math.PI * freq * t) * 0.4;
              const formant2 = Math.sin(2 * Math.PI * freq * 2.4 * t) * 0.3;
              const formant3 = Math.sin(2 * Math.PI * freq * 3.2 * t) * 0.2;
              
              // Breathing envelope
              const breath = 0.7 + 0.3 * Math.sin(phraseTime * 2);
              const attack = phraseTime < 0.1 ? phraseTime * 10 : 1;
              
              channelData[i] = (formant1 + formant2 + formant3) * breath * attack * 0.4;
            } else {
              channelData[i] = 0;
            }
          }
          break;
          
        case 'other':
          // Create pad/string section with chord progression
          const chords = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D minor
            [329.63, 415.30, 493.88], // E minor  
            [349.23, 440.00, 523.25]  // F major
          ];
          
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const chordIndex = Math.floor(t / 2) % chords.length;
            const chord = chords[chordIndex];
            
            let sample = 0;
            
            // Play each note in the chord
            chord.forEach((freq, noteIndex) => {
              const fundamental = Math.sin(2 * Math.PI * freq * t) * 0.3;
              const octave = Math.sin(2 * Math.PI * freq * 0.5 * t) * 0.1; // Sub-octave
              
              // Add some movement with LFO
              const lfo = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.3 * t);
              
              sample += (fundamental + octave) * lfo;
            });
            
            // Soft attack envelope
            const chordTime = (t % 2) / 2;
            const envelope = chordTime < 0.1 ? chordTime * 10 : 1;
            
            channelData[i] = sample * envelope * 0.3;
          }
          break;
          
        default:
          // Fallback tone
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            channelData[i] = Math.sin(2 * Math.PI * 440 * t) * 0.2;
          }
      }
    }
    
    setAudioBuffer(buffer);
    setDebugInfo(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)} ready!`);
    setLoadError(false);
    setIsLoading(false);
    console.log(`✅ ${channel.name} realistic loop created`);
  };

  const createAudioSource = () => {
    if (!audioContext || !gainNodeRef.current || !audioBuffer) return null;

    // Stop existing source
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        // Already stopped
      }
    }

    // Create new buffer source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;

    // Connect the audio chain
    source
      .connect(eqNodesRef.current.high)
      .connect(eqNodesRef.current.mid)
      .connect(eqNodesRef.current.low)
      .connect(gainNodeRef.current)
      .connect(panNodeRef.current)
      .connect(analyzerRef.current)
      .connect(audioContext.destination);

    sourceRef.current = source;
    return source;
  };

  useEffect(() => {
    // Update audio parameters
    if (gainNodeRef.current) {
      const totalGain = (gain / 20) + (volume / 100) * (masterVolume / 100) * 0.6;
      gainNodeRef.current.gain.value = muted ? 0 : totalGain;
    }
    
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = pan / 100;
    }
    
    if (eqNodesRef.current.high) {
      eqNodesRef.current.high.gain.value = highEQ;
      eqNodesRef.current.mid.gain.value = midEQ;
      eqNodesRef.current.low.gain.value = lowEQ;
    }
  }, [volume, gain, pan, highEQ, midEQ, lowEQ, muted, masterVolume]);

  useEffect(() => {
    // Control playback
    if (isPlaying && !muted && audioContext && audioBuffer && !isLoading) {
      if (!sourceRef.current) {
        const source = createAudioSource();
        if (source) {
          try {
            source.start();
            console.log(`▶️ ${channel.name} started playing`);
          } catch (e) {
            console.error(`❌ Error starting ${channel.name}:`, e);
          }
        }
      }
    } else {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
          sourceRef.current = null;
          console.log(`⏹️ ${channel.name} stopped`);
        } catch (e) {
          // Already stopped
        }
      }
    }
  }, [isPlaying, muted, audioContext, audioBuffer, isLoading]);

  useEffect(() => {
    // Real-time level animation using analyzer
    const animate = () => {
      if (analyzerRef.current && isPlaying && !muted && sourceRef.current) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setLevel(Math.min((average / 255) * 150, 100)); // Boost sensitivity
      } else {
        setLevel(0);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, muted]);

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      {/* Channel Header */}
      <div className="text-center mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${channel.color} mx-auto mb-2 flex items-center justify-center relative`}>
          <SafeIcon icon={FiVolume2} className="text-white text-xl" />
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <h3 className="text-white font-semibold text-sm">{channel.name}</h3>
        <div className="text-xs text-gray-500 capitalize">{channel.type}</div>
      </div>

      {/* Debug Info */}
      <div className="mb-2 text-center">
        <div className={`text-xs rounded px-2 py-1 ${
          isLoading ? 'text-yellow-300 bg-yellow-900/20' :
          loadError ? 'text-orange-300 bg-orange-900/20' :
          'text-green-300 bg-green-900/20'
        }`}>
          {debugInfo}
        </div>
      </div>

      {/* Gain */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">GAIN</label>
        <input
          type="range"
          min="-20"
          max="20"
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-xs text-gray-400 text-center mt-1">{gain > 0 ? '+' : ''}{gain}dB</div>
      </div>

      {/* EQ Section */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">HIGH</label>
          <input
            type="range"
            min="-12"
            max="12"
            value={highEQ}
            onChange={(e) => setHighEQ(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-400 text-center">{highEQ > 0 ? '+' : ''}{highEQ}dB</div>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 block mb-1">MID</label>
          <input
            type="range"
            min="-12"
            max="12"
            value={midEQ}
            onChange={(e) => setMidEQ(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-400 text-center">{midEQ > 0 ? '+' : ''}{midEQ}dB</div>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 block mb-1">LOW</label>
          <input
            type="range"
            min="-12"
            max="12"
            value={lowEQ}
            onChange={(e) => setLowEQ(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-400 text-center">{lowEQ > 0 ? '+' : ''}{lowEQ}dB</div>
        </div>
      </div>

      {/* Pan */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">PAN</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={pan}
          onChange={(e) => setPan(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-xs text-gray-400 text-center">
          {pan === 0 ? 'C' : pan > 0 ? `R${pan}` : `L${Math.abs(pan)}`}
        </div>
      </div>

      {/* Mute/Solo */}
      <div className="flex space-x-2 mb-4">
        <motion.button
          onClick={() => setMuted(!muted)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            muted ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MUTE
        </motion.button>
        <motion.button
          onClick={() => setSolo(!solo)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            solo ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SOLO
        </motion.button>
      </div>

      {/* Level Meter */}
      <div className="mb-4">
        <div className="w-full h-20 bg-gray-800 rounded-lg p-1 flex items-end">
          <div className="w-full bg-gray-700 rounded flex flex-col-reverse">
            <motion.div
              className={`w-full rounded transition-all duration-100 ${
                level > 80 ? 'bg-red-500' : level > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ height: `${level}%` }}
              animate={{ height: `${level}%` }}
            />
          </div>
        </div>
      </div>

      {/* Volume Fader */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">VOLUME</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-xs text-gray-400 text-center mt-1">{volume}</div>
      </div>

      {/* Channel Status */}
      <div className="text-center">
        <div className={`text-xs font-semibold ${
          isLoading ? 'text-yellow-400' : 
          isPlaying && !muted && sourceRef.current ? 'text-green-400' : 'text-gray-500'
        }`}>
          {isLoading ? 'LOADING...' : 
           isPlaying && !muted && sourceRef.current ? 'PLAYING' : 'READY'}
        </div>
        {audioBuffer && (
          <div className="text-xs text-blue-400 mt-1">
            {(audioBuffer.duration).toFixed(1)}s loop
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelStrip;