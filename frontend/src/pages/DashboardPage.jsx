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
  Clock,
  Sun,
  CloudRain,
  Wind,
  CheckSquare,
  Square,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Inspect wheat plot for Crown Root Initiation (21 DAS)', done: true },
    { id: 2, text: 'Apply 1st split Urea (1/3 N) after CRI irrigation', done: false },
    { id: 3, text: 'Verify drip line operating pressure (1.2 kg/cm²)', done: false },
    { id: 4, text: 'Deploy yellow sticky traps for Whitefly monitoring in tomato field', done: true }
  ]);

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
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* COMMAND CENTER HERO HEADER */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-emerald-300 text-xs font-bold border border-forest-750">
              <Sprout className="w-3.5 h-3.5" />
              <span>Agronomy Mission Control</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {profile?.full_name || 'Farmer'}!
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Managing <strong>{profile?.farm_size_acres ? `${profile.farm_size_acres} Acres` : '12.5 Acres'}</strong> in <strong>{profile?.state_region || 'Haryana, India'}</strong>. 
              Primary crops: <span className="text-emerald-300 font-semibold">{profile?.primary_crops?.join(', ') || 'Wheat, Mustard, Paddy'}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-bold text-xs shadow-md transition active:scale-98"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Agronomist</span>
              </Link>
              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800/90 hover:bg-forest-750 text-white border border-forest-700 text-xs font-semibold transition"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Crop Encyclopedia</span>
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800/90 hover:bg-forest-750 text-white border border-forest-700 text-xs font-semibold transition"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Edit Land Specs</span>
              </Link>
            </div>
          </div>

          {/* Micro Weather & Field Sensor Card */}
          <div className="bg-forest-900/90 border border-emerald-500/30 rounded-2xl p-5 text-xs space-y-3 min-w-[280px] shadow-inner">
            <div className="flex items-center justify-between border-b border-forest-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                Field Micro-Climate
              </span>
              <span className="text-[10px] text-stone-400">Live Forecast</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-forest-950/60 rounded-xl">
                <span className="text-[10px] text-stone-400 block">Temp</span>
                <span className="font-bold text-sm text-white">24°C</span>
              </div>
              <div className="p-2 bg-forest-950/60 rounded-xl">
                <span className="text-[10px] text-stone-400 block">Humidity</span>
                <span className="font-bold text-sm text-emerald-300">58%</span>
              </div>
              <div className="p-2 bg-forest-950/60 rounded-xl">
                <span className="text-[10px] text-stone-400 block">Rainfall</span>
                <span className="font-bold text-sm text-blue-300">0%</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-300 flex items-center gap-1.5 pt-1">
              <Wind className="w-3.5 h-3.5 text-stone-400" />
              <span>Wind 7 km/h NW • Ideal for foliar micronutrient spray</span>
            </div>
          </div>
        </div>
      </div>

      {/* THREE COMMAND COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1 & 2: Recent AI Consultations & Action Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Checklist */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-forest-700" />
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Critical Agronomic Action Items (Rabi 2026)
                </h3>
              </div>
              <span className="text-xs text-stone-400">
                {tasks.filter((t) => t.done).length}/{tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border transition flex items-center gap-3 cursor-pointer ${
                    task.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-stone-500'
                      : 'bg-stone-50 border-stone-200 text-stone-850 hover:bg-stone-100/70'
                  }`}
                >
                  {task.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${task.done ? 'line-through' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Consultation Threads */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-forest-700" />
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Previous AI Consultations
                </h3>
              </div>
              <Link
                to="/assistant"
                className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1"
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
                  className="text-xs font-bold text-emerald-700 hover:underline inline-block"
                >
                  Start your first inquiry &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {conversations.slice(0, 5).map((c) => (
                  <div key={c.id} className="py-3.5 flex items-center justify-between group">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-forest-800 transition">
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
                      className="text-xs font-bold text-forest-900 px-3 py-1.5 bg-stone-100 group-hover:bg-emerald-100 rounded-xl transition"
                    >
                      Resume
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Col 3: Soil Health Radar & Lab Testing Kit Promo */}
        <div className="space-y-6">
          {/* Soil Health Status Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-forest-700" />
              <span>Soil Health Profile</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold text-stone-700">
                  <span>Soil pH (Optimal: 6.5 - 7.5)</span>
                  <span className="text-emerald-700 font-bold">7.1 (Normal)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-stone-700">
                  <span>Organic Carbon (Target: &gt; 0.75%)</span>
                  <span className="text-amber-700 font-bold">0.52% (Moderate)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full w-[52%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-stone-700">
                  <span>Available Zinc</span>
                  <span className="text-rose-700 font-bold">Low (Deficient)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full w-[30%]" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-sand-50 rounded-2xl border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
              💡 <strong>Agronomist Tip:</strong> Apply 25 kg/ha Zinc Sulfate with basal dose to prevent Khaira and yellowing in seedling stages.
            </div>
          </div>

          {/* Testing Kit CTA */}
          <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white rounded-3xl p-6 shadow-md space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-forest-950 px-2.5 py-0.5 rounded-full">
              Lab Testing Sandbox
            </span>
            <h4 className="font-serif text-lg font-bold">
              Certified Soil Testing Kit & Nutrient Card
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Order a laboratory testing package via Razorpay test mode. Receive a personalized micro-nutrient health card.
            </p>
            <Link
              to="/pricing"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-bold text-xs transition shadow-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>Order Lab Kit (₹999 Test)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
