// /src/components/ui/InteractiveMap.tsx
'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { siteConfig } from '@/config/client-data';

// We create a single, constant icon instance to be reused.
const DefaultIcon = L.icon({
    iconUrl: '/images/icons/marker.png',
    shadowUrl: '/images/icons/marker-shadow.png',
    iconSize: [50, 70],
    iconAnchor: [12, 41]
});

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
}

export default function InteractiveMap({ latitude, longitude }: InteractiveMapProps) {
  // --- THIS IS THE KEY FIX ---
  // We use a useEffect hook to set the default icon path. This ensures this code
  // only runs once on the client-side after the component has mounted,
  // which is a best practice for performance and avoiding server-side rendering issues.
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // The MapContainer will not render on the server, preventing errors.
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <MapContainer 
      center={[latitude, longitude]} 
      zoom={13} 
      scrollWheelZoom={false} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          {siteConfig.brandName} <br /> Our Location.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
