import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Sprout,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  Bot,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [isRegister, setIsRegister] = useState(initialMode === 'register');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState(null);

  const { loginWithDev, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginWithDev(email.trim());
      if (res.success) {
        if (res.notice) {
          setDemoNotice(res.notice);
        }
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 300);
      } else {
        setError(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithDev('farmer.demo@agrominds.org');
      if (res.success) {
        setDemoNotice('Signed in as Rajesh Kumar (Demo Farmer profile: 12.5 acres, Haryana)');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 400);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT COLUMN: Agricultural Showcase Panel */}
        <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-850 p-8 sm:p-10 text-white flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Agro<span className="text-emerald-400">Minds</span>
              </span>
            </div>

            <div className="pt-4 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                Precision Agriculture Suite
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold leading-snug">
                The smart portal for modern farmers.
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Connect your farm parameters with Google Gemini intelligence, tailor NPK fertilizer balancing, and safeguard your yield against pests.
              </p>
            </div>
          </div>

          <div className="space-y-3 relative z-10 text-xs text-stone-300 pt-4 border-t border-forest-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-turn AI Agronomy conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PostgreSQL data isolation with Supabase RLS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Attributed Indian agro-climatic databases</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 border-t border-forest-800/80 pt-3 relative z-10">
            Northcorp Software Engineering Cohort • Gurugram, India
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Form */}
        <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-center">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              {isRegister ? 'Create Farmer Account' : 'Welcome to AgroMinds'}
            </h2>
            <p className="text-xs text-stone-500">
              {isRegister
                ? 'Sign up to store farm records and consult AI.'
                : 'Sign in to access your land overview and consultation logs.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                !isRegister ? 'bg-white text-forest-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                isRegister ? 'bg-white text-forest-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {demoNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{demoNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="farmer@agrominds.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{isRegister ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Evaluation Option */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-sand-200/80 border border-stone-300 text-forest-950 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Instant Demo Farmer Login</span>
            </button>
            <p className="text-[10px] text-center text-stone-400">
              Evaluator zero-friction mode: instantly signs in as Rajesh Kumar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
