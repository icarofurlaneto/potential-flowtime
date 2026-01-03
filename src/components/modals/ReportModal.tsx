import { X, TrendingUp, Clock, Target, Flame } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePomodoroContext } from '../../hooks/usePomodoroContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateChartData, calculatePeriodTitle, calculateCurrentStreak, Tab } from '../../utils/chartHelpers';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { isPremium } = usePomodoroContext();
  if (!isOpen || !isPremium) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white/10 backdrop-blur-xl w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative text-white animate-zoom-in overflow-hidden">
        <ReportContent onClose={onClose} />
      </div>
    </div>
  );
}

interface ReportContentProps {
  onClose?: () => void;
  isDemo?: boolean;
}

export function ReportContent({ onClose, isDemo = false }: ReportContentProps) {
  const { focusHistory, time, mode, focusTimeStash } = usePomodoroContext();
  const [activeTab, setActiveTab] = useState<Tab>('week');

  // Mock Data for Demo Mode
  const demoHistory = useMemo(() => {
    const today = new Date();
    const mock: Record<string, number> = {};
    const dailySeconds = [14400, 18000, 7200, 21600, 15000, 12000, 19000];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      mock[dateStr] = dailySeconds[i % dailySeconds.length];
    }
    return mock;
  }, []);

  const historyToUse = isDemo ? demoHistory : focusHistory;
  const liveToUse = isDemo ? 3500 : (mode === 'focus' ? time : focusTimeStash);

  const { chartData, unit, yAxisMax } = useMemo(() => {
    return calculateChartData(historyToUse, liveToUse, activeTab);
  }, [historyToUse, activeTab, liveToUse]);

  const totalSeconds = useMemo(() => chartData.reduce((acc, curr) => acc + curr.seconds, 0), [chartData]);
  
  const avgSeconds = useMemo(() => {
    const today = new Date();
    if (activeTab === 'week') return Math.round(totalSeconds / 7);
    if (activeTab === 'month') {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return Math.round(totalSeconds / daysInMonth);
    }
    return Math.round(totalSeconds / 365);
  }, [totalSeconds, activeTab]);

  const streak = useMemo(() => calculateCurrentStreak(historyToUse), [historyToUse]);

  const formatDetailed = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  const periodTitle = useMemo(() => calculatePeriodTitle(activeTab), [activeTab]);

  return (
    <div className="flex flex-col h-full text-white">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight">Productivity Report</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{periodTitle}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        )}
      </header>

      <div className="flex flex-wrap gap-2 p-1 bg-black/20 rounded-2xl mb-8 w-fit mx-auto sm:mx-0">
        <TabButton label="Week" active={activeTab === 'week'} onClick={() => setActiveTab('week')} />
        <TabButton label="Month" active={activeTab === 'month'} onClick={() => setActiveTab('month')} />
        <TabButton label="Year" active={activeTab === 'year'} onClick={() => setActiveTab('year')} />
      </div>

      <div className="bg-black/20 rounded-3xl p-4 sm:p-6 mb-8 w-full block">
        <div className="h-62.5 w-full relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: activeTab === 'year' ? 10 : 12, fontWeight: 500 }} interval={0} />
              <YAxis 
                orientation="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                unit={unit} 
                width={35} 
                domain={[0, yAxisMax]}
                ticks={[0, yAxisMax / 2, yAxisMax]} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ marginBottom: '4px', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(_value: any, _name: any, item: any) => {
                  return [formatDetailed(item.payload.seconds), 'Focus Time'];
                }}
              />
              <Bar dataKey="displayValue" radius={[6, 6, 0, 0]} barSize={activeTab === 'year' ? 20 : 45}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.seconds > 0 ? 'white' : 'rgba(255,255,255,0.1)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Clock size={16} />} title="Total Focus" value={formatDetailed(totalSeconds)} />
        <StatCard icon={<Target size={16} />} title="Daily Average" value={formatDetailed(avgSeconds)} />
        <StatCard icon={<Flame size={16} />} title="Current Streak" value={`${streak} days`} />
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>{label}</button>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center sm:items-start group hover:bg-white/10 transition-colors text-white">
      <div className="flex items-center gap-2 mb-2 text-white/40 group-hover:text-white/60 transition-colors">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
