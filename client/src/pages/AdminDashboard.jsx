import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  ShieldCheck,
  Info,
  Check,
  ShieldAlert,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { SAMPLE_BARRIER_REPORTS } from '../services/sampleData';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [reports, setReports] = useState(SAMPLE_BARRIER_REPORTS);
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleActionDemo = (reportId, newStatus) => {
    setReports(reports.map(r => (r.id === reportId ? { ...r, status: newStatus } : r)));
    setActionFeedback(`Report #${reportId} status updated to "${newStatus}" (Demo - Local UI State Only).`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600 text-sm font-medium">Verifying user credentials...</p>
      </div>
    );
  }

  // 1. Unauthenticated Access Guard
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Access Restricted
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Authentication Required
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
              You must be signed in with an administrative account to access the Verifier & Admin Portal.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1.5 max-w-md mx-auto">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" /> Security Notice
            </p>
            <p>
              Administrative protection requires backend authentication and role validation. Frontend route guarding provides user guidance, but server-side authorization is required for real database mutations.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              Sign In to Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/map"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Non-Admin User Access Guard
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
              Insufficient Permissions
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Admin Access Required
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
              Your account <strong>{user?.email}</strong> is logged in with the <code>{user?.role || 'user'}</code> role. Access to barrier moderation tools is restricted to verified administrators.
            </p>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 text-left space-y-1 max-w-md mx-auto">
            <p className="font-semibold flex items-center gap-1.5 text-amber-900">
              <UserCheck className="w-4 h-4 shrink-0" /> Current Session Profile
            </p>
            <p><strong>Name:</strong> {user?.name || 'Contributor'}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role || 'user'}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-xs transition"
            >
              Report a Barrier
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Account Authorized View
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
              Review community reports, verify accessibility features, and moderate barrier reports in Ahmedabad.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-full border border-purple-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            Admin Role Active ({user.email})
          </span>
        </div>
      </div>

      {/* Backend Status Notice */}
      <div className="bg-[#f4eedf] p-4 rounded-xl border border-[#d8caa8] flex items-start space-x-3 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block text-slate-900 font-bold">Admin Moderation API Limitation:</strong>
          <p>
            The backend API specification currently does not include active administrative endpoints for moderation (such as updating report statuses, resolving barriers, or deleting entries).
          </p>
          <p className="text-slate-600 font-medium">
            Status update buttons below operate on local component state for UI demonstration purposes only.
          </p>
        </div>
      </div>

      {/* Feedback Alert banner if an action was clicked */}
      {actionFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{actionFeedback}</span>
          <span className="text-[10px] uppercase font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">Demo Action</span>
        </div>
      )}

      {/* Reports Table / Moderation Cards */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-md overflow-hidden">
        
        <div className="p-4 bg-[#fcfaf6] border-b border-[#e8e2d8] flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-slate-900 text-base">Community Submissions Queue</h2>
            <p className="text-xs text-slate-500 font-normal">Moderation Queue (Mock Demonstration Records)</p>
          </div>
          <span className="text-xs text-slate-600 font-semibold px-2.5 py-1 bg-slate-100 rounded-lg">
            {reports.length} Reports Logged (Demo)
          </span>
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
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleActionDemo(report.id, 'Verified Accessible')}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1 transition shadow-xs"
                    title="Demo UI action - updates local state only"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve (Demo)
                  </button>

                  <button
                    onClick={() => handleActionDemo(report.id, 'Obstacle Resolved')}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition shadow-xs"
                    title="Demo UI action - updates local state only"
                  >
                    Mark Resolved (Demo)
                  </button>

                  <button
                    onClick={() => handleActionDemo(report.id, 'Dismissed / Duplicate')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                    title="Demo UI action - updates local state only"
                  >
                    Dismiss (Demo)
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
