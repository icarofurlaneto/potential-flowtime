import { describe, it, expect } from 'vitest';
import { calculateChartData, calculatePeriodTitle, calculateCurrentStreak } from './chartHelpers';

describe('Chart Logic', () => {
  // Mock Date: Friday, Jan 2, 2026
  const today = new Date(2026, 0, 2); 
  const history = {
    '2026-01-01': 3600, // Thursday (1h)
    '2026-01-02': 1800, // Friday (30m)
    '2026-01-03': 3600, // Saturday (1h)
    '2026-01-04': 7200, // Sunday (2h - Start of W2 in calendar view?)
  };

  it('calculates weekly data correctly', () => {
    // Week starts Dec 28 (Sun) to Jan 3 (Sat) for Jan 2
    const { chartData } = calculateChartData(history, 0, 'week', today);
    
    expect(chartData).toHaveLength(7);
    expect(chartData[0].name).toBe('Sun'); // Dec 28
    expect(chartData[4].name).toBe('Thu'); // Jan 1
    expect(chartData[4].seconds).toBe(3600);
    expect(chartData[5].name).toBe('Fri'); // Jan 2
    expect(chartData[5].seconds).toBe(1800);
    expect(chartData[6].name).toBe('Sat'); // Jan 3
    expect(chartData[6].seconds).toBe(3600);
  });

  it('calculates monthly data with calendar weeks logic', () => {
    // Jan 2026 starts on Thursday
    // W1: Jan 1 (Thu) - Jan 3 (Sat)
    // W2: Jan 4 (Sun) - Jan 10 (Sat)
    // ...
    
    const { chartData } = calculateChartData(history, 0, 'month', today);

    // W1 should sum Jan 1 + Jan 2 + Jan 3 = 3600 + 1800 + 3600 = 9000
    // W2 should have Jan 4 = 7200
    
    expect(chartData.length).toBeGreaterThanOrEqual(5); // Jan 2026 spans 5 weeks (Thu start)
    
    const w1 = chartData.find(d => d.name === 'W1');
    expect(w1).toBeDefined();
    expect(w1?.seconds).toBe(9000); // 2.5h
    
    const w2 = chartData.find(d => d.name === 'W2');
    expect(w2).toBeDefined();
    expect(w2?.seconds).toBe(7200); // 2h
  });

  it('includes live seconds in current day calculation', () => {
    // Adding 10 minutes (600s) of live time to today (Jan 2)
    const { chartData } = calculateChartData(history, 600, 'week', today);
    
    const fri = chartData.find(d => d.name === 'Fri');
    // History 1800 + Live 600 = 2400
    expect(fri?.seconds).toBe(2400);
  });

  it('generates correct period titles', () => {
    // Jan 2, 2026
    const weekTitle = calculatePeriodTitle('week', today);
    // Week: Dec 28 - Jan 3
    // Note: The format depends on locale, but let's check basic structure or mock it if strictly needed.
    // Our helper uses undefined locale which defaults to system. In test environment it might be en-US.
    // Let's assume en-US format "M/D/YYYY" or "MMM D".
    // "Dec 28 - Jan 3, 2026"
    expect(weekTitle).toContain('2026');
    
    const monthTitle = calculatePeriodTitle('month', today);
    expect(monthTitle).toContain('January 2026');
    
    const yearTitle = calculatePeriodTitle('year', today);
    expect(yearTitle).toBe('Year 2026');
  });

  describe('calculateCurrentStreak', () => {
    it('returns 0 for empty history', () => {
      expect(calculateCurrentStreak({}, today)).toBe(0);
    });

    it('returns 1 if only focused today', () => {
      const history = { '2026-01-02': 100 };
      expect(calculateCurrentStreak(history, today)).toBe(1);
    });

    it('returns 1 if focused yesterday but not today (streak alive)', () => {
      const history = { '2026-01-01': 100 };
      expect(calculateCurrentStreak(history, today)).toBe(1);
    });

    it('counts multiple consecutive days', () => {
      const history = {
        '2026-01-02': 100, // Today
        '2026-01-01': 100, // Yesterday
        '2025-12-31': 100, // 2 days ago
      };
      expect(calculateCurrentStreak(history, today)).toBe(3);
    });

    it('breaks the streak if a day is skipped', () => {
      const history = {
        '2026-01-02': 100, // Today
        '2026-01-01': 100, // Yesterday
        '2025-12-30': 100, // 3 days ago (skipped Dec 31)
      };
      expect(calculateCurrentStreak(history, today)).toBe(2);
    });

    it('returns 0 if last focus was 2 days ago', () => {
      const history = { '2025-12-31': 100 }; // Dec 31 (today is Jan 2)
      expect(calculateCurrentStreak(history, today)).toBe(0);
    });
  });
});
