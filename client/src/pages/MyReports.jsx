import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Clock, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { SAMPLE_BARRIER_REPORTS } from '../services/sampleData';

export default function MyReports() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 bg-[#fcfaf6]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d8]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#132e22] text-amber-400 rounded-xl flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              My Barrier Submissions
            </h1>
            <p className="text-xs text-slate-600 font-light">
              Track verification progress and municipal review for your submitted obstacles.
            </p>
          </div>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#132e22] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Report New Barrier</span>
        </Link>
      </div>

      {/* Backend Technical Status Disclaimer */}
      <div className="bg-[#f4eedf] p-3.5 rounded-xl border border-[#d8caa8] flex items-start space-x-2.5 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900 font-bold">Sample Community Log Notice:</strong>
          <span>Below are demonstrative obstacle reports logged in Ahmedabad. Real user submission tracking will fetch live data from `/api/reports/me` once the backend server is active.</span>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {SAMPLE_BARRIER_REPORTS.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-[#e8e2d8] p-6 shadow-xs space-y-3 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 font-serif">{report.title}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  {report.severity}
                </span>
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {report.date}
              </span>
            </div>

            <p className="text-xs text-[#132e22] font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              {report.locationName}
            </p>

            <p className="text-xs text-slate-600 leading-relaxed font-light">
              {report.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Verification Status: <strong className="text-slate-900">{report.status}</strong>
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                Sample Record #{report.id}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
