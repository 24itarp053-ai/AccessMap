import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Shield, Info, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#121824] text-slate-300 mt-auto border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-700 text-white rounded-md flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">AccessMap Ahmedabad</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A community-driven urban accessibility platform for Ahmedabad. Mapping step-free entry points, wheelchair ramps, elevators, and physical obstacles to foster an inclusive urban environment.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/40 text-amber-300 border border-amber-800/40 rounded-full text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Smart & Inclusive Communities Hackathon Project</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-bold text-slate-200 tracking-wider">Navigation</h2>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
              <li><Link to="/map" className="hover:text-emerald-400 transition">Accessibility Map</Link></li>
              <li><Link to="/report" className="hover:text-emerald-400 transition">Report a Barrier</Link></li>
              <li><Link to="/my-reports" className="hover:text-emerald-400 transition">My Submissions</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition">Verifier Portal</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition">About the Project</Link></li>
            </ul>
          </div>

          {/* Technical Note */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-bold text-slate-200 tracking-wider">Technical Status</h2>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between text-emerald-400 font-semibold">
                <span>Frontend Built</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p>
                Connected to local API configuration (`VITE_API_BASE_URL`). Displaying sample community data until teammate backend server sync is active.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} AccessMap Initiative. OpenStreetMap tile attribution applied.
          </p>
          <p className="flex items-center space-x-1">
            <span>Designed for social impact in Ahmedabad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
