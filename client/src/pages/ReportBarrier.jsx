import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  Database
} from 'lucide-react';
import { submitReport, REPORT_CATEGORIES } from '../services/reportService';
import { AHMEDABAD_PLACES } from '../services/sampleData';

export default function ReportBarrier() {
  const [formData, setFormData] = useState({
    category: 'wheelchair_access',
    description: '',
    photoUrl: '',
    placeId: '',
    locationName: '',
    latitude: '',
    longitude: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-validation check
    if (!formData.description || formData.description.trim().length < 10) {
      setErrorMsg('Description is required and must be at least 10 characters long.');
      return;
    }

    if (formData.description.trim().length > 1000) {
      setErrorMsg('Description must not exceed 1000 characters.');
      return;
    }

    if (formData.photoUrl && formData.photoUrl.trim()) {
      const url = formData.photoUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setErrorMsg('Photo URL must start with http:// or https://');
        return;
      }
    }

    setLoading(true);

    const payload = {
      description: formData.description.trim(),
      category: formData.category,
      photoUrl: formData.photoUrl.trim() || undefined,
      placeId: formData.placeId || undefined,
    };

    if (formData.latitude && formData.longitude) {
      const latNum = parseFloat(formData.latitude);
      const lngNum = parseFloat(formData.longitude);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        payload.location = { latitude: latNum, longitude: lngNum };
      }
    }

    const res = await submitReport(payload);
    setLoading(false);

    if (res.success) {
      setSubmissionResult(res);
    } else {
      setErrorMsg(res.error || 'Failed to submit report. Please check your inputs.');
    }
  };

  const handleCopyCode = () => {
    if (submissionResult?.trackingCode) {
      navigator.clipboard.writeText(submissionResult.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 bg-[#fcfaf6]">

      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-800" />
          <span>Community Obstacle Flagging</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Report an Accessibility Barrier
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto font-light">
          Help make Ahmedabad navigable for everyone. Flag broken elevators, missing ramps, blocked footpaths, or high steps.
        </p>
      </div>

      {/* Backend Technical Status Banner */}
      <div className="bg-[#f4eedf] p-4 rounded-xl border border-[#d8caa8] flex items-start space-x-3 text-xs text-slate-800">
        <Info className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-slate-900">Backend API Specification Notice (`POST /api/reports`):</strong>
          <span>
            Connected to official report submission endpoints. If local backend server is running on <code className="bg-white/80 px-1 py-0.5 rounded">http://localhost:5000</code>, reports will save directly. Offline demo mode generates a trackable code.
          </span>
        </div>
      </div>

      {/* Submission Success State */}
      {submissionResult ? (
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 text-center space-y-6 shadow-md">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {submissionResult.isMock ? 'Demo Mode Submission' : 'Backend Submission Successful'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Barrier Report Submitted!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your report has been logged. Use the unique tracking code below to check verification updates.
            </p>
          </div>

          {/* Tracking Code Display Box */}
          <div className="p-6 bg-[#fcfaf6] border border-[#e8e2d8] rounded-xl max-w-md mx-auto space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Your Official Tracking Code</span>
            <div className="flex items-center justify-center space-x-3">
              <code className="text-2xl font-mono font-extrabold text-[#132e22] tracking-wider bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-xs">
                {submissionResult.trackingCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                title="Copy tracking code"
              >
                {copiedCode ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copiedCode && <span className="text-xs text-emerald-700 font-semibold block">Copied to clipboard!</span>}
          </div>

          {submissionResult.isMock && (
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 max-w-md mx-auto">
              {submissionResult.message}
            </p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/my-reports?code=${submissionResult.trackingCode}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#132e22] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              <span>Track Report Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setSubmissionResult(null);
                setFormData({
                  category: 'wheelchair_access',
                  description: '',
                  photoUrl: '',
                  placeId: '',
                  locationName: '',
                  latitude: '',
                  longitude: '',
                });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-8 shadow-md space-y-6">

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Barrier Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Barrier Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
            >
              {REPORT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.value})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">10 – 1000 chars</span>
            </div>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the exact obstacle, location, severity, and any safe detour alternative if known (minimum 10 characters)..."
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
            ></textarea>
          </div>

          {/* Optional Location Name & Coordinates */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Location / Associated Place (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g. Kalupur Railway Station Platform 2"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
                />
              </div>

              <select
                value={formData.placeId}
                onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              >
                <option value="">-- Link Known Place ID --</option>
                {AHMEDABAD_PLACES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Coordinates Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Latitude (Optional)</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="23.0225"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Longitude (Optional)</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="72.5714"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Photo URL Attachment Input */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Photo URL (Optional HTTP/HTTPS Link)
              </label>
              <span className="text-[11px] text-slate-400">Max 2048 chars</span>
            </div>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-example.jpg"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Note: The backend API accepts web image URLs (`photoUrl`). Direct local file uploads are not supported.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#132e22] hover:bg-[#1b4332] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Report to API...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Submit Barrier Report (`POST /api/reports`)</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
