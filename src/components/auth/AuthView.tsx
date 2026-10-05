import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const { login, register, loginWithGoogle } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) {
        addToast('Welcome back!', 'Successfully signed in to your workspace.');
        onSuccess();
      } else {
        addToast('Sign In Failed', 'Invalid email or password. Use demo quick-login below.');
      }
    } else if (mode === 'register') {
      const ok = await register(name, email, password, companyName);
      if (ok) {
        setMode('verify');
        addToast('Account Created', 'Verification email sent. You can also proceed directly.');
      }
    } else if (mode === 'forgot') {
      addToast('Reset Link Dispatched', `Password reset instructions sent to ${email}`);
      setMode('login');
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    await login(demoEmail, 'demo123');
    addToast('Demo Access Granted', `Logged in as ${demoEmail}`);
    onSuccess();
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      addToast('Google Sign-In Successful', 'Authenticated with your Google account.');
      onSuccess();
    } catch (err: any) {
      if (err.message && err.message.includes('popup-closed-by-user')) {
        addToast('Sign-In Cancelled', 'The Google sign-in window was closed.');
      } else {
        addToast('Sign-In Notice', err.message || 'Could not complete Google Sign-In.', 'error');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
      {/* Brand Logo Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 mx-auto flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/25 mb-3">
          ⚡
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
          Nexus<span className="text-indigo-400">CRM</span>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            AI OS
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          All-in-one AI business operating system for freelancers and boutique agencies.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        {mode === 'login' && (
          <>
            <div>
              <h2 className="text-lg font-bold text-white">Sign In to Your Workspace</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enter your credentials or use 1-click demo access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Google Sign-in */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-700" />
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-semibold">Or</span>
              <div className="flex-grow border-t border-slate-700" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-60 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-2 border-t border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1-Click Demo Profiles:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('alex@nexuscrm.io')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-left transition"
                >
                  <p className="text-xs font-bold text-white">Alex Morgan</p>
                  <p className="text-[10px] text-slate-400">Founder (Admin)</p>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('devon@nexuscrm.io')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-left transition"
                >
                  <p className="text-xs font-bold text-white">Devon Vance</p>
                  <p className="text-[10px] text-slate-400">Sales Lead</p>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-indigo-400 hover:underline"
              >
                Register Workspace
              </button>
            </div>
          </>
        )}

        {mode === 'register' && (
          <>
            <div>
              <h2 className="text-lg font-bold text-white">Create Freelancer Workspace</h2>
              <p className="text-xs text-slate-400 mt-0.5">Start managing clients and deals with full AI integration.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Studio Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Digital Studio"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@nexus.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
              >
                Create Account & Workspace
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-indigo-400 hover:underline"
              >
                Sign In
              </button>
            </div>
          </>
        )}

        {mode === 'verify' && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">Email Verification Sent!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We sent a verification link to <strong className="text-white">{email}</strong>. For instant demo testing, you can proceed directly to your workspace.
            </p>
            <button
              onClick={onSuccess}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
            >
              Enter Workspace →
            </button>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('login')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </button>

            <div>
              <h2 className="text-lg font-bold text-white">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enter your email and we'll send reset instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
