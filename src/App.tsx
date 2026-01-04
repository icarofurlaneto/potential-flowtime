import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProductInfo } from './components/layout/ProductInfo';
import { ModeTabs } from './components/timer/ModeTabs';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { TimerControls } from './components/timer/TimerControls';
import { StatsBar } from './components/stats/StatsBar';
import { AuthPage } from './components/auth/AuthPage';
import { LoginPage } from './components/auth/LoginPage';
import { FinishSignupPage } from './components/auth/FinishSignupPage';
import { PomodoroProvider } from './context/PomodoroContext';
import { AuthProvider } from './context/AuthContext';
import { usePomodoroContext } from './hooks/usePomodoroContext';
import { useFavicon } from './hooks/useFavicon';
import { formatTime } from './utils/time';

function MainTimer() {
  const {
    mode,
    time,
    isRunning,
    totalFocusTime,
    cycles,
    toggleTimer,
    handleReset,
    handleResetStats,
    handleModeSwitch,
    handleNextMode,
    buttonTextColor
  } = usePomodoroContext();

  return (
    <div className="w-full max-w-140 px-4 animate-in fade-in duration-500">
      <div className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-sm border-t border-white/10">
        <ModeTabs currentMode={mode} onModeChange={handleModeSwitch} />
        <TimerDisplay formattedTime={formatTime(time)} />
        <StatsBar totalFocusTime={totalFocusTime} cycles={cycles} onReset={handleResetStats} />
        <TimerControls 
          isRunning={isRunning} 
          buttonTextColor={buttonTextColor}
          onToggle={toggleTimer}
          onReset={handleReset}
          onNext={handleNextMode}
        />
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-start pt-8 sm:pt-20 pb-16">
        <MainTimer />
      </div>
      <ProductInfo />
      <Footer />
    </div>
  );
}

function AppContent() {
  useFavicon();
  const { bgColor } = usePomodoroContext();
  
  return (
    <div className={`min-h-svh w-full transition-colors duration-500 ease-in-out ${bgColor} font-sans text-white flex flex-col items-center overflow-x-hidden`}>
      <Header />
      
      <main className="w-full flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={
            <div className="w-full flex flex-col items-center justify-start pt-8 sm:pt-16 pb-8">
              <Routes>
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/finish-signup" element={<FinishSignupPage />} />
              </Routes>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PomodoroProvider>
        <Router>
          <AppContent />
        </Router>
      </PomodoroProvider>
    </AuthProvider>
  );
}

export default App;