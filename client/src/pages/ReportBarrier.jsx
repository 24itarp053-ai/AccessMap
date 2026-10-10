import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AHMEDABAD_PLACES } from '../services/sampleData';

export default function ReportBarrier() {
  const [formData, setFormData] = useState({
    locationName: '',
    category: 'Broken Elevator / Lift',
    severity: 'High Barrier (Impassable)',
    description: '',
    photoUrl: '',
    isAnonymous: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.locationName || !formData.description) return;
    setSubmitted(true);
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
          <strong className="block font-bold text-slate-900">Backend Connection Status Notice:</strong>
          <span>
            This form handles client-side validation and demonstrates complete reporting workflow. Real backend persistence will be activated when your teammate's API server is linked via <code className="bg-white/80 px-1 py-0.5 rounded">VITE_API_BASE_URL</code>.
          </span>
        </div>
      </div>

      {/* Submission Success State */}
      {submitted ? (
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 text-center space-y-4 shadow-md">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Barrier Report Form Validated</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Thank you! Your report for <strong>"{formData.locationName}"</strong> has been processed on the frontend.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  locationName: '',
                  category: 'Broken Elevator / Lift',
                  severity: 'High Barrier (Impassable)',
                  description: '',
                  photoUrl: '',
                  isAnonymous: false,
                });
              }}
              className="px-5 py-2.5 bg-[#132e22] text-white text-xs font-semibold rounded-xl hover:bg-[#1b4332] transition"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-8 shadow-md space-y-6">
          
          {/* Location Picker / Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Location / Place Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Kalupur Railway Station Platform 2 or Ashram Road Walkway"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
            </div>
            {/* Suggestions */}
            <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-slate-500">
              <span className="font-semibold">Quick select:</span>
              {AHMEDABAD_PLACES.slice(0, 3).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setFormData({ ...formData, locationName: p.name })}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Barrier Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Barrier Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
            >
              <option>Broken Elevator / Lift</option>
              <option>Missing Wheelchair Ramp</option>
              <option>Steep Stairs Without Handrails</option>
              <option>Blocked Sidewalk / Construction Obstacle</option>
              <option>Inaccessible Restroom</option>
              <option>Damaged Tactile Ground Paving</option>
              <option>Other Urban Obstacle</option>
            </select>
          </div>

          {/* Severity Level */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Impact Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
            >
              <option>High Barrier (Completely Impassable for Wheelchairs)</option>
              <option>Medium Barrier (Requires Assistance to Bypass)</option>
              <option>Low Barrier (Minor Inconvenience / Warning)</option>
              <option>Positive Feature Update (New Ramp Installed)</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the exact location of the obstacle, severity, and any safe detour alternative if known..."
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
            ></textarea>
          </div>

          {/* Photo Attachment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Photo URL / Image Attachment (Optional)
            </label>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#132e22] hover:bg-[#1b4332] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Validate & Submit Barrier Report</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
