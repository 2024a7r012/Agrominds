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
  ShieldCheck
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
      setSuccessMsg('Your agricultural profile was successfully updated.');
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
          Account Settings
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest-950 mt-1">
          Farmer & Land Profile
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Update your agricultural parameters to help our AI Assistant and soil testing modules deliver precise advice.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-forest-700" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-forest-700" />
              <span>Email Address (Read-only)</span>
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-forest-700" />
              <span>Mobile Phone Number</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-forest-700" />
              <span>Total Farm Area (in Acres)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              placeholder="e.g. 12.5"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-forest-700" />
              <span>Primary Crops (comma separated)</span>
            </label>
            <input
              type="text"
              value={primaryCrops}
              onChange={(e) => setPrimaryCrops(e.target.value)}
              placeholder="e.g. Wheat, Mustard, Paddy"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-forest-700" />
              <span>Predominant Soil Texture</span>
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700 bg-white"
            >
              <option value="Alluvial Loam">Alluvial Loam (Indo-Gangetic Basin)</option>
              <option value="Black Cotton (Vertisol)">Black Cotton (Vertisol - Deccan/Maharashtra)</option>
              <option value="Red & Yellow Loam">Red & Yellow Loam</option>
              <option value="Sandy Loam">Sandy Loam (Arid/Semi-Arid)</option>
              <option value="Clayey Loam">Clayey Loam (Lowlands)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              <span>State / Agro-Climatic Region</span>
            </label>
            <input
              type="text"
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
              placeholder="e.g. Karnal, Haryana (Trans-Gangetic Plains)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Profile stored with Row Level Security (RLS)</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs transition flex items-center gap-2 shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
