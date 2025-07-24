/**
 * Main index.js - Exports all modules for the Taguig Geospatial application
 */

// Core services
export { TaguigGeocodingService } from './geocodingService.js';

// Map utilities
export {
  MAP_CONFIG,
  configureLeaflet,
  initializeMap,
  createMarker,
  getPovertyColor,
  generatePopupContent
} from './mapUtils.js';

// Data processing
export {
  aggregateHouseholdData,
  filterData,
  geocodeHouseholds,
  getProcessingStats,
  needsReprocessing
} from './dataProcessor.js';

// Constants
export {
  API_CONFIG,
  EDUCATION_OPTIONS,
  LEGEND_DATA,
  INITIAL_FILTERS
} from './constants.js';

// Styles
export {
  CSS_STYLES,
  COMPONENT_STYLES
} from './styles.js';