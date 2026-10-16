import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  Leaf,
  Copy,
  Check,
  Thermometer,
  Droplets,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const PROMPT_CHIPS = [
  { text: 'Wheat CRI 1st irrigation timing', category: 'Irrigation' },
  { text: 'Organically manage Powdery Mildew on tomatoes', category: 'Crop Protection' },
  { text: 'Best organic fertilizers for black cotton soil', category: 'Nutrients' },
  { text: 'Pest traps to stop Fall Armyworm in maize', category: 'IPM Defense' },
  { text: 'Seed rate and spacing for timely sown wheat', category: 'Sowing' }
];

export default function AssistantPage() {
  const { isAuthenticated, user, profile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Field context
  const [showContext, setShowContext] = useState(false);
  const [crop, setCrop] = useState(profile?.primary_crops?.[0] || 'Wheat');
  const [soil, setSoil] = useState(profile?.soil_type || 'Alluvial Loam');
  const [location, setLocation] = useState(profile?.state_region || 'Haryana, India');
  const [growingStage, setGrowingStage] = useState('Crown Root Initiation (CRI)');

  // History & Conversations
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-seed',
      sender: 'assistant',
      content: `### 🌾 Welcome to AgroMinds AI Agronomist Mission Control

I am your dedicated digital agronomist. I combine **Google Gemini conversational intelligence** with verified agricultural science.

#### How to get the most accurate advisory:
* Use the **Field Context HUD** to set your current crop, soil type, and growing stage.
* Ask questions about fertilizer dosages, irrigation intervals, leaf spots, insect pests, or weather damage.
* Check the prompt suggestions below for quick diagnostics.

*Note: All chemical pesticide queries include certified safety reminders.*`,
      is_mock: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isAuthenticated) {
      api.getConversations()
        .then((res) => {
          if (res.success && res.data) {
            setConversations(res.data);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const loadConversation = async (convId) => {
    try {
      setLoading(true);
      setActiveConversationId(convId);
      const res = await api.getMessages(convId);
      if (res.success && res.data) {
        setMessages(
          res.data.map((m) => ({
            id: m.id,
            sender: m.sender,
            content: m.content,
            is_mock: m.is_mock,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        );
      }
    } catch (err) {
      setError('Failed to load conversation history.');
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([
      {
        id: `fresh-${Date.now()}`,
        sender: 'assistant',
        content: `### 🌾 Started New Consultation
Ready to evaluate recommendations for **${crop || 'your crop'}** on **${soil || 'your soil'}**. What symptoms or agronomic questions do you have?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const query = prompt.trim();
    if (!query || loading) return;

    setError(null);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.askAssistant({
        prompt: query,
        context: {
          crop: crop || undefined,
          soil: soil || undefined,
          location: location || undefined,
          growingStage: growingStage || undefined
        },
        conversationId: activeConversationId || undefined
      });

      if (res.success && res.data) {
        const assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: res.data.content,
          is_mock: res.data.is_mock,
          mock_reason: res.data.mock_reason,
          disclaimer: res.data.disclaimer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (res.data.conversationId && !activeConversationId) {
          setActiveConversationId(res.data.conversationId);
          if (isAuthenticated) {
            api.getConversations().then((r) => r.success && setConversations(r.data));
          }
        }

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate advisory response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* HEADER / COCKPIT TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-900 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-forest-950">
                AI Agronomist Cockpit
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Live Google Gemini intelligence with real-time agronomic field context
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContext(!showContext)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              showContext
                ? 'bg-forest-900 text-white border-forest-900 shadow-xs'
                : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Field Context HUD</span>
            {showContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={startNewConversation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* FIELD CONTEXT HUD BANNER */}
      {showContext && (
        <div className="p-5 bg-gradient-to-r from-emerald-50/90 via-sand-50 to-white border border-emerald-200/90 rounded-3xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-900">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Active Field Sensor & Environmental Parameters</span>
            </div>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              Adjusting these parameters updates prompt context sent to Gemini
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-forest-700" /> Target Crop
              </label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Paddy"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-forest-700" /> Soil Texture
              </label>
              <input
                type="text"
                value={soil}
                onChange={(e) => setSoil(e.target.value)}
                placeholder="e.g. Alluvial Loam, Black Vertisol"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-forest-700" /> State / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Haryana, Punjab, Maharashtra"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-forest-700" /> Growth Stage
              </label>
              <input
                type="text"
                value={growingStage}
                onChange={(e) => setGrowingStage(e.target.value)}
                placeholder="e.g. Crown Root (21 DAS), Flowering"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN MISSION CONTROL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Field Context Snapshot & Sessions (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          {/* Active Field HUD Card */}
          <div className="bg-forest-950 text-white rounded-3xl p-5 border border-forest-850 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-forest-800 pb-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                Active Context Snapshot
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Crop:</span>
                <span className="font-bold text-white">{crop || 'Not Set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Soil:</span>
                <span className="font-semibold text-emerald-300">{soil || 'Not Set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Stage:</span>
                <span className="font-medium text-stone-200">{growingStage || 'Vegetative'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Zone:</span>
                <span className="font-medium text-stone-200">{location || 'Subtropical'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-forest-800 text-[11px] text-stone-400">
              💡 <em>Context is automatically embedded into every Gemini API prompt.</em>
            </div>
          </div>

          {/* Past Consultation History */}
          {isAuthenticated && conversations.length > 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3 shadow-2xs max-h-[380px] overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
                Saved Consultations
              </h3>
              <div className="space-y-1.5">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => loadConversation(c.id)}
                    className={`w-full text-left p-3 rounded-2xl text-xs transition flex items-start gap-2.5 ${
                      activeConversationId === c.id
                        ? 'bg-emerald-50 text-forest-950 font-bold border border-emerald-300'
                        : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                    <div className="truncate">
                      <p className="truncate font-semibold">{c.title}</p>
                      <span className="text-[10px] text-stone-400">
                        {new Date(c.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Chat Cockpit Window */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200/90 shadow-md flex flex-col h-[670px] overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-forest-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                )}

                <div
                  className={`rounded-3xl p-5 text-xs sm:text-sm leading-relaxed space-y-3 shadow-2xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-forest-900 to-forest-850 text-white rounded-tr-none'
                      : 'bg-stone-50 border border-stone-200/80 text-stone-850 rounded-tl-none'
                  }`}
                >
                  {/* Mock banner */}
                  {msg.is_mock && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{msg.mock_reason || 'Local Mock Mode: Configure GEMINI_API_KEY in .env for live Gemini intelligence.'}</span>
                    </div>
                  )}

                  {/* Message body */}
                  <div className="prose prose-stone prose-xs sm:prose-sm max-w-none whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Safety reminder */}
                  {msg.disclaimer && (
                    <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-200/60 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="flex items-center justify-between text-[10px] pt-1 text-stone-400">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-forest-900 inline-flex items-center gap-1 font-semibold"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy advisory</span>
                        </>
                      )}
                    </button>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-9 h-9 rounded-xl bg-forest-900 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="bg-sand-50 border border-stone-200 rounded-3xl p-4 text-xs text-stone-700 flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 text-forest-700 animate-spin" />
                  <span>Synthesizing agronomic research for {crop || 'your crop'}...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2.5 border-t border-stone-200 bg-sand-50/70 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-bold text-stone-500 whitespace-nowrap text-[11px] uppercase tracking-wider">
              Quick Inquiries:
            </span>
            {PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(chip.text)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-stone-300 hover:border-emerald-600 hover:text-forest-950 text-[11px] font-medium transition shadow-2xs"
              >
                <span className="text-emerald-700 font-bold mr-1">[{chip.category}]</span>
                {chip.text}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-stone-200 bg-white">
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                placeholder="Ask about fertilizer ratios, irrigation timing, fungal blight, or soil pH..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 text-xs sm:text-sm font-medium transition"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="px-6 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-850 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-md active:scale-98"
              >
                <span>Ask AI</span>
                <Send className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
              <span>High-risk chemical sprays should always be verified with local certified extension officers.</span>
              <span>1500 chars limit</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
