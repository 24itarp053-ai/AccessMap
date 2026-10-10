import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Clock,
  Info,
  ShieldAlert,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  Tag
} from 'lucide-react';
import { trackReport, REPORT_CATEGORIES } from '../services/reportService';
import { SAMPLE_BARRIER_REPORTS } from '../services/sampleData';

export default function MyReports() {
  const location = useLocation();
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Check URL query parameters for ?code=REP-XXXXXXXX
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const codeParam = queryParams.get('code');
    if (codeParam) {
      setTrackingCodeInput(codeParam);
      handleTrackCode(codeParam);
    }
  }, [location.search]);

  const handleTrackCode = async (codeToSearch) => {
    const searchCode = codeToSearch || trackingCodeInput;
    setTrackingError('');
    setTrackingResult(null);

    if (!searchCode.trim()) {
      setTrackingError('Please enter a valid tracking code (e.g. REP-A1B2C3D4).');
      return;
    }

    setTrackingLoading(true);
    const res = await trackReport(searchCode);
    setTrackingLoading(false);

    if (res.success) {
      setTrackingResult(res);
    } else {
      setTrackingError(res.error || 'Failed to locate tracking code.');
    }
  };

  const getCategoryLabel = (categoryKey) => {
    const found = REPORT_CATEGORIES.find((c) => c.value === categoryKey);
    return found ? found.label : categoryKey;
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'resolved') {
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-full">Resolved</span>;
    }
    if (s === 'under_review') {
      return <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-full">Under Review</span>;
    }
    if (s === 'rejected') {
      return <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-300 font-bold text-xs rounded-full">Rejected</span>;
    }
    return <span className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-full">Pending Verification</span>;
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 bg-[#fcfaf6]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d8]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#132e22] text-amber-400 rounded-xl flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Report Tracking & History
            </h1>
            <p className="text-xs text-slate-600 font-light">
              Track verification progress for obstacle reports using official tracking codes (`GET /api/reports/track/:code`).
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

      {/* Track Report Code Search Form Box */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 shadow-md space-y-4">
        <h2 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-800" />
          <span>Track Report by Code</span>
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrackCode();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={trackingCodeInput}
              onChange={(e) => setTrackingCodeInput(e.target.value)}
              placeholder="Enter tracking code (e.g. REP-A1B2C3D4 or DEMO-REP-...)"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 font-mono uppercase bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={trackingLoading}
            className="px-6 py-2.5 bg-[#132e22] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {trackingLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Track Status</span>
            )}
          </button>
        </form>

        {/* Error / Not Found Alert */}
        {trackingError && (
          <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span>{trackingError}</span>
          </div>
        )}

        {/* Tracked Report Detail Result Card */}
        {trackingResult && trackingResult.report && (
          <div className="p-6 bg-[#fcfaf6] border border-emerald-300 rounded-xl space-y-4 mt-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e8e2d8]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Tracking Code</span>
                <code className="text-xl font-mono font-extrabold text-[#132e22]">
                  {trackingResult.report.trackingCode}
                </code>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(trackingResult.report.status)}
                {trackingResult.isMock ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                    Demo Mode
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-700" /> API Verified
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong>Category:</strong> {getCategoryLabel(trackingResult.report.category)}
              </p>
              <p className="leading-relaxed">
                <strong>Description:</strong> {trackingResult.report.description}
              </p>
              {trackingResult.report.createdAt && (
                <p className="text-slate-500">
                  <strong>Date Logged:</strong> {new Date(trackingResult.report.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backend Technical Status Disclaimer */}
      <div className="bg-[#f4eedf] p-3.5 rounded-xl border border-[#d8caa8] flex items-start space-x-2.5 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900 font-bold">Sample Community Log Notice:</strong>
          <span>Below are sample obstacle reports logged in Ahmedabad. Real user submission tracking uses `GET /api/reports/track/:trackingCode` above.</span>
        </div>
      </div>

      {/* Sample Reports List */}
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
              <button
                onClick={() => {
                  setTrackingCodeInput('REP-101');
                  handleTrackCode('REP-101');
                }}
                className="text-[11px] text-emerald-800 font-semibold hover:underline"
              >
                Track Sample Code (REP-101)
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
