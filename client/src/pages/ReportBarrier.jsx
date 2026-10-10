import React from 'react';
import { ShieldAlert, MapPin, Camera } from 'lucide-react';

export default function ReportBarrier() {
  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-xl shadow-xs border border-slate-200">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Report an Accessibility Barrier</h1>
          <p className="text-xs text-slate-500">Flag broken elevators, steep steps, or missing ramps to help our community.</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Place / Location Name</label>
          <input
            type="text"
            placeholder="e.g. Kalupur Railway Station Platform 1 Ramp"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Barrier Type</label>
          <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white">
            <option>Broken Elevator / Escalator</option>
            <option>Missing Wheelchair Ramp</option>
            <option>Steep Stairs Without Handrail</option>
            <option>Blocked Sidewalk / Construction Obstacle</option>
            <option>Inaccessible Restroom</option>
            <option>Other Physical Barrier</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
          <textarea
            rows="3"
            placeholder="Describe the obstacle and how it impacts access..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-md transition shadow-xs"
        >
          Submit Report Placeholder
        </button>
      </form>
    </div>
  );
}
