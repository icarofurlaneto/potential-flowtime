import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { auth } from '../../firebase';
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword, updateProfile } from 'firebase/auth';

export function FinishSignupPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'verifying' | 'input' | 'submitting' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyLink = () => {
      if (!auth) return;

      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        if (email) {
          setStatus('input');
        }
      } else {
        navigate('/');
      }
    };

    verifyLink();
  }, [navigate]);

  const handleFinishSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setStatus('submitting');

    try {
      const email = window.localStorage.getItem('emailForSignIn') || '';
      const name = window.localStorage.getItem('userNameForSignUp') || '';
      
      // 2. Finalizar o login com o link
      await signInWithEmailLink(auth, email, window.location.href);
      
      // 3. Definir a senha e o nome do usuário
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, password);
        if (name) {
          await updateProfile(auth.currentUser, { displayName: name });
        }
      }

      window.localStorage.removeItem('emailForSignIn');
      window.localStorage.removeItem('userNameForSignUp');
      setStatus('success');
      
      // Redirecionar após 2 segundos
      setTimeout(() => navigate('/'), 2000);
    } catch (error: unknown) {
      console.error(error);
      setStatus('error');
      const err = error as Error;
      setErrorMessage(err.message || 'Failed to complete signup.');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin text-white mb-4" size={48} />
        <p className="text-white/70">Verifying activation link...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-105 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={64} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
          <p className="text-white/70">Account created successfully. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-105 px-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-2">Set Password</h2>
        <p className="text-white/60 text-center mb-8">Secure your account to finish</p>

        {status === 'error' && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleFinishSignup} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
              required
              disabled={status === 'submitting'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
              required
              disabled={status === 'submitting'}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full h-14 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold tracking-wide transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                FINISHING...
              </>
            ) : (
              'COMPLETE SIGNUP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
