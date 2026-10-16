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
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Sprout },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Plans & Pricing', path: '/pricing', icon: CreditCard },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-forest-900 text-white flex items-center justify-center shadow-md group-hover:bg-forest-800 transition-colors">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-forest-950">
                  Agro<span className="text-forest-700">Minds</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-100 text-forest-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  Smart Agri
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Precision Agriculture & AI Agronomy
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-forest-50 text-forest-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-forest-700' : 'text-stone-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition"
                  title="Farmer Profile & Settings"
                >
                  <User className="w-4 h-4 text-forest-700" />
                  <span className="max-w-[120px] truncate">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="text-sm font-medium text-forest-900 hover:text-forest-700 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="text-sm font-semibold bg-forest-900 hover:bg-forest-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-forest-50 text-forest-900 font-semibold' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-forest-700' : 'text-stone-400'}`} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700"
                >
                  <User className="w-4 h-4 text-forest-700" />
                  Profile ({profile?.full_name || user?.email})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-forest-900 border border-stone-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold bg-forest-900 text-white rounded-lg shadow-sm"
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
