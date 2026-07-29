import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not loading correctly in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle smooth panning when location prop changes
const MapUpdater = ({ location }) => {
  const map = useMap();
  
  // Use primitive values for dependency tracking so it doesn't re-trigger on every parent render
  const lat = location?.lat;
  const lng = location?.lng;

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);
  return null;
};

// Component to handle map clicks for manual pin dropping
const MapClickHandler = ({ onLocationChange }) => {
  useMapEvents({
    click(e) {
      if (onLocationChange) {
        onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

const MapContainer = ({ location, onLocationChange, onAddressFetch }) => {
  const defaultLocation = { lat: 9.536989, lng: 6.465372 };
  const currentPos = (location && location.lat) ? [location.lat, location.lng] : [defaultLocation.lat, defaultLocation.lng];

  return (
    <div className="w-full h-full relative z-0">
      <LeafletMap 
        center={currentPos} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full min-h-[400px] rounded-md z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && location.lat && (
          <Marker position={currentPos} />
        )}
        <MapUpdater location={location} />
        <MapClickHandler onLocationChange={onLocationChange} />
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
