import React from 'react';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';

export default function MyReports() {
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
        <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Barrier Reports</h1>
          <p className="text-xs text-slate-500">Track the status of your submitted accessibility reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center space-y-3">
        <Clock className="w-10 h-10 text-teal-600 mx-auto" />
        <h2 className="text-base font-semibold text-slate-800">No Reports Submitted Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          When you report accessibility barriers or mapped locations, they will appear here with live verification updates.
        </p>
      </div>
    </div>
  );
}
