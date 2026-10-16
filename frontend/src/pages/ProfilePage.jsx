import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Sprout,
  Layers,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  QrCode,
  Award,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { profile, user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState('');
  const [soilType, setSoilType] = useState('');
  const [stateRegion, setStateRegion] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setFarmSize(profile.farm_size_acres ? String(profile.farm_size_acres) : '');
      setPrimaryCrops(
        Array.isArray(profile.primary_crops)
          ? profile.primary_crops.join(', ')
          : profile.primary_crops || ''
      );
      setSoilType(profile.soil_type || 'Alluvial Loam');
      setStateRegion(profile.state_region || 'Haryana, India');
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const cropsArray = primaryCrops
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatePayload = {
      full_name: fullName,
      phone,
      farm_size_acres: farmSize ? parseFloat(farmSize) : null,
      primary_crops: cropsArray,
      soil_type: soilType,
      state_region: stateRegion
    };

    const res = await updateProfile(updatePayload);
    setSaving(false);

    if (res.success) {
      setSuccessMsg('Your agricultural profile and land parameters were updated successfully.');
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            Kisan Identity & Preferences
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-forest-950 mt-2">
            Farmer & Land Passport
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Keep your land size, soil texture, and primary crop tags synchronized to receive calibrated AI advice and soil testing recommendations.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* DIGITAL FARMER PASSPORT CARD */}
        <div className="lg:col-span-1 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-850 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 border border-forest-800 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-forest-800 pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Digital Kisan Passport
              </span>
            </div>
            <span className="text-[10px] font-mono bg-forest-800 px-2 py-0.5 rounded text-stone-300">
              ID: AGRO-IND-2026
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-white">
              {fullName || profile?.full_name || 'Farmer Member'}
            </h3>
            <p className="text-xs text-emerald-300 font-medium">{user?.email || 'farmer@agrominds.org'}</p>
          </div>

          <div className="p-3.5 bg-forest-900/90 rounded-2xl border border-forest-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-400">Total Area:</span>
              <strong className="text-white">{farmSize ? `${farmSize} Acres` : '12.5 Acres'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Soil Texture:</span>
              <span className="text-emerald-300 font-semibold">{soilType || 'Alluvial Loam'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Zone / State:</span>
              <span className="text-stone-200 font-medium">{stateRegion || 'Haryana, India'}</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-stone-400 text-[11px] block">Registered Primary Crops:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(primaryCrops ? primaryCrops.split(',') : ['Wheat', 'Mustard', 'Paddy']).map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-forest-800 text-emerald-200 text-[11px] font-semibold"
                >
                  {c.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-forest-800/80 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Farmer Profile
            </span>
            <QrCode className="w-6 h-6 text-stone-300" />
          </div>
        </div>

        {/* PROFILE EDIT FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
            <User className="w-5 h-5 text-forest-700" />
            <span>Update Land & Cultivation Specs</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-forest-700" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-forest-700" />
                  <span>Email (Identity Key)</span>
                </label>
                <input
                  type="email"
                  value={user?.email || 'farmer.demo@agrominds.org'}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-forest-700" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-forest-700" />
                  <span>Total Land Area (Acres)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder="e.g. 12.5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-forest-700" />
                  <span>Primary Crops (comma separated)</span>
                </label>
                <input
                  type="text"
                  value={primaryCrops}
                  onChange={(e) => setPrimaryCrops(e.target.value)}
                  placeholder="e.g. Wheat, Mustard, Paddy, Cotton"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-forest-700" />
                  <span>Predominant Soil Texture</span>
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800 bg-white"
                >
                  <option value="Alluvial Loam">Alluvial Loam (Indo-Gangetic Basin)</option>
                  <option value="Black Cotton (Vertisol)">Black Cotton (Vertisol - Deccan/Maharashtra)</option>
                  <option value="Red & Yellow Loam">Red & Yellow Loam</option>
                  <option value="Sandy Loam">Sandy Loam (Arid/Semi-Arid)</option>
                  <option value="Clayey Loam">Clayey Loam (Lowlands)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest-700" />
                  <span>State / Agro-Climatic Zone</span>
                </label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="e.g. Karnal, Haryana"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Protected by PostgreSQL Row Level Security
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-forest-900 hover:bg-forest-850 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs active:scale-98"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-emerald-400" />
                )}
                <span>Save Passport Data</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
