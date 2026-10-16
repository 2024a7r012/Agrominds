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
  Leaf
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const PROMPT_SUGGESTIONS = [
  'What is the ideal first irrigation schedule for wheat in alluvial soil?',
  'How to identify and organically control Powdery Mildew on tomatoes?',
  'Best practices to prevent pink bollworm infestation in cotton.',
  'How to improve organic matter and drainage in heavy black cotton soil?'
];

export default function AssistantPage() {
  const { isAuthenticated, user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Context drawer toggle and values
  const [showContext, setShowContext] = useState(false);
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState('');
  const [location, setLocation] = useState('');
  const [growingStage, setGrowingStage] = useState('');

  // Conversation history state
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello! I am **AgroMinds AI**, your dedicated smart agricultural advisor. 
      
Ask me anything about **crop cultivation, soil health, drip irrigation, pest defense, or seasonal planning**. 

*(Tip: You can expand the **Field Context** bar above to tailor advice to your specific crop, soil texture, and growing stage!)*`,
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

  // Load user conversations if authenticated
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
        id: 'new-welcome',
        sender: 'assistant',
        content: 'Started a fresh consultation session. What crop or farming challenge would you like to explore today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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
          // Refresh conversation list
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              AI Agriculture Assistant
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-forest-800 font-semibold border border-emerald-200">
              Gemini Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time advisory for crop cultivation, fertilizer dosages, soil conditioning, and pest control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContext(!showContext)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
              showContext
                ? 'bg-forest-900 text-white border-forest-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Field Context</span>
            {showContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={startNewConversation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Field Context Collapsible Form */}
      {showContext && (
        <div className="mt-4 p-4 sm:p-5 bg-sand-100/90 border border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Specify Field Context (Optional but Recommended)
            </h3>
            <span className="text-[11px] text-stone-500">Helps AI tailor its agronomic answers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Target Crop</label>
              <input
                type="text"
                placeholder="e.g. Wheat, Tomato, Cotton"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Soil Texture</label>
              <input
                type="text"
                placeholder="e.g. Alluvial Loam, Black Clay"
                value={soil}
                onChange={(e) => setSoil(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">State / Region</label>
              <input
                type="text"
                placeholder="e.g. Haryana, Punjab, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Current Growth Stage</label>
              <input
                type="text"
                placeholder="e.g. CRI stage (21 DAS), Flowering"
                value={growingStage}
                onChange={(e) => setGrowingStage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Conversations Sidebar (visible if logged in & has threads) */}
        {isAuthenticated && conversations.length > 0 && (
          <div className="hidden lg:block lg:col-span-1 bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs max-h-[620px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Previous Consultations
            </h3>
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadConversation(c.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start gap-2 ${
                    activeConversationId === c.id
                      ? 'bg-forest-50 text-forest-900 font-semibold border border-forest-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <p className="truncate font-medium">{c.title}</p>
                    <span className="text-[10px] text-stone-400">
                      {new Date(c.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div
          className={`${
            isAuthenticated && conversations.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'
          } bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-[640px]`}
        >
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed space-y-2 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-forest-900 text-white rounded-tr-none'
                      : 'bg-stone-50 border border-stone-200/90 text-stone-800 rounded-tl-none'
                  }`}
                >
                  {/* Mock banner indicator if mock mode */}
                  {msg.is_mock && (
                    <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{msg.mock_reason || 'Local Mock Mode: Configure GEMINI_API_KEY in .env for live Gemini intelligence.'}</span>
                    </div>
                  )}

                  <div className="prose prose-stone prose-sm max-w-none whitespace-pre-line">
                    {msg.content}
                  </div>

                  {msg.disclaimer && (
                    <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-200/60 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right pt-1 ${
                      msg.sender === 'user' ? 'text-forest-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="text-xs font-bold">You</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-forest-700 animate-spin" />
                  <span>AgroMinds AI is evaluating agronomic variables & synthesizing advice...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips suggestions */}
          <div className="px-4 py-2 border-t border-stone-100 bg-sand-50/50 flex items-center gap-2 overflow-x-auto text-xs text-stone-600">
            <span className="font-semibold text-stone-500 whitespace-nowrap">Suggested:</span>
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(s)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-emerald-500 hover:text-forest-900 text-[11px] transition shadow-2xs"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-stone-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about crop health, soil nutrients, pests, or irrigation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700 text-sm transition"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="px-5 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center gap-2 shadow-sm"
              >
                <span>Ask</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
              <span>Always consult local agronomy extension officers for chemical pesticide approvals.</span>
              <span>1500 chars limit</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
