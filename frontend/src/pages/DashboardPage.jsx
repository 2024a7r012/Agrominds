import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Sprout,
  Layers,
  Droplets,
  CreditCard,
  User,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function DashboardPage() {
  const { user, profile, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [convRes, recordsRes] = await Promise.all([
          api.getConversations().catch(() => ({ success: false, data: [] })),
          api.getRecords({ limit: 4 }).catch(() => ({ success: false, data: { records: [] } }))
        ]);

        if (convRes.success && convRes.data) {
          setConversations(convRes.data);
        }
        if (recordsRes.success && recordsRes.data) {
          setRecords(recordsRes.data.records || []);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-emerald-300 text-xs font-semibold border border-forest-700">
            <Sprout className="w-3.5 h-3.5" />
            <span>Kisan Dashboard & Advisory Center</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back, {profile?.full_name || 'Farmer'}!
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Cultivation overview for {profile?.farm_size_acres ? `${profile.farm_size_acres} acres` : 'your farm'} in {profile?.state_region || 'Northern Agricultural Zone'}.
            Soil profile: <span className="text-emerald-300 font-semibold">{profile?.soil_type || 'Alluvial Loam'}</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs shadow-md transition"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Agronomist</span>
            </Link>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white border border-forest-700 text-xs font-semibold transition"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Explore Crop Guides</span>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white border border-forest-700 text-xs font-semibold transition"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Edit Farm Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Land</span>
            <Sprout className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold text-forest-950">
            {profile?.farm_size_acres ? `${profile.farm_size_acres} Acres` : '12.5 Acres'}
          </div>
          <p className="text-[11px] text-stone-500">
            Primary Crops: {profile?.primary_crops?.join(', ') || 'Wheat, Mustard'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Season</span>
            <Calendar className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold text-forest-950">
            Rabi Season 2026
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            Active: CRI Stage & Root Inoculation
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Advisory Threads</span>
            <MessageSquare className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold text-forest-950">
            {conversations.length} Active Sessions
          </div>
          <p className="text-[11px] text-stone-500">
            AI responses stored securely with RLS
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Soil Health Status</span>
            <Layers className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold text-forest-950">
            Good (pH 7.1)
          </div>
          <p className="text-[11px] text-stone-500">
            Zinc replenishment recommended
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Conversations & Recommended Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Consultations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-forest-700" />
              <span>Recent AI Consultations</span>
            </h3>
            <Link
              to="/assistant"
              className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
            >
              Open Assistant &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-400">Loading consultations...</div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bot className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">No previous consultations recorded yet.</p>
              <Link
                to="/assistant"
                className="text-xs font-semibold text-emerald-700 hover:underline inline-block"
              >
                Start your first question &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {conversations.slice(0, 5).map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between group">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-forest-700 transition">
                      {c.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      <span>Crop: {c.crop_context || 'General'}</span>
                      <span>•</span>
                      <span>{new Date(c.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    to="/assistant"
                    className="text-xs font-semibold text-forest-800 hover:text-forest-950 px-2 py-1 bg-stone-50 group-hover:bg-forest-50 rounded-lg transition"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Agricultural Guides */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-forest-700" />
              <span>Recommended Guides</span>
            </h3>
            <Link
              to="/knowledge"
              className="text-xs font-semibold text-forest-700 hover:text-forest-900"
            >
              All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {records.map((r) => (
              <Link
                key={r.id}
                to="/knowledge"
                className="block p-3 rounded-xl bg-stone-50 hover:bg-forest-50/70 border border-stone-200/80 transition group"
              >
                <span className="text-[10px] uppercase font-bold text-emerald-800">
                  {r.category}
                </span>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-forest-800 transition truncate mt-0.5">
                  {r.title}
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                  {r.summary}
                </p>
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/pricing"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forest-900 text-white font-semibold text-xs hover:bg-forest-800 transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>Order Certified Soil Test Kit</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
