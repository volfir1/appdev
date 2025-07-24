/**
 * Clean Professional CSS for Taguig Geospatial Application
 * Focused on usability, performance, and professional appearance
 */

export const CSS_STYLES = `
  /* Essential Animations - Reduced and purposeful */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Enhanced Leaflet Controls */
  .leaflet-container {
    font-family: 'Inter', system-ui, sans-serif;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    border-radius: 6px !important;
    overflow: hidden;
  }
  
  .leaflet-control-zoom a {
    background: #ef4444 !important;
    color: white !important;
    border: none !important;
    font-weight: 500 !important;
    transition: background-color 0.2s ease !important;
  }
  
  .leaflet-control-zoom a:hover {
    background: #dc2626 !important;
  }
  
  /* Clean Popup Styling */
  .custom-popup .leaflet-popup-content-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    padding: 0;
  }
  
  .custom-popup .leaflet-popup-tip {
    background: white;
    border: 1px solid #e5e7eb;
  }
  
  .custom-popup .leaflet-popup-close-button {
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    right: 8px;
    top: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    transition: background-color 0.2s ease;
  }
  
  .custom-popup .leaflet-popup-close-button:hover {
    background: #dc2626;
  }
  
  /* Professional Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  /* Clean Input Focus */
  .enhanced-input:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }
  
  /* Professional Card Hover */
  .interactive-card {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .interactive-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Clean Shadows */
  .shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
  .shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); }
  .shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
  
  /* Loading States */
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid #f3f4f6;
    border-top: 2px solid #ef4444;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .custom-popup .leaflet-popup-content-wrapper {
      border-radius: 6px;
    }
  }
`;

export const COMPONENT_STYLES = {
  // Main Container - Clean and Professional
  container: {
    display: 'flex',
    height: 'calc(100vh - 60px)',
    fontFamily: "'Inter', system-ui, sans-serif",
    backgroundColor: '#f8fafc',
    color: '#374151',
    position: 'relative'
  },
  
  // Clean Sidebar
  sidebar: {
    width: '320px',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    padding: '24px',
    overflowY: 'auto',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    animation: 'slideIn 0.3s ease-out',
    position: 'relative',
    zIndex: 10,
    flexShrink: 0
  },
  
  // Professional Title
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#1f2937',
    borderBottom: '2px solid #ef4444',
    paddingBottom: '8px',
    letterSpacing: '-0.025em'
  },
  
  // Clean Progress Container
  progressContainer: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  
  progressText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  
  progressFill: {
    backgroundColor: '#ef4444',
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  
  progressDetails: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '4px',
    fontWeight: '500'
  },
  
  // Professional Section Titles
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  // Clean Form Elements
  filterLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    color: '#374151'
  },
  
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    color: '#374151',
    cursor: 'pointer'
  },
  
  // Professional Statistics
  statsContainer: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  
  statBadge: {
    fontWeight: '600',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    backgroundColor: '#ef4444'
  },
  
  // Clean Legend Items
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  
  legendDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginRight: '12px',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    flexShrink: 0
  },
  
  // Professional Map Container
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8fafc',
    minWidth: 0,
    overflow: 'hidden'
  },
  
  // Clean Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '16px'
  },
  
  loadingText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  
  // Professional Map Header
  mapHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  
  mapHeaderContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  mapTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  
  mapInstruction: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '400'
  },
  
  // Clean Leaflet Map
  leafletMap: {
    width: '100%',
    height: '100%',
    paddingTop: '72px',
    zIndex: 1
  },
  
  // Professional Buttons
  button: {
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  buttonPrimary: {
    backgroundColor: '#ef4444',
    color: 'white'
  },
  
  buttonSecondary: {
    backgroundColor: '#6b7280',
    color: 'white'
  },
  
  // Clean spacing utilities
  mb16: { marginBottom: '16px' },
  mb24: { marginBottom: '24px' },
  mt16: { marginTop: '16px' },
  mt24: { marginTop: '24px' },
  
  // Professional text utilities
  textSm: { fontSize: '0.875rem' },
  textBase: { fontSize: '1rem' },
  textLg: { fontSize: '1.125rem' },
  textXl: { fontSize: '1.25rem' },
  
  fontMedium: { fontWeight: '500' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  
  // Color utilities
  textGray600: { color: '#6b7280' },
  textGray900: { color: '#1f2937' },
  textRed600: { color: '#dc2626' }
};