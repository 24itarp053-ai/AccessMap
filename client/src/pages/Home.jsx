import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Eye, 
  Sliders, 
  Check, 
  AlertTriangle,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AHMEDABAD_PLACES, SAMPLE_BARRIER_REPORTS } from '../services/sampleData';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState(AHMEDABAD_PLACES[0]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#fcfaf6]">
      
      {/* Editorial Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#e8e2d8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#132e22]/10 border border-[#132e22]/20 text-[#132e22] text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Urban Accessibility Initiative • Ahmedabad</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#121824] leading-[1.08]">
                Mapping an inclusive, <br className="hidden sm:inline" />
                <span className="italic text-emerald-900 underline decoration-amber-500/40 decoration-wavy underline-offset-8">barrier-free</span> Ahmedabad.
              </h1>

              {/* Platform Description */}
              <p className="text-lg sm:text-xl text-slate-700 font-light leading-relaxed max-w-2xl">
                AccessMap provides real-time community mapping for wheelchair users, senior citizens, and pedestrians in Ahmedabad. Discover verified ramp access, step-free transit, and report obstacles across public spaces.
              </p>

              {/* Call To Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/map"
                  className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-[#132e22] hover:bg-[#1b4332] text-[#fcfaf6] font-semibold text-base rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-800"
                >
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>Explore Accessibility Map</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/report"
                  className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-[#f4eedf] hover:bg-[#ebd9bd] text-[#121824] font-semibold text-base rounded-xl border border-[#d8caa8] transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-700"
                >
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                  <span>Report a Barrier</span>
                </Link>
              </div>

              {/* Sample Data Disclaimer Notice */}
              <div className="pt-4 flex items-center space-x-2 text-xs text-slate-600 bg-[#f4eedf]/60 p-3 rounded-lg border border-[#e8e2d8]">
                <Info className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>
                  <strong>Civic Demo Notice:</strong> Displaying sample community locations and barrier logs for Ahmedabad while backend sync is finalized.
                </span>
              </div>

            </div>

            {/* Right Interactive Hero Map Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xl overflow-hidden p-2 relative">
                
                {/* Header inside Card */}
                <div className="p-3 bg-[#fcfaf6] rounded-xl border border-[#e8e2d8] mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Map Preview</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Sample Data
                  </span>
                </div>

                {/* Leaflet Map Preview Window */}
                <div className="h-72 w-full rounded-xl overflow-hidden border border-[#e8e2d8] relative">
                  <MapContainer
                    center={[selectedPlace.lat, selectedPlace.lng]}
                    zoom={14}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[selectedPlace.lat, selectedPlace.lng]}>
                      <Popup>
                        <strong className="text-xs">{selectedPlace.name}</strong>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Selected Place Quick Details Card */}
                <div className="p-4 bg-white space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{selectedPlace.name}</h3>
                      <p className="text-xs text-slate-500">{selectedPlace.category} • Ahmedabad</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg">
                      Score: {selectedPlace.accessibilityScore}/100
                    </span>
                  </div>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPlace.features.slice(0, 3).map((feat, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium flex items-center gap-1">
                        {feat.available ? <Check className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {feat.label}
                      </span>
                    ))}
                  </div>

                  {/* Location Selector Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Select location:</span>
                    <div className="flex space-x-1">
                      {AHMEDABAD_PLACES.slice(0, 3).map((p, i) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPlace(p)}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                            selectedPlace.id === p.id 
                              ? 'bg-[#132e22] text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Loc #{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How AccessMap Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#121824]">
            How AccessMap Serves the Community
          </h2>
          <p className="text-base text-slate-600 font-light">
            Empowering citizens to navigate public spaces with confidence while crowdsourcing urban obstacle resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-[#e8e2d8] shadow-xs space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-center font-bold text-lg font-serif">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Discover & Navigate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore step-free transit stations, parks, markets, and public venues in Ahmedabad mapped with verified accessibility features.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e8e2d8] shadow-xs space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold text-lg font-serif">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Flag Urban Barriers</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Report broken elevators, missing ramps, blocked footpaths, or high steps directly with location pins and photo updates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e8e2d8] shadow-xs space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-bold text-lg font-serif">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Community Verification</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Community verifiers review reports, coordinate with local authorities, and track obstacle resolution for civic transparency.
            </p>
          </div>

        </div>
      </section>

      {/* Accessibility Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#132e22] text-[#fcfaf6] rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-emerald-800">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Essential Features</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
                Mapped Accessibility Categories
              </h2>
            </div>
            <p className="text-sm text-emerald-200/90 max-w-md font-light">
              Clear visual iconography helps users identify suitable facilities before traveling across the city.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Wheelchair Ramps</h4>
              <p className="text-xs text-emerald-200/80">Step-free incline entries with safety handrails.</p>
            </div>

            <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Lifts & Elevators</h4>
              <p className="text-xs text-emerald-200/80">Platform lifts at transit stations and public buildings.</p>
            </div>

            <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Tactile Paving</h4>
              <p className="text-xs text-emerald-200/80">Textured ground blocks for visually impaired navigation.</p>
            </div>

            <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="w-8 h-8 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Accessible Restrooms</h4>
              <p className="text-xs text-emerald-200/80">Wide doorframes with grab bars and step-free entry.</p>
            </div>

          </div>

        </div>
      </section>

      {/* Recent Community Reports Section (Sample Data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Sample Community Submissions</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#121824] mt-1">
              Recent Barrier Reports
            </h2>
          </div>
          <Link
            to="/report"
            className="text-sm font-semibold text-emerald-900 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Submit a New Report</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_BARRIER_REPORTS.map((report) => (
            <div 
              key={report.id}
              className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    report.severity.includes('High') 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : report.severity.includes('Medium')
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {report.severity}
                  </span>
                  <span className="text-xs text-slate-400">{report.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-serif">{report.title}</h3>
                <p className="text-xs text-[#132e22] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  {report.locationName}
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Status: <strong className="text-slate-800">{report.status}</strong></span>
                <span className="italic text-slate-400">Sample Data</span>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
