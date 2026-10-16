import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sprout,
  Layers,
  Droplets,
  Bug,
  Calendar,
  Sparkles,
  Tag,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react';
import api from '../api/client';

export default function AgriKnowledgePage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('overview');

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const debounce = setTimeout(() => {
      api.getRecords({
        category: activeCategory,
        search: search.trim() || undefined
      })
        .then((res) => {
          if (res.success && res.data) {
            setRecords(res.data.records);
            setTotal(res.data.total);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(debounce);
  }, [activeCategory, search]);

  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'crops':
        return { icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'soil':
        return { icon: Layers, color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'irrigation':
        return { icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'pests':
        return { icon: Bug, color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'seasonal':
        return { icon: Calendar, color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'practices':
        return { icon: Sparkles, color: 'text-forest-700 bg-forest-50 border-forest-200' };
      default:
        return { icon: BookOpen, color: 'text-stone-700 bg-stone-100 border-stone-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-emerald-300 text-xs font-semibold border border-forest-750">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Agricultural Knowledge Base</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Scientific Agronomy Encyclopedia
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            Peer-reviewed guidelines for major food grains, commercial cash crops, precision drip management, soil microbiome restoration, and bio-friendly pest suppression.
          </p>

          {/* Search box inside banner */}
          <div className="pt-2 relative max-w-xl">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by crop, pest (e.g. armyworm), soil (e.g. vertisol), or practice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white text-stone-900 border-none focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs sm:text-sm font-medium shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY SELECTOR CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-forest-950">
            Browse by Topic Categories
          </h3>
          <span className="text-xs text-stone-500">
            Showing {records.length} of {total} verified publications
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const { icon: Icon, color } = getCategoryTheme(cat.id);
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${
                  active
                    ? 'bg-forest-900 text-white border-forest-900 shadow-md ring-2 ring-emerald-400'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-300 hover:bg-stone-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-forest-700'}`} />
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <div>
                  <div className="font-bold text-xs truncate leading-snug">{cat.name}</div>
                  <span className={`text-[10px] truncate block ${active ? 'text-emerald-200' : 'text-stone-400'}`}>
                    Explore &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ARTICLES GRID */}
      {loading ? (
        <div className="py-24 text-center text-xs text-stone-500 font-medium">
          Fetching agronomic records...
        </div>
      ) : records.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-stone-200 text-center p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-800">No matching articles found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try searching for broader keywords like "wheat", "cotton", "drip", or "soil".
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearch('');
            }}
            className="px-5 py-2.5 bg-forest-900 text-white text-xs font-bold rounded-xl"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => {
            const { icon: Icon, color } = getCategoryTheme(r.category);
            return (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRecord(r);
                  setActiveModalTab('overview');
                }}
                className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-forest-700/50 transition cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {r.category}
                    </span>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      4 min read
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-forest-950 group-hover:text-emerald-800 transition leading-snug">
                    {r.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {r.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {r.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-forest-800 group-hover:translate-x-1 transition flex items-center gap-1">
                    <span>Full Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MULTI-TAB SPECIFICATION MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {selectedRecord.category} Comprehensive Guide
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-forest-950 mt-1">
                  {selectedRecord.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Highlight */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-sand-50 p-4 rounded-2xl border border-stone-200 font-medium">
              {selectedRecord.summary}
            </p>

            {/* Agronomic Data Grid */}
            <div className="space-y-4">
              <h4 className="font-bold text-forest-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Agronomic Field Parameters & Prescriptions
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.entries(selectedRecord.content).map(([key, val]) => (
                  <div key={key} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                      {key.replace(/_/g, ' ')}
                    </span>
                    {Array.isArray(val) ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-stone-800">
                        {val.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs font-semibold text-stone-900 leading-relaxed">{val}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Attributed to Central Institute of Agricultural Research Standards
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-forest-900 text-white rounded-xl font-bold hover:bg-forest-850"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
