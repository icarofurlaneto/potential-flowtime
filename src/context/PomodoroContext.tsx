import { useState, useEffect, useCallback, ReactNode } from 'react';
import { Mode } from '../types';
import { storage } from '../utils/storage';
import { formatTime } from '../utils/time';
import { useAudio } from '../hooks/useAudio';
import { useStats } from '../hooks/useStats';
import { useAuth } from '../hooks/useAuth';
import { PomodoroContext } from './PomodoroContextObject';

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { playNotification } = useAudio();
  
  // Delegate Auth to useAuth
  const { user, loading, loginWithGoogle, logout, deleteAccount, handleEmailSignup } = useAuth();
  
  const { completedFocusTime, focusHistory, isPremium, addFocusTime, resetStats } = useStats(user?.uid);

  const [mode, setMode] = useState<Mode>(() => (storage.get('mode') as Mode) || 'focus');
  const [time, setTime] = useState<number>(() => storage.getNumber('time', 0));
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [focusTimeStash, setFocusTimeStash] = useState<number>(() => storage.getNumber('focusTimeStash', 0));
  const [hasBreakStarted, setHasBreakStarted] = useState<boolean>(() => storage.getBoolean('hasBreakStarted', false));
  const [initialBreakTime, setInitialBreakTime] = useState<number>(() => storage.getNumber('initialBreakTime', 0));

  // Persistence
  useEffect(() => { storage.set('mode', mode); }, [mode]);
  useEffect(() => { storage.set('time', time); }, [time]);
  useEffect(() => { storage.set('focusTimeStash', focusTimeStash); }, [focusTimeStash]);
  useEffect(() => { storage.set('hasBreakStarted', hasBreakStarted); }, [hasBreakStarted]);
  useEffect(() => { storage.set('initialBreakTime', initialBreakTime); }, [initialBreakTime]);

  const handleBreakEnd = useCallback(() => {
    playNotification();
    setMode('focus');
    setTime(0);
    setIsRunning(false);
  }, [playNotification]);

  const toggleTimer = () => {
    if (isRunning) {
      // Stopping the timer - just pause
    } else {
      // Starting the timer
      if (mode !== 'focus') {
        setHasBreakStarted(true);
        // Commit stashed focus time if starting a break
        if (focusTimeStash > 0) {
          addFocusTime(focusTimeStash);
          setFocusTimeStash(0);
        }
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setFocusTimeStash(0); // Discard stashed time
    if (mode === 'focus') setTime(0);
    else setTime(initialBreakTime);
  };

  const handleModeSwitch = useCallback((newMode: Mode) => {
    let baseTimeForCalc = 0;
    
    // Leaving focus mode
    if (mode === 'focus') {
        baseTimeForCalc = time;
        if (time > 0) {
          setFocusTimeStash(time); // Just stash, don't save yet
        }
    } else {
        baseTimeForCalc = focusTimeStash;
    }

    setMode(newMode);
    setIsRunning(false);
    
    // Entering focus mode
    if (newMode === 'focus') {
       if (!hasBreakStarted && focusTimeStash > 0) {
           // Restore stashed time if break wasn't started
           setTime(focusTimeStash);
       } else {
           setTime(0);
           setFocusTimeStash(0); // Clear stash if starting fresh
       }
    } else if (newMode === 'longBreak') {
        setHasBreakStarted(false); 
        let duration = 15 * 60;
        if (baseTimeForCalc > 0) duration = Math.floor(baseTimeForCalc * 0.20) + (15 * 60);
        setTime(duration);
        setInitialBreakTime(duration);
    } else {
       setHasBreakStarted(false); 
       let duration = 5 * 60;
       if (baseTimeForCalc > 0) duration = Math.floor(baseTimeForCalc * 0.20);
       setTime(duration);
       setInitialBreakTime(duration);
    }
  }, [mode, time, focusTimeStash, hasBreakStarted]);

  const handleNextMode = useCallback(() => {
    if (mode === 'focus') {
      const currentTotal = completedFocusTime + time;
      if (currentTotal >= 7200) handleModeSwitch('longBreak');
      else handleModeSwitch('break');
    } else {
      handleModeSwitch('focus');
    }
  }, [mode, completedFocusTime, time, handleModeSwitch]);

  // Timer Interval
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((prevTime) => {
          if (mode === 'focus') return prevTime + 1;
          if (prevTime <= 1) {
            setIsRunning(false);
            setTimeout(handleBreakEnd, 0); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) clearInterval(interval);
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, mode, handleBreakEnd]);

  // Update Browser Tab Title
  useEffect(() => {
    const timeStr = formatTime(time);
    let modeStr = 'Focus';
    if (mode === 'break') modeStr = 'Short Break';
    if (mode === 'longBreak') modeStr = 'Long Break';
    document.title = `${timeStr} - ${modeStr}`;
  }, [time, mode]);

  const totalFocusTime = completedFocusTime + (mode === 'focus' ? time : focusTimeStash);
  const cycles = Math.floor(totalFocusTime / (25 * 60));

  // Colors Logic
  const isActiveFocus = mode === 'focus' && isRunning;
  let bgColor = 'bg-[#BA4949]'; 
  let buttonTextColor = 'text-[#BA4949]';

  if (isActiveFocus) {
    bgColor = 'bg-[#1a1a1a]';
    buttonTextColor = 'text-[#1a1a1a]';
  } else if (mode === 'break') {
    bgColor = 'bg-[#38858A]';
    buttonTextColor = 'text-[#38858A]';
  } else if (mode === 'longBreak') {
    bgColor = 'bg-[#5D388A]'; 
    buttonTextColor = 'text-[#5D388A]';
  }

  return (
    <PomodoroContext.Provider value={{
      mode, time, isRunning, totalFocusTime, cycles, user, loading, isPremium,
      bgColor, buttonTextColor, focusHistory, focusTimeStash,
      toggleTimer, handleReset, 
      handleResetStats: () => { resetStats(); setFocusTimeStash(0); }, 
      handleModeSwitch, handleNextMode,
      loginWithGoogle, logout, deleteAccount, handleEmailSignup
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}