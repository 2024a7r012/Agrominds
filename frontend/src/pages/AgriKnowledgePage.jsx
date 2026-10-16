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
  AlertCircle
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

  // Load categories
  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  // Load records on category or search change
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
    }, 250);

    return () => clearTimeout(debounce);
  }, [activeCategory, search]);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'crops':
        return Sprout;
      case 'soil':
        return Layers;
      case 'irrigation':
        return Droplets;
      case 'pests':
        return Bug;
      case 'seasonal':
        return Calendar;
      case 'practices':
        return Sparkles;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Agronomy Resource Library
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
            Crop, Soil & Irrigation Knowledge Base
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-2xl">
            Scientifically validated guides for staple cereals, cash crops, soil health restoration, and eco-friendly pest protection.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crops, pests, soil types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 text-sm shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition shadow-2xs ${
                active
                  ? 'bg-forest-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-stone-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count & Notice */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Showing {records.length} of {total} verified agricultural guides</span>
        <span className="hidden sm:inline-block">Curated by Northcorp Agronomy Unit</span>
      </div>

      {/* Grid of Records */}
      {loading ? (
        <div className="py-20 text-center text-stone-500 text-sm">
          Loading agricultural resources...
        </div>
      ) : records.length === 0 ? (
        <div className="py-20 bg-white rounded-2xl border border-stone-200 text-center p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-800">No matching articles found</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search keywords or resetting the category filter.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearch('');
            }}
            className="px-4 py-2 bg-forest-900 text-white text-xs font-semibold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => {
            const Icon = getCategoryIcon(r.category);
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-forest-700/40 transition cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-50 text-forest-800 text-[11px] font-semibold uppercase tracking-wider">
                      <Icon className="w-3.5 h-3.5 text-forest-700" />
                      {r.category}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-forest-950 group-hover:text-forest-700 transition">
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
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-forest-800 group-hover:translate-x-1 transition">
                    Read &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {selectedRecord.category} Guide
                </span>
                <h2 className="font-serif text-2xl font-bold text-forest-950 mt-1">
                  {selectedRecord.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed italic bg-sand-50 p-3 rounded-xl border border-stone-200">
              {selectedRecord.summary}
            </p>

            {/* Dynamic Content Display */}
            <div className="space-y-4 text-xs sm:text-sm">
              <h4 className="font-bold text-forest-950 uppercase tracking-wider text-xs">
                Key Agronomic Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selectedRecord.content).map(([key, val]) => (
                  <div key={key} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      {key.replace(/_/g, ' ')}
                    </span>
                    {Array.isArray(val) ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-stone-800">
                        {val.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs font-medium text-stone-900">{val}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-emerald-600" />
                <span>Reference data for Indian & Subtropical agro-climatic zones</span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-forest-900 text-white rounded-lg font-semibold hover:bg-forest-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
