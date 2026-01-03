import { useState, useEffect, useRef } from "react";
import { CheckCircle, BarChart, User as UserIcon, LogOut, Trash2, ChevronDown } from "lucide-react";
import { Link, useSearchParams } from 'react-router-dom';
import { usePomodoroContext } from '../../hooks/usePomodoroContext';
import { PremiumModal } from '../modals/PremiumModal';
import { ReportModal } from "../modals/ReportModal";

export function Header() {
  const { user, logout, deleteAccount, isPremium } = usePomodoroContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-open premium modal if redirected from login
  useEffect(() => {
    if (searchParams.get('premium') === 'true') {
      if (!isPremium) setIsPremiumModalOpen(true);
      searchParams.delete('premium');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, isPremium]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReportClick = () => {
    if (isPremium) setIsReportOpen(true);
    else setIsPremiumModalOpen(true);
  };

  return (
    <>
      <header className="w-full max-w-2xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <CheckCircle size={24} className="text-white" />
          <h1 className="text-xl font-bold tracking-tight">FlowTimer</h1>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleReportClick}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded border border-white/5 transition-all text-sm font-medium"
          >
            <BarChart size={16} />
            <span className="hidden sm:inline">Report</span>
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded border border-white/5 transition-all animate-in fade-in slide-in-from-right-4 duration-300 ${isUserMenuOpen ? 'bg-white/20' : ''}`}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <UserIcon size={16} />
                )}
                <span className="text-sm font-medium hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-white/40 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu - Glassmorphism (Matching ReportModal) */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-5 py-3 border-b border-white/10 mb-2">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Account</p>
                    <p className="text-sm font-semibold truncate text-white">{user.email}</p>
                  </div>
                  
                  <div className="px-2 space-y-1">
                    <button 
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all group"
                    >
                      <LogOut size={18} className="text-white/40 group-hover:text-white transition-colors" />
                      Logout
                    </button>
                    
                    <button 
                      onClick={() => { deleteAccount(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/20 rounded-2xl transition-all group"
                    >
                      <Trash2 size={18} className="text-red-500/40 group-hover:text-red-500 transition-colors" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded border border-white/5 transition-all text-sm font-medium">
                <UserIcon size={16} />
                <span className="hidden sm:inline">Login</span>
              </button>
            </Link>
          )}
        </div>
      </header>
      <div className="w-full border-b border-black/10"></div>

      {/* Modals */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
}
