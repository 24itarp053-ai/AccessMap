import React from 'react';
import { Accessibility, Target, Heart, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
          <Accessibility className="w-4 h-4" />
          <span>Smart & Inclusive Communities Theme</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">About AccessMap</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          AccessMap is a community-driven urban accessibility platform tailored for Ahmedabad. We empower citizens to discover barrier-free routes, map accessible facilities, and collaborate with local verifiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <Target className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-800">Our Mission</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating urban mobility hurdles by making accessibility information transparent, crowd-verified, and accessible to everyone.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <Code className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-800">Hackathon Tech Stack</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built with React, Vite, Tailwind CSS, Leaflet & OpenStreetMap, React Router, and Axios API integrations.
          </p>
        </div>
      </div>
    </div>
  );
}
