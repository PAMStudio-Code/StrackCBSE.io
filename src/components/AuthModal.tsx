import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  LogIn,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleTabSwitch = (newMode: 'signin' | 'signup') => {
    if (loading) return;
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setLoading(true);
    try {
      // Enforce browser local persistence
      await setPersistence(auth, browserLocalPersistence);

      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
        setSuccessMessage('Successfully logged in! Syncing your study tasks...');
      } else {
        await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        setSuccessMessage('Account created successfully! Your study progress will now be synced.');
      }

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 750);
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      const errorCode = err?.code || '';
      
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('Invalid email address format. Please check for typos.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email. Please check your email or click "Sign Up" above.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Incorrect email or password. Please verify and try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Switch to "Log In" tab to log in.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/too-many-requests':
          setError('Access temporarily disabled due to many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network connection error. Please check your internet connection.');
          break;
        default:
          setError(err?.message || 'Authentication failed. Please check your credentials and try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Modal Container */}
      <div className="bg-[#0b0c10] text-stone-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-800/90 relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 mb-1 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {mode === 'signin' ? 'Log In to Stracked' : 'Create Free Account'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xs mx-auto">
            {mode === 'signin' 
              ? 'Enter your credentials to sync your CBSE Class 10 study tasks across devices'
              : 'Sign up with your email to preserve your syllabus checkmarks and timer logs'}
          </p>
        </div>

        {/* Log In / Sign Up Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-2xl border border-stone-800/80 mb-5">
          <button
            type="button"
            onClick={() => handleTabSwitch('signin')}
            disabled={loading}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin'
                ? 'bg-stone-800 text-white shadow-xs border border-stone-700/60'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            disabled={loading}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-stone-800 text-white shadow-xs border border-stone-700/60'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Inline Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Standard Email & Password Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                disabled={loading}
                className="w-full bg-stone-950/90 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 transition-all focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                Password
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-stone-500">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-stone-950/90 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 transition-all focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (for Sign Up) */}
          {mode === 'signup' && (
            <div className="animate-in fade-in duration-150">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-stone-950/90 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 transition-all focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/40 hover:shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'signin' ? 'Logging In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <>
                {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{mode === 'signin' ? 'Log In to Account' : 'Sign Up Free'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-5 text-center text-xs text-stone-400">
          {mode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('signup')}
                disabled={loading}
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer underline-offset-2 hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('signin')}
                disabled={loading}
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer underline-offset-2 hover:underline"
              >
                Log In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
