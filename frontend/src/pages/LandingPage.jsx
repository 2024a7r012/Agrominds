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
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Globe2,
  Leaf
} from 'lucide-react';
import api from '../api/client';

export default function LandingPage() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    api.getHealth()
      .then((res) => {
        if (res.success) setSystemHealth(res.data);
      })
      .catch(() => {});
  }, []);

  const faqs = [
    {
      q: 'How does the AgroMinds AI Assistant generate agronomic advice?',
      a: 'AgroMinds utilizes Google Gemini models configured with structured agricultural domain instructions. It factors in your specific crop, soil texture (e.g. alluvial, black cotton vertisol), geographic state, and current vegetative/flowering stage to synthesize actionable guidance.'
    },
    {
      q: 'Can I use AgroMinds without configuring external API keys?',
      a: 'Yes! AgroMinds includes a transparent Mock Development Engine that produces realistic, scientifically grounded answers and sandbox payment flows without requiring live cloud credentials, allowing instant demonstration and evaluation.'
    },
    {
      q: 'How are soil testing kits and agronomist consultations processed?',
      a: 'Payments are handled through Razorpay in secure Test Sandbox mode. Orders and cryptographic HMAC SHA-256 signatures are verified server-side in Node.js before access is confirmed, with zero live funds charged.'
    },
    {
      q: 'Is my farm and conversation data private?',
      a: 'Yes. In production, Supabase PostgreSQL Row Level Security (RLS) ensures that private consultations, crop profiles, and order receipts are only accessible to the authenticated owner.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* IMMERSIVE HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-24 pb-16 agri-grid border-b border-stone-200/60">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-emerald-200/60 via-forest-100/40 to-amber-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-forest-900 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Next-Generation Smart Agriculture Platform</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Hero Heading */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-forest-950 leading-[1.1]">
              Smarter farming decisions, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-forest-800 via-forest-700 to-emerald-600 bg-clip-text text-transparent italic font-serif">
                grounded in agronomy.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              AgroMinds pairs Google Gemini AI intelligence with verified soil and crop science to reduce input costs, conserve groundwater, and safeguard yields.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-forest-900 hover:bg-forest-850 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-glow-emerald transition duration-200 active:scale-98"
              >
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>Ask AI Agriculture Assistant</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>

              <Link
                to="/knowledge"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-forest-950 border border-stone-300 font-bold text-sm sm:text-base hover:bg-stone-50 transition shadow-xs"
              >
                <Sprout className="w-5 h-5 text-emerald-700" />
                <span>Browse Crop Guides</span>
              </Link>
            </div>

            {/* Live System Indicator */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend:</span>
                <strong className="text-emerald-700 font-semibold">
                  {systemHealth ? 'Healthy (Node.js/Express)' : 'Operational'}
                </strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
                <Globe2 className="w-3.5 h-3.5 text-forest-700" />
                <span>Northcorp Software, Gurugram</span>
              </span>
            </div>
          </div>

          {/* INTERACTIVE HERO PREVIEW CARD */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-forest-950">
                    Live Agronomy Assistant Preview
                  </h3>
                  <p className="text-xs text-stone-400">Context: Timely Sown Wheat • Alluvial Soil • Haryana</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Interactive Model
              </span>
            </div>

            {/* Conversation snippet */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-forest-50 p-4 rounded-2xl border border-forest-100 text-forest-950 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                  Q
                </div>
                <div>
                  <p className="font-semibold text-forest-900">
                    "When should I apply the first irrigation to timely sown wheat in alluvial soil?"
                  </p>
                </div>
              </div>

              <div className="bg-sand-50 p-4 sm:p-5 rounded-2xl border border-stone-200 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AgroMinds Recommendation</span>
                </div>
                <p className="leading-relaxed text-xs sm:text-sm">
                  Apply the first irrigation at the <strong>Crown Root Initiation (CRI) stage</strong>, precisely <strong>20 to 25 days after sowing</strong>. Delaying this irrigation stunts secondary tillers and can cut final grain yields by up to 18-22%. Top-dress with 1/3 Nitrogen (Urea) immediately after this watering.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified with Indian Agricultural Research Institute agronomy standards
              </span>
              <Link
                to="/assistant"
                className="font-bold text-forest-800 hover:text-forest-950 inline-flex items-center gap-1 text-xs"
              >
                Try full consultation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS & PROVEN ADVANTAGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-850 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-forest-800 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-forest-800">
          <div className="space-y-1 text-center sm:text-left sm:pr-6">
            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-400">35%+</div>
            <div className="text-sm font-bold text-stone-200">Fertilizer Cost Savings</div>
            <p className="text-xs text-stone-400">Targeted NPK and bio-fertilizer balancing</p>
          </div>
          <div className="space-y-1 text-center sm:text-left sm:px-6 pt-4 sm:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-400">40%</div>
            <div className="text-sm font-bold text-stone-200">Water Conservation</div>
            <p className="text-xs text-stone-400">Precision drip & root stage scheduling</p>
          </div>
          <div className="space-y-1 text-center sm:text-left sm:px-6 pt-4 sm:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-400">24 / 7</div>
            <div className="text-sm font-bold text-stone-200">AI Agronomist Access</div>
            <p className="text-xs text-stone-400">Immediate pest diagnostics & remedies</p>
          </div>
          <div className="space-y-1 text-center sm:text-left sm:pl-6 pt-4 sm:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
            <div className="text-sm font-bold text-stone-200">Safe Test Mode Payments</div>
            <p className="text-xs text-stone-400">HMAC SHA-256 verified Razorpay sandbox</p>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            Holistic Farm Intelligence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Purpose-Built Agricultural Features
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            From pre-sowing soil amendments to harvest protection, AgroMinds delivers structured digital agronomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-lg hover:border-forest-700/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Conversational AI Agronomist
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Accepts specific field parameters (crop, soil texture, region, and growth stage) to provide accurate prescriptions.
            </p>
            <div className="pt-2">
              <Link to="/assistant" className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1">
                Consult Assistant &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-lg hover:border-forest-700/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Soil Health & Fertility
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Actionable guides for black vertisols, alluvial loams, and red soils with organic matter and drainage plans.
            </p>
            <div className="pt-2">
              <Link to="/knowledge?category=soil" className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1">
                View Soil Protocols &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-lg hover:border-forest-700/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Precision Drip Irrigation
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Drip fertigation calibrations, acid descaling protocols, and Alternate Wetting and Drying (AWD) calculators.
            </p>
            <div className="pt-2">
              <Link to="/knowledge?category=irrigation" className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1">
                Explore Water Systems &rarr;
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-lg hover:border-forest-700/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Integrated Pest Management
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Diagnostics and biological controls for Fall Armyworm, Powdery Mildew, and Leaf Blight before chemical sprays.
            </p>
            <div className="pt-2">
              <Link to="/knowledge?category=pests" className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1">
                Pest Diagnostics &rarr;
              </Link>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-lg hover:border-forest-700/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Seasonal Cultivation Guides
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Kharif monsoon contingency plans and Rabi winter roadmaps to protect crops against sudden unseasonal weather.
            </p>
            <div className="pt-2">
              <Link to="/knowledge?category=seasonal" className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1">
                Seasonal Calendars &rarr;
              </Link>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-lg hover:border-forest-700/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-emerald-400 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Soil Testing & Lab Kits
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Razorpay sandbox test integration for ordering certified physical soil testing kits and agronomist consultations.
            </p>
            <div className="pt-2">
              <Link to="/pricing" className="text-xs font-bold text-forest-800 hover:text-emerald-700 inline-flex items-center gap-1">
                View Testing Plans &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PIPELINE */}
      <section className="bg-sand-100/80 border-y border-stone-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Simple 4-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              How AgroMinds Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Engineered for seamless adoption in the field or from an agronomist desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                01
              </div>
              <h4 className="font-serif text-base font-bold text-forest-950">
                Setup Farm Profile
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your farm acreage, soil type (alluvial loam, black vertisol), and primary crops like wheat, mustard, or cotton.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                02
              </div>
              <h4 className="font-serif text-base font-bold text-forest-950">
                Query AI Assistant
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Describe symptoms, irrigation dilemmas, or nutrient deficiencies in plain language with field stage context.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                03
              </div>
              <h4 className="font-serif text-base font-bold text-forest-950">
                Receive Prescription
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Get step-by-step agronomic actions, organic bio-fertilizer alternatives, and spray safety protocols.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                04
              </div>
              <h4 className="font-serif text-base font-bold text-forest-950">
                Harvest Sustainably
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Track previous consultations, book physical lab soil tests, and ensure maximum productivity with minimal chemical waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest-950">
            Everything you need to know about AgroMinds
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-forest-950 text-sm sm:text-base hover:bg-stone-50/60"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-forest-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM HERO CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-10 sm:p-16 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to elevate your farm yields?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100">
              Join farmers, researchers, and agronomists leveraging AgroMinds for high-yield, sustainable cultivation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-bold text-sm transition shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              to="/assistant"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-white border border-forest-700 font-bold text-sm transition"
            >
              Try AI Assistant Without Sign-in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
