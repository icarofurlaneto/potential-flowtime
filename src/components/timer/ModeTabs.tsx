
import { Mode } from '../../types';
import { ModeTab } from './ModeTab';

interface ModeTabsProps {
  currentMode: Mode;
  onModeChange: (newMode: Mode) => void;
}

export function ModeTabs({ currentMode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex gap-2 mb-8 sm:mb-12 relative z-10">
      <ModeTab 
        label="Flow Time" 
        isActive={currentMode === 'focus'} 
        onClick={() => onModeChange('focus')} 
      />
      <ModeTab 
        label="Short Break" 
        isActive={currentMode === 'break'} 
        onClick={() => onModeChange('break')} 
      />
      <ModeTab 
        label="Long Break" 
        isActive={currentMode === 'longBreak'} 
        onClick={() => onModeChange('longBreak')} 
      />
    </div>
  );
}
