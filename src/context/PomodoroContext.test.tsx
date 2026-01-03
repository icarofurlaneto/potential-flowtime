import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { PomodoroProvider } from './PomodoroContext';
import { usePomodoroContext } from '../hooks/usePomodoroContext';

// Mock dependencies
vi.mock('../firebase', () => ({
  auth: { onAuthStateChanged: vi.fn(() => vi.fn()) },
  db: {},
  signInWithGoogle: vi.fn(),
  logoutUser: vi.fn(),
  sendActivationLink: vi.fn(),
}));

vi.mock('../hooks/useAudio', () => ({
  useAudio: () => ({ playNotification: vi.fn() }),
}));

// Mock useAuth to avoid needing AuthProvider wrapper
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    handleEmailSignup: vi.fn()
  }),
}));

// Mock storage to avoid actual localStorage calls
vi.mock('../utils/storage', () => ({
  storage: {
    get: vi.fn(),
    getNumber: vi.fn(() => 0),
    getBoolean: vi.fn(() => false),
    set: vi.fn(),
  },
}));

// Test consumer component
function TestConsumer() {
  const { 
    mode, time, isRunning, toggleTimer, handleModeSwitch, handleReset, totalFocusTime 
  } = usePomodoroContext();

  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="time">{time}</div>
      <div data-testid="running">{isRunning.toString()}</div>
      <div data-testid="total">{totalFocusTime}</div>
      <button onClick={toggleTimer}>Toggle</button>
      <button onClick={() => handleModeSwitch('break')}>Go to Break</button>
      <button onClick={() => handleModeSwitch('focus')}>Go to Focus</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

describe('PomodoroContext Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with default values', () => {
    render(
      <PomodoroProvider>
        <TestConsumer />
      </PomodoroProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('focus');
    expect(screen.getByTestId('time').textContent).toBe('0');
    expect(screen.getByTestId('running').textContent).toBe('false');
  });

  it('pausing focus timer does NOT reset time', async () => {
    render(
      <PomodoroProvider>
        <TestConsumer />
      </PomodoroProvider>
    );

    const toggleBtn = screen.getByText('Toggle');

    // Start
    await act(async () => { toggleBtn.click(); });
    // Tick 5 seconds
    await act(async () => { vi.advanceTimersByTime(5000); });
    
    expect(screen.getByTestId('time').textContent).toBe('5');
    
    // Pause
    await act(async () => { toggleBtn.click(); });
    
    expect(screen.getByTestId('running').textContent).toBe('false');
    expect(screen.getByTestId('time').textContent).toBe('5'); // Time should be preserved
  });

  it('switching from focus to break stashes time and restores it if returned', async () => {
    render(
      <PomodoroProvider>
        <TestConsumer />
      </PomodoroProvider>
    );

    // Start and tick 10s
    await act(async () => { screen.getByText('Toggle').click(); });
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(screen.getByTestId('time').textContent).toBe('10');

    // Switch to break (not started yet)
    await act(async () => { screen.getByText('Go to Break').click(); });
    expect(screen.getByTestId('mode').textContent).toBe('break');
    // In break mode, time shows break duration (default 5m = 300s since 10s * 0.20 = 2s added to base 5m is not implemented exactly like that but close)
    // Actually the current code for duration is: let duration = 5 * 60; if (baseTimeForCalc > 0) duration = Math.floor(baseTimeForCalc * 0.20);
    // Wait, the code says: duration = Math.floor(baseTimeForCalc * 0.20); (it replaces 5*60 if > 0)
    // Let's check: 10 * 0.20 = 2 seconds.
    expect(screen.getByTestId('time').textContent).toBe('2');

    // Switch back to focus
    await act(async () => { screen.getByText('Go to Focus').click(); });
    expect(screen.getByTestId('mode').textContent).toBe('focus');
    expect(screen.getByTestId('time').textContent).toBe('10'); // Restored from stash
  });

  it('starting a break commits the stashed focus time', async () => {
    // We need to check if addFocusTime was called. 
    // Since useStats is a hook, we can't easily spy on its return value unless we mock it.
    // However, we can check totalFocusTime which is calculated as completedFocusTime + time/stash.
    
    render(
      <PomodoroProvider>
        <TestConsumer />
      </PomodoroProvider>
    );

    // Focus 10s
    await act(async () => { screen.getByText('Toggle').click(); });
    await act(async () => { vi.advanceTimersByTime(10000); });
    
    // Switch to break
    await act(async () => { screen.getByText('Go to Break').click(); });
    
    // Start break (this should commit the 10s)
    await act(async () => { screen.getByText('Toggle').click(); });
    
    // At this point, focusTimeStash should be 0 and the 10s should be in completedFocusTime.
    // totalFocusTime = completedFocusTime + (mode === 'focus' ? time : focusTimeStash)
    // Since mode is 'break' and focusTimeStash is now 0, totalFocusTime should be 10 (from completedFocusTime).
    expect(screen.getByTestId('total').textContent).toBe('10');
  });

  it('resetting discards the current focus time', async () => {
    render(
      <PomodoroProvider>
        <TestConsumer />
      </PomodoroProvider>
    );

    // Focus 10s
    await act(async () => { screen.getByText('Toggle').click(); });
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(screen.getByTestId('time').textContent).toBe('10');

    // Reset
    await act(async () => { screen.getByText('Reset').click(); });
    
    expect(screen.getByTestId('time').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
  });
});
