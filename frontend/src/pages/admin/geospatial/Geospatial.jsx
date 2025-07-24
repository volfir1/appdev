import React, { useRef, useEffect, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  TaguigGeocodingService,
  configureLeaflet,
  initializeMap,
  createMarker,
  filterData,
  geocodeHouseholds,
  needsReprocessing,
  getProcessingStats,
  API_CONFIG,
  EDUCATION_OPTIONS,
  LEGEND_DATA,
  INITIAL_FILTERS,
  CSS_STYLES,
  COMPONENT_STYLES
} from './components/index.js';

function GeospatialInner() {
  // Refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const geocodingService = useRef(new TaguigGeocodingService());
  // State
  const [households, setHouseholds] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeocodingFromCache, setIsGeocodingFromCache] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState({ 
    current: 0, 
    total: 0, 
    fromCache: false,
    geocodingCount: 0,
    cacheHits: 0
  });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [cacheStats, setCacheStats] = useState(null);

  // Initialize map
  useEffect(() => {
    configureLeaflet();
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = initializeMap(mapRef.current);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch and process data with smart caching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.HOUSEHOLDS_ENDPOINT}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const responseData = await response.json();
        let householdsToProcess = [];
        if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
          householdsToProcess = Object.values(responseData).flat();
        } else if (responseData && Array.isArray(responseData)) {
          householdsToProcess = responseData;
        }
        if (householdsToProcess.length > 0) {
          setHouseholds(householdsToProcess);
          const needsProcessing = needsReprocessing(householdsToProcess, geocodingService.current);
          if (!needsProcessing) {
            setIsGeocodingFromCache(true);
          }
          const geocodedHouseholds = await geocodeHouseholds(
            householdsToProcess, 
            geocodingService.current, 
            setGeocodingProgress
          );
          setAggregatedData(geocodedHouseholds);
          setCacheStats(getProcessingStats(geocodingService.current));
          if (geocodedHouseholds.length > 0 && mapInstanceRef.current) {
            const validCoords = geocodedHouseholds.filter(h => h.latitude && h.longitude).map(h => [h.latitude, h.longitude]);
            if (validCoords.length > 0) {
              const bounds = L.latLngBounds(validCoords);
              mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setGeocodingProgress({ current: 0, total: 0, fromCache: false });
        setIsGeocodingFromCache(false);
      }
    };
    fetchData();
  }, []);

  // Update markers when data or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || aggregatedData.length === 0) return;
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    // Only apply UI filters (poverty score, education), never by user/worker/barangay
    const filteredData = filterData(aggregatedData, filters);
    // Debug: Log households that are not mapped due to missing/invalid coordinates
    const notMapped = filteredData.filter(item => !item.latitude || !item.longitude);
    if (notMapped.length > 0) {
      console.warn('Households not mapped due to missing/invalid coordinates:', notMapped.map(h => ({
        id: h._id,
        address: h.address,
        barangay: h.barangay?.name,
        latitude: h.latitude,
        longitude: h.longitude
      })));
    }
    // Place all filtered (UI only) data on the map
    filteredData.forEach(item => {
      const marker = createMarker(item, mapInstanceRef.current);
      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });
  }, [aggregatedData, filters]);

  // Event handlers
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name.includes('Poverty') ? Number(value) : value
    }));
  }, []);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    geocodingService.current.clearCache();
    setCacheStats(null);
    window.location.reload();
  }, []);

  // Clear cache function
  const handleClearCache = useCallback(() => {
    console.log('Clearing cache...');
    geocodingService.current.clearCache();
    setCacheStats(getProcessingStats(geocodingService.current));
  }, []);

  // Render loading progress with enhanced information
  const renderLoadingProgress = () => {
    if (!isLoading) return null;
    const { current, total, fromCache, geocodingCount, cacheHits } = geocodingProgress;
    return (
      <div style={COMPONENT_STYLES.progressContainer}>
        <div style={COMPONENT_STYLES.progressText}>
          {fromCache ? (
            <>Using cached data - No geocoding needed!</>
          ) : total > 0 ? (
            <>Processing addresses... {geocodingCount > 0 ? `(${geocodingCount} new, ${cacheHits} cached)` : ''}</>
          ) : (
            <>⏳ Loading data...</>
          )}
        </div>
        {total > 0 && (
          <>
            <div style={COMPONENT_STYLES.progressBar}>
              <div 
                style={{
                  ...COMPONENT_STYLES.progressFill,
                  width: `${(current / total) * 100}%`
                }}
              />
            </div>
            <div style={COMPONENT_STYLES.progressDetails}>
              {current} of {total} processed
              {fromCache && <span style={{ color: '#059669' }}> (from cache)</span>}
            </div>
          </>
        )}
        {isGeocodingFromCache && (
          <div style={{
            fontSize: '0.8rem',
            color: '#059669',
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#ecfdf5',
            borderRadius: '6px',
            border: '1px solid #d1fae5'
          }}>
            🚀 Fast load: All data retrieved from cache!
          </div>
        )}
      </div>
    );
  };

  // Render cache management section
  const renderCacheManagement = () => (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={COMPONENT_STYLES.sectionTitle}>
        Cache Management
      </h2>
      {cacheStats && (
        <div style={{
          ...COMPONENT_STYLES.statsContainer,
          marginBottom: '16px'
        }}>
          <div style={COMPONENT_STYLES.statItem}>
            <span style={{ color: '#6b7280' }}>Cached Items:</span>
            <span style={COMPONENT_STYLES.statBadge}>
              {cacheStats.size}
            </span>
          </div>
          {cacheStats.lastSaved !== 'None' && (
            <div style={COMPONENT_STYLES.statItem}>
              <span style={{ color: '#6b7280' }}> Status:</span>
              <span style={{
                ...COMPONENT_STYLES.statBadge,
                backgroundColor: '#059669'
              }}>
                Cached
              </span>
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button
          onClick={handleRefresh}
          style={{
            padding: '8px 12px',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
        >
          Force Refresh
        </button>
        <button
          onClick={handleClearCache}
          style={{
            padding: '8px 12px',
            backgroundColor: '#6B7280',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4B5563'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6B7280'}
        >
          Clear Cache
        </button>
      </div>
    </div>
  );

  // Render filters section
  const renderFilters = () => (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={COMPONENT_STYLES.sectionTitle}>
         Filters
      </h2>
      <div style={{ marginBottom: '16px' }}>
        <label style={COMPONENT_STYLES.filterLabel}>
          Poverty Score Range
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            name="minPoverty"
            value={filters.minPoverty}
            onChange={handleFilterChange}
            min="0"
            max="100"
            placeholder="Min"
            style={COMPONENT_STYLES.input}
            className="enhanced-input"
          />
          <input
            type="number"
            name="maxPoverty"
            value={filters.maxPoverty}
            onChange={handleFilterChange}
            min="0"
            max="100"
            placeholder="Max"
            style={COMPONENT_STYLES.input}
            className="enhanced-input"
          />
        </div>
      </div>
      <div>
        <label style={COMPONENT_STYLES.filterLabel}>
          Education Level
        </label>
        <select
          name="education"
          value={filters.education}
          onChange={handleFilterChange}
          style={COMPONENT_STYLES.select}
          className="enhanced-input"
        >
          {EDUCATION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // Render statistics section
  const renderStatistics = () => {
    const filteredData = filterData(aggregatedData, filters);
    return (
      <div style={{ marginBottom: '24px' }}>
        <h2 style={COMPONENT_STYLES.sectionTitle}>
          Statistics
        </h2>
        <div style={COMPONENT_STYLES.statsContainer}>
          <div style={COMPONENT_STYLES.statItem}>
            <span style={{ color: '#6b7280' }}>Total Households:</span>
            <span style={COMPONENT_STYLES.statBadge}>
              {households.length}
            </span>
          </div>
          <div style={COMPONENT_STYLES.statItem}>
            <span style={{ color: '#6b7280' }}>Visible on Map:</span>
            <span style={COMPONENT_STYLES.statBadge}>
              {filteredData.length}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render legend section
  const renderLegend = () => (
    <div>
      <h2 style={COMPONENT_STYLES.sectionTitle}>
        Poverty Level Legend
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LEGEND_DATA.map(item => (
          <div key={item.color} style={COMPONENT_STYLES.legendItem} className="legend-item-enhanced interactive-hover">
            <div 
              style={{
                ...COMPONENT_STYLES.legendDot,
                backgroundColor: item.color
              }}
            />
            <span style={{ marginRight: '8px' }} className="floating-icon">{item.emoji}</span>
            <span style={{ color: '#374151', fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Render map overlay
  const renderMapOverlay = () => {
    if (!isLoading) return null;
    return (
      <div style={COMPONENT_STYLES.loadingOverlay} className="glass-effect">
        <div style={COMPONENT_STYLES.spinner}></div>
        <div style={{ 
          color: '#6b7280', 
          fontSize: '1.125rem',
          fontWeight: '500'
        }}>
          {isGeocodingFromCache ? 'Loading from cache...' : ' Initializing map...'}
        </div>
      </div>
    );
  };

  return (
    <div style={COMPONENT_STYLES.container}>
      {/* Sidebar */}
      <div style={COMPONENT_STYLES.sidebar} className="custom-scrollbar">
        <h1 style={COMPONENT_STYLES.title}>
          Taguig Geospatial
        </h1>
        {renderLoadingProgress()}
        {renderCacheManagement()}
        {renderFilters()}
        {renderStatistics()}
        {renderLegend()}
      </div>
      {/* Map Container */}
      <div style={COMPONENT_STYLES.mapContainer}>
        {renderMapOverlay()}
        {/* Map Header */}
        {/* Leaflet Map */}
        <div 
          ref={mapRef} 
          style={COMPONENT_STYLES.leafletMap}
        />
      </div>
      {/* Inject CSS */}
    </div>
  );
}

function Geospatial() {
  const role = localStorage.getItem('role');
  if (role !== 'admin' && role !== 'ngo_staff') {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#b91c1c', fontWeight: 600 }}>
        Access denied. You do not have permission to view this page.
      </div>
    );
  }
  return <GeospatialInner />;
}

export default Geospatial;