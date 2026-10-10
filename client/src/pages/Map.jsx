import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  X,
  Info,
  Loader2,
  Database
} from 'lucide-react';
import { getPlaces } from '../services/placeService';

// Custom Leaflet Icons setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to smoothly animate map camera panning
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('mock');

  useEffect(() => {
    async function loadPlacesData() {
      setLoading(true);
      const result = await getPlaces();
      const loadedPlaces = result.places || [];
      setPlaces(loadedPlaces);
      setDataSource(result.source || 'mock');
      if (loadedPlaces.length > 0) {
        // Find first place with valid coordinates if possible
        const validPlace = loadedPlaces.find((p) => typeof p.lat === 'number' && typeof p.lng === 'number');
        setSelectedPlace(validPlace || loadedPlaces[0]);
      }
      setLoading(false);
    }
    loadPlacesData();
  }, []);

  // Center map on selected place or default to Ahmedabad center
  const mapCenter = selectedPlace && typeof selectedPlace.lat === 'number' && typeof selectedPlace.lng === 'number'
    ? [selectedPlace.lat, selectedPlace.lng]
    : [23.0225, 72.5714];

  // Filter places based on search query and accessibility status filters
  const filteredPlaces = places.filter((place) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (place.name && place.name.toLowerCase().includes(query)) ||
      (place.category && place.category.toLowerCase().includes(query)) ||
      (place.address && place.address.toLowerCase().includes(query)) ||
      (place.area && place.area.toLowerCase().includes(query));

    if (selectedFilter === 'ALL') return matchesSearch;
    if (selectedFilter === 'FULLY') return matchesSearch && place.accessibilityStatus?.includes('Fully');
    if (selectedFilter === 'PARTIAL') return matchesSearch && place.accessibilityStatus?.includes('Partially');
    if (selectedFilter === 'BARRIER') return matchesSearch && place.accessibilityStatus?.includes('Inaccessible');
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] relative overflow-hidden bg-[#fcfaf6]">

      {/* Top Filter & Search Header */}
      <div className="bg-white border-b border-[#e8e2d8] px-4 py-3 z-20 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition md:hidden"
            aria-label="Toggle places list sidebar"
          >
            <Filter className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
              <span>Accessibility Map — Ahmedabad</span>
              {dataSource === 'backend' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-700" /> Live Backend API
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full">
                  Sample Data Fallback
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500">
              Interactive map displaying step-free routes & barrier locations
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'ALL'
                ? 'bg-[#132e22] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Locations ({places.length})
          </button>

          <button
            onClick={() => setSelectedFilter('FULLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'FULLY'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Fully Accessible
          </button>

          <button
            onClick={() => setSelectedFilter('PARTIAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'PARTIAL'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Partially Accessible
          </button>

          <button
            onClick={() => setSelectedFilter('BARRIER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'BARRIER'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            High Barriers
          </button>
        </div>

      </div>

      {/* Main Map + Sidebar Workspace */}
      <div className="flex-1 flex relative">

        {/* Left Places List Drawer / Sidebar */}
        <aside
          className={`absolute md:relative inset-y-0 left-0 z-20 w-full sm:w-96 bg-white border-r border-[#e8e2d8] shadow-lg md:shadow-none transform transition-transform duration-300 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 bg-[#fcfaf6]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations or categories in Ahmedabad..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Places Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
                <p className="text-xs font-semibold">Loading places from API...</p>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-500">
                <p className="text-sm font-semibold">No locations found</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting your filter or search query.</p>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlace && selectedPlace.id === place.id;
                const scoreDisplay = place.accessibilityScore !== null ? `Score ${place.accessibilityScore}` : 'Score: N/A';
                const hasValidCoords = typeof place.lat === 'number' && typeof place.lng === 'number';

                return (
                  <div
                    key={place.id || place._id}
                    onClick={() => setSelectedPlace(place)}
                    className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-800'
                        : 'border-[#e8e2d8] bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm font-serif leading-tight">
                        {place.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        place.accessibilityScore !== null && place.accessibilityScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : place.accessibilityScore !== null && place.accessibilityScore >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : place.accessibilityScore !== null
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {scoreDisplay}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{place.address}</p>

                    {!hasValidCoords && (
                      <span className="text-[10px] text-amber-700 italic block">Map coordinates unmapped</span>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span className="font-medium text-slate-700">{place.category}</span>
                      <Link
                        to={`/places/${place.id || place._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Notice */}
          <div className="p-3 bg-[#fcfaf6] border-t border-[#e8e2d8] text-[11px] text-slate-500 flex items-center justify-between">
            <span>Displaying {filteredPlaces.length} locations</span>
            <span className="text-slate-700 font-medium">
              {dataSource === 'backend' ? 'GET /api/places' : 'Mock Fallback'}
            </span>
          </div>
        </aside>

        {/* Map Display Viewport */}
        <main className="flex-1 relative h-full">
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapRecenter center={mapCenter} />

            {filteredPlaces.map((place) => {
              if (typeof place.lat !== 'number' || typeof place.lng !== 'number') return null;
              const scoreBadge = place.accessibilityScore !== null ? `${place.accessibilityScore}/100` : 'N/A';
              return (
                <Marker
                  key={place.id || place._id}
                  position={[place.lat, place.lng]}
                  eventHandlers={{
                    click: () => setSelectedPlace(place),
                  }}
                >
                  <Popup>
                    <div className="space-y-2 p-1 max-w-xs">
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-xs font-bold text-slate-900">{place.name}</strong>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          {scoreBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{place.category}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{place.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/places/${place.id || place._id}`}
                          className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          View Full Place Page <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </main>

      </div>
    </div>
  );
}
