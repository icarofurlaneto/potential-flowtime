import React, { useState, useEffect, useRef } from 'react';
import { Settings, BarChart, User, CheckCircle, SkipForward } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [time, setTime] = useState(0);       // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  
  // Removed audioRef in favor of Web Audio API function

  // Dynamic Theme Colors based on mode
  const isFocus = mode === 'focus';
  const isActiveFocus = isFocus && isRunning;
  const bgColor = isActiveFocus ? 'bg-[#1a1a1a]' : (isFocus ? 'bg-[#BA4949]' : 'bg-[#38858A]');
  const buttonTextColor = isActiveFocus ? 'text-[#1a1a1a]' : (isFocus ? 'text-[#BA4949]' : 'text-[#38858A]');

  // --- Favicon Update (Static White) ---
  useEffect(() => {
    const svgTemplate = `
      <svg width="64" height="64" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path fill="white" fill-rule="evenodd" d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"/>
      </svg>
    `;
    const encodedSvg = encodeURIComponent(svgTemplate);
    const dataUri = `data:image/svg+xml;utf8,${encodedSvg}`;
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = dataUri;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  // --- Formatting Logic ---
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));

    return parts.join(':');
  };

  // --- Tab Title Update ---
  useEffect(() => {
    const timeStr = formatTime(time);
    const modeStr = mode === 'focus' ? 'Focus' : 'Pause';
    document.title = `${timeStr} - ${modeStr}`;
  }, [time, mode]);

  // --- Audio Logic (Web Audio API) ---
  const playNotification = () => {
    try {
      // Cross-browser support
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Sound settings: Sine wave, sliding pitch for a pleasant "ding"
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

      // Envelope: Fast attack, slow decay
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  // --- Timer Logic ---
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (mode === 'focus') {
            return prevTime + 1;
          } else {
            if (prevTime <= 1) {
              // End of Break
              setIsRunning(false);
              // We need to trigger this outside the render phase ideally, 
              // but for this simple app, we call the handler via timeout 
              // to ensure state updates don't conflict.
              setTimeout(handleBreakEnd, 0); 
              return 0;
            }
            return prevTime - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  // --- Handlers ---
  const handleBreakEnd = () => {
    playNotification();
    
    // Switch back to Focus mode ready
    setMode('focus');
    setTime(0);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'focus') {
       setTime(0);
    } else {
       // If switching to break manually via tabs, maybe we default to 0 or calculate? 
       // Existing logic set it to 0. Let's keep it consistent with 'handleNextMode' if possible, 
       // but tabs usually reset. The previous logic for handleModeSwitch was just setTime(0).
       setTime(0);
    }
  };

  const handleNextMode = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      const breakTime = Math.floor(time * 0.20);
      setMode('break');
      setTime(breakTime);
    } else {
      setMode('focus');
      setTime(0);
    }
  };

  // --- Button Text ---
  const getButtonText = () => {
    if (mode === 'focus') {
      return isRunning ? 'PAUSE' : 'START FOCUS';
    } else {
      return isRunning ? 'PAUSE' : 'START BREAK';
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ease-in-out ${bgColor} font-sans text-white flex flex-col items-center`}>
      
      {/* Header */}
      <header className="w-full max-w-2xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
           <CheckCircle size={24} className="text-white" />
           <h1 className="text-xl font-bold tracking-tight">IcarusFlow</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <HeaderButton icon={<BarChart size={16} />} text="Report" />
        </div>
      </header>

      <div className="w-full border-b border-black/10"></div>

      {/* Main Content */}
      <main className="w-full max-w-[560px] px-4 flex-1 flex flex-col items-center justify-center -mt-56">
        
        {/* Timer Card */}
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-sm border-t border-white/10 -mt-12">
          
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8 sm:mb-12 relative z-10">
             <ModeTab 
               label="Flow Time" 
               isActive={mode === 'focus'} 
               onClick={() => handleModeSwitch('focus')} 
             />
             <ModeTab 
               label="Short Break" 
               isActive={mode === 'break'} 
               onClick={() => handleModeSwitch('break')} 
             />
          </div>

          {/* Timer Display */}
          <div className="text-[5rem] sm:text-[6.5rem] leading-none font-bold mb-8 sm:mb-12 font-mono tracking-tight drop-shadow-sm">
            {formatTime(time)}
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-4 w-full justify-center max-w-[420px]">
            <button 
              onClick={toggleTimer}
              className={`
                flex-1 h-[80px] bg-white rounded-2xl 
                ${buttonTextColor} text-2xl font-bold uppercase tracking-widest
                shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] 
                active:shadow-none active:translate-y-[4px] 
                transition-all ease-out duration-150
                flex items-center justify-center px-8
              `}
            >
              {getButtonText()}
            </button>
            
            <button
              onClick={handleNextMode}
              className={`
                w-[80px] h-[80px] bg-white/20 rounded-2xl
                text-white
                shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] hover:bg-white/30
                active:shadow-none active:translate-y-[4px]
                transition-all ease-out duration-150
                flex items-center justify-center
              `}
            >
              <SkipForward size={32} />
            </button>
          </div>
        </div>

      </main>

      <footer className="py-8 text-white/40 text-sm text-center px-4">
        Dar de si, em cada ação, conceito de grande homem e de inteligência extraordinária
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function HeaderButton({ icon, text }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors">
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

function ModeTab({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1 rounded-lg text-sm sm:text-base font-bold transition-all
        ${isActive ? 'bg-black/15 shadow-inner text-white' : 'text-white/60 hover:bg-black/10'}
      `}
    >
      {label}
    </button>
  );
}

export default App;