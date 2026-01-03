
import { RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  buttonTextColor: string;
  onToggle: () => void;
  onReset: () => void;
  onNext: () => void;
}

export function TimerControls({
  isRunning,
  buttonTextColor,
  onToggle,
  onReset,
  onNext
}: TimerControlsProps) {
  
  const getButtonText = () => {
    if (isRunning) return 'PAUSE';
    return 'START';
  };

  return (
    <div className="flex items-center gap-4 w-full justify-center max-w-105">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-20 h-20 bg-white/20 rounded-2xl text-white shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] hover:bg-white/30 active:shadow-none active:translate-y-1 transition-all ease-out duration-150 flex items-center justify-center"
        title="Reset Timer"
      >
        <RotateCcw size={28} />
      </button>

      <button 
        onClick={onToggle}
        className={`flex-1 h-20 bg-white rounded-2xl ${buttonTextColor} text-2xl font-bold uppercase tracking-widest shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all ease-out duration-150 flex items-center justify-center px-8`}
      >
        {getButtonText()}
      </button>
      
      <button
        onClick={onNext}
        className="w-20 h-20 bg-white/20 rounded-2xl text-white shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] hover:bg-white/30 active:shadow-none active:translate-y-1 transition-all ease-out duration-150 flex items-center justify-center"
        title="Next Mode"
      >
        <SkipForward size={32} />
      </button>
    </div>
  );
}
