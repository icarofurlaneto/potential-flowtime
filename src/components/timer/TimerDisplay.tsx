

interface TimerDisplayProps {
  formattedTime: string;
}

export function TimerDisplay({ formattedTime }: TimerDisplayProps) {
  return (
    <div className="text-[5rem] sm:text-[6.5rem] leading-none font-bold mb-4 sm:mb-6 font-mono tracking-tight drop-shadow-sm">
      {formattedTime}
    </div>
  );
}
