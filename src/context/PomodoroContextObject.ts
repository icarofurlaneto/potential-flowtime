import { createContext } from 'react';
import { PomodoroContextType } from '../types';

export const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);
