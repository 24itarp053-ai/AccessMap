import React from 'react';
import { Accessibility, Target, Heart, Code, MapPin, Shield, Layers } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 bg-[#fcfaf6]">
      
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Accessibility className="w-4 h-4" />
          <span>Smart & Inclusive Communities Hackathon</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
          About AccessMap Ahmedabad
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-light leading-relaxed">
          AccessMap is a community-driven civic-tech platform empowering wheelchair users, senior citizens, and pedestrians to navigate public infrastructure in Ahmedabad with clarity and confidence.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-2xl border border-[#e8e2d8] shadow-xs space-y-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900">Our Civic Mission</h2>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Public urban infrastructure should be accessible to all. We leverage crowd-sourced data, open-source mapping, and community verification to highlight step-free entrances and highlight physical barriers requiring resolution.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#e8e2d8] shadow-xs space-y-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900">Tailored for Ahmedabad</h2>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            From the Sabarmati Riverfront and Metro Rail corridors to heritage markets like Manek Chowk, AccessMap categorizes accessibility ratings and physical obstacles across key municipal zones.
          </p>
        </div>

      </div>

      {/* Tech Stack Card */}
      <div className="bg-[#132e22] text-[#fcfaf6] rounded-3xl p-8 sm:p-10 space-y-4 shadow-lg">
        <h2 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
          <Code className="w-6 h-6 text-amber-400" />
          <span>Technology & Architecture</span>
        </h2>
        <p className="text-sm text-emerald-200/90 font-light leading-relaxed">
          The frontend is built using React, Vite, JavaScript, Tailwind CSS v4, React Router, Leaflet, and OpenStreetMap. API service structures in `client/src/services/api.js` use Axios interceptors for backend authorization.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg border border-emerald-800">React + Vite</span>
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg border border-emerald-800">Tailwind CSS v4</span>
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg border border-emerald-800">Leaflet & OpenStreetMap</span>
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg border border-emerald-800">Axios API Client</span>
        </div>
      </div>

    </div>
  );
}
