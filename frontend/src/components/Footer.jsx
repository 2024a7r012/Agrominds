import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HeartHandshake, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-stone-300 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Agro<span className="text-emerald-400">Minds</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering farmers, agronomists, and agri-entrepreneurs with actionable AI crop insights, precision soil health analytics, and water conservation systems.
            </p>
            <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Developed at Northcorp Software, Gurugram</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/assistant" className="hover:text-white transition">
                  AI Agriculture Assistant
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="hover:text-white transition">
                  Crop & Soil Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  Soil Testing & Advisory Plans
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 text-emerald-300"
                >
                  Swagger OpenAPI Docs &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Agricultural Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
              Agronomy Guides
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/knowledge?category=crops" className="hover:text-white transition">
                  Wheat & Paddy Cultivation
                </Link>
              </li>
              <li>
                <Link to="/knowledge?category=soil" className="hover:text-white transition">
                  Black & Alluvial Soil Health
                </Link>
              </li>
              <li>
                <Link to="/knowledge?category=irrigation" className="hover:text-white transition">
                  Precision Drip Irrigation
                </Link>
              </li>
              <li>
                <Link to="/knowledge?category=pests" className="hover:text-white transition">
                  Integrated Pest Management
                </Link>
              </li>
              <li>
                <Link to="/knowledge?category=practices" className="hover:text-white transition">
                  Zero Tillage & Crop Rotation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
              Contact & Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sector 48, Sohna Road, Gurugram, Haryana 122018, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@agrominds.org</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 (0124) 456-7890</span>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-stone-500">
              Toll-free Kisan Advisory Support (Mon-Sat, 9AM-6PM)
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} AgroMinds — Smart Agriculture Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Practices</span>
            <span className="hover:text-white cursor-pointer">Advisory Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
