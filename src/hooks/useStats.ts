import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { statsService, HistoryData } from '../services/statsService';

export type { HistoryData };

export function useStats(userId: string | undefined) {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [completedFocusTime, setCompletedFocusTime] = useState<number>(() => {
    const today = new Date().toDateString();
    const lastDate = storage.get('lastFocusDate');
    
    if (lastDate !== today) {
      storage.set('completedFocusTime', 0);
      storage.set('lastFocusDate', today);
      return 0;
    }
    
    return storage.getNumber('completedFocusTime', 0);
  });

  const [focusHistory, setFocusHistory] = useState<HistoryData>(() => {
    const saved = localStorage.getItem('focusHistory');
    return saved ? JSON.parse(saved) : {};
  });

  // Subscribe to Service on login (Real-time)
  useEffect(() => {
    if (!userId) {
      setIsPremium(false);
      return;
    }

    const unsubscribe = statsService.subscribeToUserData(userId, (userData) => {
      // Prioritize cloud data, but keep local-only entries
      setFocusHistory(prev => ({ ...prev, ...userData.history })); 
      setIsPremium(userData.isPremium);
    });

    return () => unsubscribe();
  }, [userId]);

  // Persist Local and Cloud
  useEffect(() => {
    storage.set('completedFocusTime', completedFocusTime);
    storage.set('lastFocusDate', new Date().toDateString());
  }, [completedFocusTime]);

  useEffect(() => {
    localStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    
    // Save to Service
    if (userId) {
      statsService.saveHistory(userId, focusHistory);
    }
  }, [focusHistory, userId]);

  const addFocusTime = useCallback((seconds: number) => {
    const today = new Date().toISOString().split('T')[0];
    setCompletedFocusTime(prev => prev + seconds);
    setFocusHistory(prev => ({
      ...prev,
      [today]: (prev[today] || 0) + seconds
    }));
  }, []);

  const resetStats = () => {
    if (confirm('Reset all focus stats and history?')) {
      setCompletedFocusTime(0);
      setFocusHistory({});
    }
  };

  return {
    completedFocusTime,
    focusHistory,
    isPremium,
    addFocusTime,
    resetStats
  };
}