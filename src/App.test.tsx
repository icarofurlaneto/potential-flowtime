import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

describe('App Component logic and Title', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates document title with time and mode', async () => {
    render(<App />);
    
    expect(document.title).toContain('00:00 - Focus');

    const startBtn = screen.getByText('START');
    await act(async () => { fireEvent.click(startBtn); });
    
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(document.title).toContain('00:10 - Focus');

    const nextBtn = screen.getByTitle('Next Mode');
    await act(async () => { fireEvent.click(nextBtn); });
    
    expect(document.title).toContain('00:02 - Short Break');
  });
});
