import React from 'react';
import { CheckSquare, ShieldCheck, Filter } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto my-10 px-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin & Verifier Portal</h1>
            <p className="text-xs text-slate-500">Review community reports and confirm accessible status updates.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center space-y-2">
        <ShieldCheck className="w-10 h-10 text-teal-600 mx-auto" />
        <h2 className="text-base font-semibold text-slate-800">Verification Queue Ready</h2>
        <p className="text-xs text-slate-500">Admin controls and report status moderation table configured for Phase 3.</p>
      </div>
    </div>
  );
}
