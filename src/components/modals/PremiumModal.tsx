import { Crown, X, BarChart, Calendar, Cloud, Settings, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePomodoroContext } from "../../hooks/usePomodoroContext";
import { ReportContent } from "./ReportModal";
import { paymentService } from "../../services/paymentService";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-fade-in">
      <div className="bg-white/10 backdrop-blur-md w-full max-w-6xl rounded-3xl shadow-2xl border border-white/10 relative flex flex-col md:flex-row transform-gpu max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden animate-zoom-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-50"
        >
          <X size={24} />
        </button>

        {/* Left Side: Sales Pitch */}
        <div className="w-full md:w-[35%] p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/20 flex flex-col shrink-0">
          <PremiumContent onClose={onClose} />
        </div>

        {/* Right Side: Demo Report */}
        <div className="w-full md:w-[65%] p-8 relative bg-white/5 shrink-0 min-h-100 md:min-h-0 flex flex-col">
          {/* "PREVIEW" Badge */}
          <div className="absolute top-4 left-4 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-yellow-400/20 z-10">
            DASHBOARD PREVIEW
          </div>

          {/* Demo Content */}
          <div className="pointer-events-none select-none w-full mt-12 flex-1">
            <ReportContent isDemo={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PremiumContentProps {
  embedded?: boolean;
  onClose?: () => void;
}

export function PremiumContent({ embedded = false, onClose }: PremiumContentProps) {
  const { buttonTextColor, user } = usePomodoroContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      if (onClose) onClose();
      navigate('/login?redirect=premium');
      return;
    }

    setIsLoading(true);
    try {
      await paymentService.startCheckout();
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-6 border border-white/10 shadow-inner mx-auto ${
            embedded ? "scale-90" : ""
          }`}
        >
          <Crown size={40} className="text-yellow-400" fill="currentColor" />
        </div>

        <h2
          className={`font-bold text-white mb-2 ${
            embedded ? "text-2xl" : "text-3xl"
          }`}
        >
          FlowTimer Premium
        </h2>
        <p
          className={`text-white/60 mb-8 leading-relaxed ${
            embedded ? "text-sm" : ""
          }`}
        >
          Advanced tools to help you stay focused and track your growth.
        </p>

        <div
          className={`space-y-4 mb-10 text-left mx-auto ${
            embedded ? "max-w-xs text-sm" : "max-w-75"
          }`}
        >
          <FeatureItem
            icon={<BarChart size={16} />}
            text="Detailed productivity charts"
          />
          <FeatureItem
            icon={<Calendar size={16} />}
            text="Daily, weekly & monthly reports"
          />
          <FeatureItem
            icon={<Settings size={16} />}
            text="Customizable focus sessions"
          />
          <FeatureItem
            icon={<Cloud size={16} />}
            text="Cloud sync across devices"
          />
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`w-full h-16 bg-white ${buttonTextColor} font-bold rounded-2xl text-xl tracking-widest shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all ease-out duration-150 focus:outline-none flex items-center justify-center gap-2 disabled:opacity-70`}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "GET PREMIUM"}
        </button>

        <p className="mt-6 text-white/30 text-xs uppercase tracking-widest font-bold">
          Only $3,00 / month
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-white/80 group">
      <div className="bg-white/10 rounded-lg p-1.5 border border-white/5 shadow-inner group-hover:bg-white/20 transition-colors text-white">
        {icon}
      </div>
      <span className="text-base font-medium">{text}</span>
    </div>
  );
}
