
import { Trash2 } from 'lucide-react';
import { formatTime } from '../../utils/time';

interface StatsBarProps {
  totalFocusTime: number;
  cycles: number;
  onReset: () => void;
}

export function StatsBar({ totalFocusTime, cycles, onReset }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 text-white/60 text-sm font-medium mb-8 sm:mb-12">
      <span>Total: {formatTime(totalFocusTime)}</span>
      <span className="w-1 h-1 bg-white/40 rounded-full"></span>
      <span>Cycles: {cycles}</span>
      <button 
        onClick={onReset}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/10"
        title="Reset Stats"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
