
import { ModeTabProps } from '../../types';

export function ModeTab({ label, isActive, onClick }: ModeTabProps) {
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
