import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Bot,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout, isAuthenticated, loginWithDev } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sprout },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, badge: 'Gemini' },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Advisory Plans', path: '/pricing', icon: CreditCard },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/90 shadow-2xs transition-all">
      {/* Top micro banner */}
      <div className="bg-forest-950 text-emerald-300 text-[11px] py-1 px-4 text-center hidden sm:flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Rabi Season 2026 Active Advisory Window
        </span>
        <span className="text-forest-700">|</span>
        <span className="text-stone-300">
          Precision Agriculture Powered by Google Gemini & Supabase
        </span>
        <span className="text-forest-700">|</span>
        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-white underline font-medium"
        >
          OpenAPI Swagger Docs &rarr;
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-800 text-white flex items-center justify-center shadow-md group-hover:shadow-glow-emerald transition-all duration-300">
                <Sprout className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                ✓
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-forest-950">
                  Agro<span className="text-emerald-700">Minds</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-100 text-forest-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Smart Agri
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Precision Intelligence for High-Yield Farming
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-stone-100/70 p-1.5 rounded-2xl border border-stone-200/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    active
                      ? 'bg-white text-forest-950 shadow-xs border border-stone-200/70'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition"
                  title="Farmer Profile & Settings"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'F'}
                  </div>
                  <div className="text-left">
                    <p className="max-w-[110px] truncate leading-tight font-bold">
                      {profile?.full_name || user?.email?.split('@')[0]}
                    </p>
                    <span className="text-[10px] text-stone-400 block font-normal">
                      {profile?.soil_type || 'Farmer'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginWithDev('farmer.demo@agrominds.org')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition shadow-2xs"
                  title="Quick Demo evaluation mode"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Login</span>
                </button>
                <Link
                  to="/auth"
                  className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="text-xs font-bold bg-forest-900 hover:bg-forest-800 text-white px-4 py-2.5 rounded-xl shadow-xs hover:shadow-glow-emerald transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  active ? 'bg-forest-50 text-forest-950 font-bold border border-emerald-200' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-800"
                >
                  <User className="w-4 h-4 text-emerald-700" />
                  Profile ({profile?.full_name || user?.email})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    loginWithDev('farmer.demo@agrominds.org');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Quick Demo Mode</span>
                </button>
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-forest-950 border border-stone-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold bg-forest-900 text-white rounded-xl shadow-xs"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
