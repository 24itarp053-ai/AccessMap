import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet default icon fix for Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Center of Ahmedabad, Gujarat
const AHMEDABAD_CENTER = [23.0225, 72.5714];

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Accessibility Map — Ahmedabad</h1>
          <p className="text-xs text-slate-500">Filter by wheelchair access, ramp availability, and community barrier flags.</p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">
          OpenStreetMap Tile Engine Active
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer
          center={AHMEDABAD_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={AHMEDABAD_CENTER}>
            <Popup>
              <div className="p-1 text-slate-800">
                <strong className="block text-sm font-semibold">Sabarmati Riverfront</strong>
                <span className="text-xs text-green-600 font-medium">Wheelchair Accessible Ramp Available</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
