import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

describe('App Component logic and Title', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates document title with time and mode', () => {
    render(<App />);
    
    // Initial state
    expect(document.title).toContain('(00:00) Focusing');

    // Start focusing and advance 10s
    fireEvent.click(screen.getByText('START FOCUS'));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(document.title).toContain('(00:10) Focusing');

    // Switch to break
    fireEvent.click(screen.getByText('STOP & BREAK'));
    // 20% of 10s is 2s
    expect(document.title).toContain('(00:02) Resting');
  });

  it('updates favicon color based on mode', () => {
    render(<App />);
    
    const getFaviconHref = () => {
      const link = document.querySelector("link[rel*='icon']");
      return link ? link.href : '';
    };

    // Initial Focus Mode (Red #BA4949)
    let href = getFaviconHref();
    expect(href).toContain(encodeURIComponent('#BA4949'));

    // Switch to Break Mode (Teal #38858A)
    const breakTab = screen.getByText('Short Break');
    fireEvent.click(breakTab);
    
    href = getFaviconHref();
    expect(href).toContain(encodeURIComponent('#38858A'));
  });

  it('plays sound and resets mode when break ends', () => {
    // Mock HTMLMediaElement.prototype.play to avoid errors in jsdom
    const playMock = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    
    render(<App />);
    
    // Set to break mode manually for testing (or via transition)
    fireEvent.click(screen.getByText('START FOCUS'));
    act(() => { vi.advanceTimersByTime(10000); }); // 10s work
    fireEvent.click(screen.getByText('STOP & BREAK')); // 2s break
    
    fireEvent.click(screen.getByText('START BREAK'));
    
    // Advance 2s to end break
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(playMock).toHaveBeenCalled();
    // Should be back to Focus mode ready
    expect(screen.getByText('START FOCUS')).toBeInTheDocument();
    expect(screen.getByText('00:00')).toBeInTheDocument();
    
    playMock.mockRestore();
  });
});
