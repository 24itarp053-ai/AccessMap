import React from 'react';
import { MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PlaceDetails() {
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sabarmati Riverfront Promenade</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-teal-600" /> Ashram Road, Ahmedabad, Gujarat
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            Wheelchair Accessible
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
          <div className="flex items-center space-x-2 text-slate-700">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Step-free Ramp Entry</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Accessible Restrooms Nearby</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Cobblestone Path (Slight Bumps)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
