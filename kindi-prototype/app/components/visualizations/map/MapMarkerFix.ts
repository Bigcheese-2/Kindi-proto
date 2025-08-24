'use client';

import L from 'leaflet';

// Fix for the Leaflet default marker icons
const MapMarkerFix = () => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }

  // Override the default icon
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

export default MapMarkerFix;

