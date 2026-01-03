export type Tab = 'week' | 'month' | 'year';

export interface ChartEntry {
  name: string;
  displayValue: number;
  seconds: number;
}

export interface ChartDataResult {
  chartData: ChartEntry[];
  unit: string;
  yAxisMax: number;
}

export function calculateChartData(
  focusHistory: Record<string, number>,
  liveSeconds: number,
  activeTab: Tab,
  today: Date = new Date()
): ChartDataResult {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  let maxSeconds = 0;
  const entries: ChartEntry[] = [];

  if (activeTab === 'week') {
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay());
    lastSunday.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastSunday);
      date.setDate(lastSunday.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      let s = focusHistory[dateStr] || 0;
      if (dateStr === todayStr) s += liveSeconds;
      if (s > maxSeconds) maxSeconds = s;
      entries.push({ 
        name: date.toLocaleDateString('en-US', { weekday: 'short' }), 
        displayValue: 0, 
        seconds: s 
      });
    }
  } else if (activeTab === 'month') {
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastDay = lastDayOfMonth.getDate();
    
    let currentWeekSeconds = 0;
    let weekCount = 1;
    
    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      let s = focusHistory[dateStr] || 0;
      if (d === today.getDate()) s += liveSeconds;
      currentWeekSeconds += s;
      
      if (date.getDay() === 6 || d === lastDay) {
        if (currentWeekSeconds > maxSeconds) maxSeconds = currentWeekSeconds;
        entries.push({ 
          name: `W${weekCount}`, 
          displayValue: 0, 
          seconds: currentWeekSeconds 
        });
        currentWeekSeconds = 0;
        weekCount++;
      }
    }
  } else {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 0; m < 12; m++) {
      let monthSeconds = 0;
      const daysInMonth = new Date(currentYear, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        monthSeconds += focusHistory[dateStr] || 0;
      }
      if (m === currentMonth) monthSeconds += liveSeconds;
      if (monthSeconds > maxSeconds) maxSeconds = monthSeconds;
      entries.push({ name: monthNames[m], displayValue: 0, seconds: monthSeconds });
    }
  }

  // SMART BUCKETS LOGIC
  let unit = 's';
  let yAxisMax = 60;

  if (maxSeconds > 3600) { // > 1 hour, use hours
    unit = 'h';
    const hours = maxSeconds / 3600;
    if (hours <= 2) yAxisMax = 2;
    else if (hours <= 4) yAxisMax = 4;
    else if (hours <= 8) yAxisMax = 8;
    else if (hours <= 12) yAxisMax = 12;
    else yAxisMax = Math.ceil(hours / 4) * 4; // Round to next multiple of 4
  } else if (maxSeconds > 60) { // > 1 minute, use minutes
    unit = 'm';
    const minutes = maxSeconds / 60;
    if (minutes <= 5) yAxisMax = 5;
    else if (minutes <= 15) yAxisMax = 15;
    else if (minutes <= 30) yAxisMax = 30;
    else yAxisMax = 60;
  } else { // Use seconds
    unit = 's';
    if (maxSeconds <= 30) yAxisMax = 30;
    else yAxisMax = 60;
  }

  const finalData = entries.map(entry => ({
    ...entry,
    displayValue: unit === 's' 
      ? entry.seconds 
      : unit === 'm'
        ? parseFloat((entry.seconds / 60).toFixed(1))
        : parseFloat((entry.seconds / 3600).toFixed(1))
  }));

  return { chartData: finalData, unit, yAxisMax };
}

export function calculateCurrentStreak(focusHistory: Record<string, number>, today: Date = new Date()): number {
  let streak = 0;
  const d = new Date(today);
  let dateStr = d.toISOString().split('T')[0];
  if (focusHistory[dateStr] > 0) streak++;
  d.setDate(d.getDate() - 1);
  while (true) {
    dateStr = d.toISOString().split('T')[0];
    if (focusHistory[dateStr] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

export function calculatePeriodTitle(activeTab: Tab, today: Date = new Date()): string {
  if (activeTab === 'week') {
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay());
    const nextSaturday = new Date(lastSunday);
    nextSaturday.setDate(lastSunday.getDate() + 6);
    const format = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${format(lastSunday)} - ${format(nextSaturday)}, ${today.getFullYear()}`;
  }
  if (activeTab === 'month') return today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return `Year ${today.getFullYear()}`;
}