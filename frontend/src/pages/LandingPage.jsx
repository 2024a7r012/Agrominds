import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Bot,
  Droplets,
  Layers,
  Bug,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  Server,
  Zap
} from 'lucide-react';
import api from '../api/client';

export default function LandingPage() {
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    api.getHealth()
      .then((res) => {
        if (res.success) setSystemHealth(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-24 pb-16">
        {/* Subtle background ambient blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-100 to-forest-50 blur-3xl opacity-70 -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-forest-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI-Powered Precision Agriculture Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-forest-950 max-w-4xl mx-auto leading-[1.12]">
            Smarter farming decisions, <br className="hidden sm:inline" />
            <span className="text-forest-700 italic font-medium">powered by AI</span> agronomy.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            AgroMinds pairs advanced Google Gemini conversational intelligence with verified agronomic science to optimize crop yields, soil fertility, water conservation, and pest management.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-forest-900 text-white font-semibold text-base shadow-md hover:bg-forest-800 transition transform active:scale-98"
            >
              <Bot className="w-5 h-5 text-emerald-400" />
              <span>Ask AI Agriculture Assistant</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link
              to="/knowledge"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-forest-950 border border-stone-200 font-semibold text-base hover:bg-stone-50 transition shadow-xs"
            >
              <Sprout className="w-5 h-5 text-forest-700" />
              <span>Explore Crop Guides</span>
            </Link>
          </div>

          {/* System status pill */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>Backend Status:</span>
            <span className="font-semibold text-emerald-700">
              {systemHealth ? 'Healthy & Online' : 'Connecting to API...'}
            </span>
            <span className="text-stone-300">|</span>
            <a
              href="http://localhost:5000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-700 hover:underline font-medium"
            >
              OpenAPI Swagger Specs
            </a>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-forest-800 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-forest-800">
          <div className="space-y-1 text-center sm:text-left sm:pr-6">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-400">35%+</div>
            <div className="text-sm font-semibold text-stone-200">Fertilizer Cost Savings</div>
            <p className="text-xs text-stone-400">Via precision NPK soil balancing</p>
          </div>
          <div className="space-y-1 text-center sm:text-left sm:px-6 pt-4 sm:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-400">40%</div>
            <div className="text-sm font-semibold text-stone-200">Water Conservation</div>
            <p className="text-xs text-stone-400">Optimized drip and CRI scheduling</p>
          </div>
          <div className="space-y-1 text-center sm:text-left sm:px-6 pt-4 sm:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-400">24/7</div>
            <div className="text-sm font-semibold text-stone-200">AI Agronomist Access</div>
            <p className="text-xs text-stone-400">Instant pest and blight diagnostics</p>
          </div>
          <div className="space-y-1 text-center sm:text-left sm:pl-6 pt-4 sm:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-400">100%</div>
            <div className="text-sm font-semibold text-stone-200">Safe Test Mode Payments</div>
            <p className="text-xs text-stone-400">Secure Razorpay sandbox workflow</p>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Holistic Farm Intelligence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Comprehensive tools for every stage of cultivation
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            From pre-sowing soil amendments to harvest logistics, AgroMinds delivers actionable digital support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: AI Assistant */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Interactive AI Assistant
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Powered by Google Gemini to analyze custom farmer prompts with crop, soil texture, growing stage, and regional context.
            </p>
            <div className="pt-2">
              <Link
                to="/assistant"
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                Launch Assistant &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2: Soil Health */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Soil Health & Fertility
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Actionable guides for black vertisols, alluvial basins, and sandy loams with organic carbon enrichment protocols.
            </p>
            <div className="pt-2">
              <Link
                to="/knowledge?category=soil"
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                View Soil Protocols &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3: Water & Irrigation */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Precision Water Management
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Drip fertigation calibrations, critical root stage scheduling, and Alternate Wetting and Drying (AWD) calculators.
            </p>
            <div className="pt-2">
              <Link
                to="/knowledge?category=irrigation"
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                Explore Irrigation &rarr;
              </Link>
            </div>
          </div>

          {/* Card 4: Pest Defense */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Integrated Pest Management
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Early warning symptoms for Fall Armyworm, Powdery Mildew, and Leaf Blight with bio-agent and organic solutions.
            </p>
            <div className="pt-2">
              <Link
                to="/knowledge?category=pests"
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                Pest Diagnostics &rarr;
              </Link>
            </div>
          </div>

          {/* Card 5: Seasonal Schedules */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Kharif & Rabi Calendars
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Timely sowing windows, monsoon contingency roadmaps, and zero-tillage seed drills to prevent stubble burning.
            </p>
            <div className="pt-2">
              <Link
                to="/knowledge?category=seasonal"
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                Season Calendars &rarr;
              </Link>
            </div>
          </div>

          {/* Card 6: Verified Payments & Labs */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Soil Testing & Lab Kits
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Convenient test-mode checkout powered by Razorpay with HMAC SHA-256 verified signatures and transaction audit logs.
            </p>
            <div className="pt-2">
              <Link
                to="/pricing"
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                View Plans & Kits &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-sand-100/70 border-y border-stone-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Simple 4-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              How AgroMinds Works
            </h2>
            <p className="text-sm text-stone-600">
              Designed for ease of use by farmers in the field or agricultural consultants in the office.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 relative shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-full bg-forest-900 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-serif text-lg font-bold text-forest-950">
                Setup Crop Profile
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your farm acreage, soil type (alluvial, black, sandy loam), and main crops like wheat, rice, or cotton.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 relative shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-full bg-forest-900 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-serif text-lg font-bold text-forest-950">
                Ask AI Agronomist
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Describe symptoms, irrigation dilemmas, or nutrient deficiencies in plain language with immediate context.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 relative shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-full bg-forest-900 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-serif text-lg font-bold text-forest-950">
                Receive Guidance
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Get step-by-step agronomic recommendations, organic biological alternatives, and safety guidelines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 relative shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-full bg-forest-900 text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-serif text-lg font-bold text-forest-950">
                Boost Farm Yields
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Implement field changes, book certified physical soil health tests, and preserve soil vitality sustainably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-800 rounded-3xl p-10 sm:p-16 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to modernize your agricultural workflow?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100">
              Join farmers, researchers, and agronomists leveraging AgroMinds for high-yield, sustainable cultivation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-base transition shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              to="/assistant"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-white border border-forest-700 font-semibold text-base transition"
            >
              Try AI Assistant Without Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
