import React, { useState } from 'react';
import { CheckSquare, ShieldCheck, Filter, Search, Info, Check, X, AlertTriangle } from 'lucide-react';
import { SAMPLE_BARRIER_REPORTS } from '../services/sampleData';

export default function AdminDashboard() {
  const [reports, setReports] = useState(SAMPLE_BARRIER_REPORTS);
  const [activeTab, setActiveTab] = useState('ALL');

  const handleActionDemo = (reportId, newStatus) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 bg-[#fcfaf6]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d8]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#132e22] text-amber-400 rounded-xl flex items-center justify-center shadow-xs">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Admin & Verifier Portal
            </h1>
            <p className="text-xs text-slate-600 font-light">
              Review community reports, verify ramp installations, and update barrier status in Ahmedabad.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            Verifier Role Active (Demo)
          </span>
        </div>
      </div>

      {/* Backend Status Notice */}
      <div className="bg-[#f4eedf] p-3.5 rounded-xl border border-[#d8caa8] flex items-start space-x-2.5 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900 font-bold">Admin Verification API Notice:</strong>
          <span>Status update buttons below operate on local state for UI demonstration. Live moderation endpoints (`PATCH /api/reports/:id`) will sync when the backend server is active.</span>
        </div>
      </div>

      {/* Reports Table / Moderation Cards */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-md overflow-hidden">
        
        <div className="p-4 bg-[#fcfaf6] border-b border-[#e8e2d8] flex items-center justify-between">
          <h2 className="font-serif font-bold text-slate-900 text-base">Community Submissions Queue</h2>
          <span className="text-xs text-slate-500 font-semibold">{reports.length} Reports Logged</span>
        </div>

        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#132e22]">{report.locationName}</span>
                  <h3 className="font-serif font-bold text-slate-900 text-base">{report.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                    {report.severity}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                    {report.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-light leading-relaxed">
                {report.description}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">Reported by {report.reportedBy} • {report.date}</span>
                
                {/* Moderation Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleActionDemo(report.id, 'Verified Accessible')}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1 transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve & Verify
                  </button>

                  <button
                    onClick={() => handleActionDemo(report.id, 'Obstacle Resolved')}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition"
                  >
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => handleActionDemo(report.id, 'Dismissed / Duplicate')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
