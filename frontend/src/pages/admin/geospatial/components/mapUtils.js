/**
 * Map Utilities for Leaflet map management and marker creation
 */

import L from 'leaflet';

export const MAP_CONFIG = {
  CENTER: [14.5176, 121.0509],
  ZOOM: 12,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_ATTRIBUTION: '© OpenStreetMap contributors',
  MAX_ZOOM: 18
};

// Professional icon configurations for different poverty levels
export const POVERTY_ICONS = {
  VERY_HIGH: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  },
  HIGH: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  },
  MODERATE: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  },
  LOW: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  },
  VERY_LOW: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
};

// Alternative: Custom SVG icons for more modern look
export const createCustomIcon = (color, povertyLevel) => {
  const size = povertyLevel >= 80 ? 35 : povertyLevel >= 60 ? 30 : 25;
  const iconSvg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white" opacity="0.8"/>
      ${povertyLevel >= 80 ? '<circle cx="12" cy="12" r="2" fill="white"/>' : ''}
    </svg>
  `;
  
  return L.divIcon({
    html: iconSvg,
    className: 'custom-poverty-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// House-shaped icons for household data
export const createHouseIcon = (color, size = 'medium') => {
  const dimensions = size === 'large' ? 40 : size === 'small' ? 30 : 35;
  const houseSvg = `
    <svg width="${dimensions}" height="${dimensions}" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5">
      <path d="M3 9.5L12 2l9 7.5v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  `;
  
  return L.divIcon({
    html: houseSvg,
    className: 'house-marker',
    iconSize: [dimensions, dimensions],
    iconAnchor: [dimensions/2, dimensions],
    popupAnchor: [0, -dimensions]
  });
};

export const configureLeaflet = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

export const initializeMap = (container) => {
  if (!container || container._leaflet_id) return;
  
  const map = L.map(container, {
    center: MAP_CONFIG.CENTER,
    zoom: MAP_CONFIG.ZOOM,
    zoomControl: true
  });
  
  L.tileLayer(MAP_CONFIG.TILE_URL, {
    attribution: MAP_CONFIG.TILE_ATTRIBUTION,
    maxZoom: MAP_CONFIG.MAX_ZOOM
  }).addTo(map);
  
  return map;
};

export const createMarker = (item, map, iconType = 'house') => {
  const color = getPovertyColor(item.povertyScore);
  let marker;
  const coordinates = [item.latitude, item.longitude];

  if (iconType === 'house') {
    const size = item.povertyScore >= 80 ? 'large' : 
                 item.povertyScore >= 60 ? 'medium' : 'small';
    const icon = createHouseIcon(color, size);
    marker = L.marker(coordinates, { icon });
  } else {
    let iconConfig;
    if (item.povertyScore >= 80) iconConfig = POVERTY_ICONS.VERY_HIGH;
    else if (item.povertyScore >= 60) iconConfig = POVERTY_ICONS.HIGH;
    else if (item.povertyScore >= 40) iconConfig = POVERTY_ICONS.MODERATE;
    else if (item.povertyScore >= 20) iconConfig = POVERTY_ICONS.LOW;
    else iconConfig = POVERTY_ICONS.VERY_LOW;
    
    const icon = L.icon(iconConfig);
    marker = L.marker(coordinates, { icon });
  }

  marker.bindPopup(generatePopupContent(item), {
    maxWidth: 300,
    className: 'custom-popup'
  });

  return marker;
};

export const getPovertyColor = (score) => {
  if (score >= 80) return '#dc2626'; // Red
  if (score >= 60) return '#ea580c'; // Orange
  if (score >= 40) return '#ca8a04'; // Yellow
  if (score >= 20) return '#65a30d'; // Lime
  return '#16a34a'; // Green
};

export const generatePopupContent = (item) => {
  const color = getPovertyColor(item.povertyScore);
  
  return `
    <div style="font-family: system-ui, sans-serif; min-width: 250px; padding: 4px;">
      <div style="
        background: linear-gradient(135deg, ${color}20, ${color}10);
        border-left: 4px solid ${color};
        padding: 12px;
        margin: -4px;
        border-radius: 8px;
      ">
        <h4 style="
          margin: 0 0 12px; 
          font-size: 1.2rem; 
          font-weight: 700; 
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
           ${item.householdHead}
        </h4>
        
        <div style="display: grid; gap: 8px; font-size: 0.95rem;">
          <div style="
            display: flex; 
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
          ">
            <span style="color: #6b7280; font-weight: 500;"> Poverty Score:</span>
            <span style="
              color: ${color}; 
              font-weight: 700;
              background: ${color}20;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.9rem;
            ">${item.povertyScore}/100</span>
          </div>
          
          <div style="
            display: flex; 
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
          ">
            <span style=" font-weight: 500;"> Family Income:</span>
            <span style="
              
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.9rem;
            ">₱${item.familyIncome.toLocaleString()}</span>
          </div>
          
          <div style="
            display: flex; 
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
          ">
            <span style="color: #6b7280; font-weight: 500;">Barangay:</span>
            <span style="
              color: #1f2937; 
              font-weight: 600;
              background: #f3f4f6;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.9rem;
            ">${item.barangay.name}</span>
          </div>
          
          <div style="
            display: flex; 
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
          ">
            <span style="color: #6b7280; font-weight: 500;"> Education:</span>
            <span style="
              color: #1f2937; 
              font-weight: 600;
              background: #f3f4f6;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.9rem;
            ">${item.educationLevel}</span>
          </div>
          
          <div style="
            display: flex; 
            justify-content: space-between;
            align-items: center;
            padding: 6px 0 0;
          ">
            <span style="color: #6b7280; font-weight: 500;"> Address:</span>
            <span style="
              color: #1f2937; 
              font-weight: 700;
              background: #f3f4f6;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.9rem;
            ">${item.address}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};