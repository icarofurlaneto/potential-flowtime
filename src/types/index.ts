import React from 'react';

import { User } from 'firebase/auth';

export type Mode = 'focus' | 'break' | 'longBreak';

export interface HeaderButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

export interface ModeTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface Stats {
  completedFocusTime: number;
  totalFocusTime: number;
  cycles: number;
}

export interface PomodoroContextType {
  mode: Mode;
  time: number;
  isRunning: boolean;
  totalFocusTime: number;
  cycles: number;
  focusTimeStash: number;
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  bgColor: string;
  buttonTextColor: string;
  focusHistory: Record<string, number>;
  toggleTimer: () => void;
  handleReset: () => void;
  handleResetStats: () => void;
  handleModeSwitch: (newMode: Mode) => void;
  handleNextMode: () => void;
  loginWithGoogle: () => Promise<void>;
  handleEmailSignup: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}
