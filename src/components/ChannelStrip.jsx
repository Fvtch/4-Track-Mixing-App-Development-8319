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

  // Alternative download URLs and fallback local files
  const audioFiles = {
    kick: [
      'https://drive.google.com/uc?export=download&id=1p5PSF2GyNvqlY7whBHjSaKACVlAg58zA',
      'https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1p5PSF2GyNvqlY7whBHjSaKACVlAg58zA',
      '/audio/kick.mp3' // Local fallback
    ],
    overheads: [
      'https://drive.google.com/uc?export=download&id=15O_8KFR2lKx3K1tIfCyrnZCAZuJLWFKp',
      'https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=15O_8KFR2lKx3K1tIfCyrnZCAZuJLWFKp',
      '/audio/overheads.mp3'
    ],
    bass: [
      'https://drive.google.com/uc?export=download&id=13TNg52YyqaizXIImfRR8YTlfHFXHJ0ev',
      'https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=13TNg52YyqaizXIImfRR8YTlfHFXHJ0ev',
      '/audio/bass.mp3'
    ],
    vocal: [
      'https://drive.google.com/uc?export=download&id=1bC6bRgrbdRdUvW2qcgXhC11kSkdfTumT',
      'https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1bC6bRgrbdRdUvW2qcgXhC11kSkdfTumT',
      '/audio/vocal.mp3'
    ]
  };

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

    // Load audio file
    loadAudioFile();

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

  const loadAudioFile = async () => {
    if (!audioContext) return;
    
    setIsLoading(true);
    setLoadError(false);
    setDebugInfo('Starting load...');
    
    const urls = audioFiles[channel.type];
    
    for (let i = 0; i < urls.length; i++) {
      try {
        setDebugInfo(`Trying URL ${i + 1}/${urls.length}`);
        console.log(`${channel.name}: Trying URL ${i + 1}:`, urls[i]);
        
        const response = await fetch(urls[i], {
          mode: 'cors',
          headers: {
            'Accept': 'audio/*,*/*'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        setDebugInfo('Decoding audio...');
        const arrayBuffer = await response.arrayBuffer();
        
        if (arrayBuffer.byteLength === 0) {
          throw new Error('Empty audio file received');
        }
        
        const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(decodedBuffer);
        setDebugInfo(`Loaded! ${decodedBuffer.duration.toFixed(1)}s`);
        console.log(`✅ ${channel.name} loaded successfully - Duration: ${decodedBuffer.duration.toFixed(2)}s`);
        setIsLoading(false);
        return; // Success! Exit the loop
        
      } catch (error) {
        console.warn(`❌ ${channel.name} URL ${i + 1} failed:`, error);
        setDebugInfo(`URL ${i + 1} failed: ${error.message}`);
        
        if (i === urls.length - 1) {
          // All URLs failed, use fallback
          console.log(`🔄 ${channel.name}: All URLs failed, using fallback audio`);
          setLoadError(true);
          setDebugInfo('Using fallback');
          createFallbackAudio();
        }
      }
    }
    
    setIsLoading(false);
  };

  const createFallbackAudio = () => {
    if (!audioContext) return;
    
    console.log(`🎵 Creating fallback audio for ${channel.name}`);
    
    // Create a more realistic fallback buffer
    const duration = 4; // 4 seconds
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(2, duration * sampleRate, sampleRate);
    
    // Generate different sounds for each channel
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const channelData = buffer.getChannelData(ch);
      
      switch (channel.type) {
        case 'kick':
          // Generate kick drum sound
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const beat = Math.floor(t * 2) % 4 === 0; // Every 2 seconds
            if (beat && (t % 2) < 0.1) {
              channelData[i] = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t % 2 * 20) * 0.5;
            } else {
              channelData[i] = 0;
            }
          }
          break;
          
        case 'overheads':
          // Generate hi-hat/cymbal sounds
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const hit = Math.floor(t * 4) % 2 === 1; // Off-beats
            if (hit && (t % 0.5) < 0.05) {
              channelData[i] = (Math.random() * 2 - 1) * Math.exp(-(t % 0.5) * 40) * 0.3;
            } else {
              channelData[i] = 0;
            }
          }
          break;
          
        case 'bass':
          // Generate bass line
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const freq = 110 + Math.sin(t * 0.5) * 20; // Varying bass note
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * 0.4;
          }
          break;
          
        case 'vocal':
          // Generate vocal-like sound
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            const freq = 440 + Math.sin(t * 2) * 100; // Varying pitch
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * (0.5 + 0.5 * Math.sin(t * 8));
          }
          break;
          
        default:
          // Default tone
          for (let i = 0; i < channelData.length; i++) {
            const t = i / sampleRate;
            channelData[i] = Math.sin(2 * Math.PI * 440 * t) * 0.2;
          }
      }
    }
    
    setAudioBuffer(buffer);
    console.log(`✅ ${channel.name} fallback audio created`);
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
      const totalGain = (gain / 20) + (volume / 100) * (masterVolume / 100) * 0.5;
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
        setLevel(Math.min((average / 255) * 120, 100)); // Boost sensitivity
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
        <div className="text-xs text-blue-300 bg-blue-900/20 rounded px-2 py-1">
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
          loadError ? 'text-orange-400' :
          isPlaying && !muted && sourceRef.current ? 'text-green-400' : 'text-gray-500'
        }`}>
          {isLoading ? 'LOADING...' : 
           loadError ? 'FALLBACK' :
           isPlaying && !muted && sourceRef.current ? 'PLAYING' : 'READY'}
        </div>
        {audioBuffer && (
          <div className="text-xs text-blue-400 mt-1">
            {(audioBuffer.duration).toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelStrip;