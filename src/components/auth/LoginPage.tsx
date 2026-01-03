import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { usePomodoroContext } from '../../hooks/usePomodoroContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, user } = usePomodoroContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Watch for user changes to redirect after successful login
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect');
      if (redirect === 'premium') {
        navigate('/?premium=true', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate, searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-105 px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-white/60 text-center mb-8">Login to your account</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full h-14 bg-white text-gray-800 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-[0.98] mb-6 shadow-lg"
        >
          <img 
            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Login with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/40 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold tracking-wide transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'LOGIN'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-white font-bold underline hover:text-white/80 transition-colors"
            >
              Create Account
            </Link>
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
