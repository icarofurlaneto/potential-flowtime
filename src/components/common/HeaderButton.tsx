
import { HeaderButtonProps } from '../../types';

export function HeaderButton({ icon, text, onClick }: HeaderButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors"
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}
