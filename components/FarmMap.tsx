
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates } from '../types';

// Fix Marker Shadow and Default Icons for sandboxed environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-emerald.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface FarmMapProps {
  boundary: Coordinates[] | null;
  onBoundaryChange: (coords: Coordinates[]) => void;
  layerMode: 'optical' | 'sar' | 'soc';
}

const FarmMap: React.FC<FarmMapProps> = ({ boundary, onBoundaryChange, layerMode }) => {
  const [points, setPoints] = useState<Coordinates[]>(boundary || []);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (showResetConfirm) return;
        const newPoints = [...points, { lat: e.latlng.lat, lng: e.latlng.lng }];
        setPoints(newPoints);
        onBoundaryChange(newPoints);
      },
    });
    return null;
  };

  const getTileUrl = () => {
    switch(layerMode) {
      case 'sar': return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{y}/{x}{r}.png";
      case 'soc': return "https://{s}.tile.thunderforest.com/pioneer/{z}/{y}/{x}.png?apikey=607997321e254199991444d320478e87";
      default: return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }
  };

  const handleReset = () => {
    setPoints([]);
    onBoundaryChange([]);
    setShowResetConfirm(false);
  };

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer 
        center={[23.0225, 72.5714]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={getTileUrl()} attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' />
        <MapEvents />
        {points.length > 0 && (
          <>
            {points.map((p, idx) => (
              <Marker key={idx} position={[p.lat, p.lng]} icon={MarkerIcon}>
                <Tooltip permanent direction="top" className="text-[10px] p-1 font-bold">P{idx + 1}</Tooltip>
              </Marker>
            ))}
            {points.length > 2 && (
              <Polygon 
                positions={points.map(p => [p.lat, p.lng])} 
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#34d399',
                  fillOpacity: 0.4,
                  weight: 3
                }} 
              />
            )}
          </>
        )}
      </MapContainer>
      
      {/* Reset Confirmation Overlay */}
      {showResetConfirm && (
        <div className="absolute inset-0 z-[2000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-2xl space-y-4 max-w-[220px] text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </div>
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Clear all points?</p>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200"
              >
                Clear
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-[1000]">
        <button 
          onClick={() => points.length > 0 ? setShowResetConfirm(true) : null}
          className={`bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black shadow-lg border border-slate-200 transition-all active:scale-95 ${points.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
        >
          RESET
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center">
          {layerMode === 'optical' ? 'Layer 4: Optical' : layerMode === 'sar' ? 'Layer 4: Radar' : 'Layer 3: SOC Map'}
        </p>
      </div>
    </div>
  );
};

export default FarmMap;
