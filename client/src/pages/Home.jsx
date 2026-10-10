import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldAlert, CheckCircle2, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-teal-300" />
            <span>Social Impact Hackathon • Smart & Inclusive Communities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Mapping Accessible Paths & Reporting Barriers in <span className="text-teal-300">Ahmedabad</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-light">
            AccessMap empowers citizens, wheelchair users, and community verifiers to navigate public places with confidence and flag accessibility barriers for urban improvements.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg shadow-md transition transform hover:-translate-y-0.5"
            >
              <MapPin className="w-5 h-5" />
              <span>Explore Accessibility Map</span>
            </Link>
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition"
            >
              <ShieldAlert className="w-5 h-5 text-amber-300" />
              <span>Report a Barrier</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">120+</p>
              <p className="text-xs text-slate-500">Accessible Places Mapped</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">45</p>
              <p className="text-xs text-slate-500">Active Community Reports</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">88%</p>
              <p className="text-xs text-slate-500">Verification Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Callout section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6">
        <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Phase 2 Foundation Initialized</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Frontend router, Tailwind styling, Leaflet map configuration, and API service layer are configured and ready for feature implementation.
          </p>
        </div>
      </section>
    </div>
  );
}
