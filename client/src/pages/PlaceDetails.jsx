import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Check,
  Info,
  Clock,
  Layers,
  Loader2,
  Database
} from 'lucide-react';
import { getPlaceById } from '../services/placeService';
import { SAMPLE_BARRIER_REPORTS } from '../services/sampleData';

export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('mock');

  useEffect(() => {
    async function loadPlaceDetail() {
      setLoading(true);
      const result = await getPlaceById(id);
      setPlace(result.place);
      setDataSource(result.source || 'mock');
      setLoading(false);
    }
    loadPlaceDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-800 mx-auto" />
        <p className="text-sm font-semibold text-slate-700">Loading location details...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="font-serif text-2xl font-bold text-slate-900">Location Not Found</h1>
        <p className="text-sm text-slate-600">The requested place could not be located.</p>
        <Link
          to="/map"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-emerald-900 bg-[#f4eedf] px-4 py-2 rounded-xl border border-[#d8caa8]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Interactive Map</span>
        </Link>
      </div>
    );
  }

  const relatedReports = SAMPLE_BARRIER_REPORTS.filter((r) => {
    if (!r.locationName || !place.name) return false;
    return r.locationName.toLowerCase().includes(place.name.toLowerCase()) ||
           place.name.toLowerCase().includes(r.locationName.toLowerCase());
  });

  const scoreDisplay = place.accessibilityScore !== null
    ? `Accessibility Score: ${place.accessibilityScore}/100`
    : 'Accessibility Score: N/A';

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 bg-[#fcfaf6]">

      {/* Top Back Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/map"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-emerald-900 hover:text-emerald-700 bg-[#f4eedf] px-3.5 py-1.5 rounded-lg border border-[#d8caa8] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interactive Map</span>
        </Link>

        {dataSource === 'backend' ? (
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-700" /> Backend API Record (`/places/${place._id || place.id}`)
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
            Sample Community Record
          </span>
        )}
      </div>

      {/* Main Place Header Card */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-md overflow-hidden">

        {/* Cover Image Banner */}
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-700/90 text-white text-xs font-bold rounded-md backdrop-blur-xs">
                {place.category}
              </span>
              <span className="px-3 py-1 bg-slate-900/90 text-white text-xs font-bold rounded-md backdrop-blur-xs">
                {scoreDisplay}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">{place.name}</h1>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              {place.address}
            </p>
          </div>
        </div>

        {/* Place Body Information */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Description */}
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">About this Location</h2>
            <p className="text-sm text-slate-700 leading-relaxed font-light">{place.description}</p>
          </div>

          {/* Accessibility Notes if available */}
          {place.accessibilityNotes && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">Accessibility Notes:</strong>
              <p>{place.accessibilityNotes}</p>
            </div>
          )}

          {/* Verified Accessibility Features Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="font-serif text-xl font-bold text-slate-900">Accessibility Feature Checklist</h2>

            {(!place.features || place.features.length === 0) ? (
              <div className="p-4 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 text-xs italic">
                No specific accessibility feature details recorded for this venue yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      feature.available
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {feature.available ? (
                        <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-sm font-semibold">{feature.label}</span>
                    </div>
                    {feature.note && (
                      <span className="text-xs text-slate-500 italic bg-white px-2 py-0.5 rounded border border-slate-200">
                        {feature.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-xl shadow-xs transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Barrier at this Location</span>
            </Link>

            <span className="text-xs text-slate-500 italic">
              Record Status: {place.dataStatus}
            </span>
          </div>

        </div>

      </div>

      {/* Related Barrier Reports Log */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-700" />
          <span>Report Log for {place.name}</span>
        </h2>

        {relatedReports.length === 0 ? (
          <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-sm flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>No active physical barriers currently flagged at this location.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {relatedReports.map((report) => (
              <div key={report.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full">
                    {report.severity}
                  </span>
                  <span className="text-xs text-slate-500">{report.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{report.title}</h3>
                <p className="text-xs text-slate-600">{report.description}</p>
                <p className="text-[11px] text-slate-500">Submitted by: {report.reportedBy}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
