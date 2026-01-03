import { Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePomodoroContext } from '../../hooks/usePomodoroContext';
import { useState } from 'react';

export function AuthPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, handleEmailSignup } = usePomodoroContext();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const onEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleEmailSignup(email);
      window.localStorage.setItem('userNameForSignUp', name);
      setIsEmailSent(true);
    } catch (error) {
      alert("Error sending link. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-105 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10 text-center">
          <div className="flex justify-center mb-6">
            <div className="text-white">
              <Mail size={64} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Check your email</h2>
          <p className="text-white/70 mb-8">
            We've sent an activation link to <br />
            <span className="text-white font-semibold">{email || 'your email'}</span>. <br />
            Please click the link to verify your account.
          </p>
          
          <button
            onClick={() => setIsEmailSent(false)}
            className="w-full h-14 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold tracking-wide transition-all active:scale-[0.98]"
          >
            RESEND EMAIL
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full mt-6 text-white/40 text-sm hover:text-white/60 transition-colors py-2"
          >
            ← Back to Timer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-105 px-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-white/60 text-center mb-8">Start your focus journey today</p>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full h-14 bg-white text-gray-800 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-[0.98] mb-6 shadow-lg"
        >
          <img 
            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Sign up with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/40 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={onEmailSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
              required
              disabled={isLoading}
            />
          </div>
          

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold tracking-wide transition-all active:scale-[0.98] mt-2 disabled:opacity-50"
          >
            {isLoading ? 'SENDING...' : 'SIGN UP WITH EMAIL'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-white font-bold underline hover:text-white/80 transition-colors"
            >
              Login
            </button>
          </p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full mt-6 text-white/40 text-sm hover:text-white/60 transition-colors py-2"
        >
          ← Back to Timer
        </button>
      </div>
    </div>
  );
}
