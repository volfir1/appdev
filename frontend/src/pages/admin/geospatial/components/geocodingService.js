/**
 * Enhanced Taguig Geocoding Service with Persistent Caching
 * Prevents unnecessary geocoding on repeat visits
 */

export class TaguigGeocodingService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheKey = 'taguig_geocoding_cache';
    this.householdsCacheKey = 'taguig_households_cache';
    this.cacheVersion = '1.0'; // Increment to invalidate old caches
    this.maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    this.taguigBounds = { 
      north: 14.567, 
      south: 14.480, 
      east: 121.090, 
      west: 121.020 
    };
    
    // Reference coordinates with confidence scores
    this.referenceCoords = {
      "Bagumbayan": { coords: [14.5208, 121.045], confidence: 0.9 },
      "Bambang": { coords: [14.518, 121.038], confidence: 0.8 },
      "Fort Bonifacio": { coords: [14.5508, 121.0510], confidence: 0.95 },
      "Central Bicutan": { coords: [14.502, 121.048], confidence: 0.85 },
      "Santa Ana": { coords: [14.552, 121.072], confidence: 0.9 },
      "Ibayo-Tipas": { coords: [14.543, 121.068], confidence: 0.8 },
      "Calzada": { coords: [14.516, 121.042], confidence: 0.8 },
      "Hagonoy": { coords: [14.52, 121.03], confidence: 0.8 },
      "Napindan": { coords: [14.522, 121.032], confidence: 0.8 },
      "San Miguel": { coords: [14.55, 121.068], confidence: 0.8 },
      "Tuktukan": { coords: [14.548, 121.066], confidence: 0.8 },
      "Ususan": { coords: [14.53, 121.06], confidence: 0.8 },
      "Wawa": { coords: [14.542, 121.068], confidence: 0.8 },
      "Ligid-Tipas": { coords: [14.538, 121.072], confidence: 0.8 },
      "Palingon": { coords: [14.535, 121.064], confidence: 0.8 },
      "Lower Bicutan": { coords: [14.498, 121.048], confidence: 0.8 },
      "New Lower Bicutan": { coords: [14.5, 121.05], confidence: 0.8 },
      "Upper Bicutan": { coords: [14.505, 121.045], confidence: 0.8 },
      "Western Bicutan": { coords: [14.502, 121.042], confidence: 0.8 },
      "Central Signal Village": { coords: [14.515, 121.052], confidence: 0.8 },
      "North Signal Village": { coords: [14.518, 121.054], confidence: 0.8 },
      "South Signal Village": { coords: [14.512, 121.052], confidence: 0.8 },
      "Katuparan": { coords: [14.518, 121.058], confidence: 0.8 },
      "Maharlika Village": { coords: [14.522, 121.062], confidence: 0.8 },
      "Pinagsama": { coords: [14.512, 121.038], confidence: 0.8 },
      "North Daang Hari": { coords: [14.5, 121.038], confidence: 0.8 },
      "South Daang Hari": { coords: [14.498, 121.036], confidence: 0.8 },
      "Tanyag": { coords: [14.5, 121.042], confidence: 0.8 }
    };

    // Load cached data on initialization
    this.loadCacheFromStorage();
  }

  /**
   * Load cached geocoding results from localStorage
   */
  loadCacheFromStorage() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const { data, timestamp, version } = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is valid (not expired and correct version)
        if (now - timestamp < this.maxCacheAge && version === this.cacheVersion) {
          // Convert array back to Map
          this.memoryCache = new Map(data);
          console.log(`Loaded ${this.memoryCache.size} cached geocoding results`);
        } else {
          console.log('Cache expired or version mismatch, clearing...');
          this.clearCache();
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
      this.clearCache();
    }
  }

  /**
   * Save current cache to localStorage
   */
  saveCacheToStorage() {
    try {
      const cacheData = {
        data: Array.from(this.memoryCache.entries()),
        timestamp: Date.now(),
        version: this.cacheVersion
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      console.log(`💾 Saved ${this.memoryCache.size} geocoding results to cache`);
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.memoryCache.clear();
    localStorage.removeItem(this.cacheKey);
    localStorage.removeItem(this.householdsCacheKey);
    console.log('🗑️ Cache cleared');
  }

  /**
   * Check if households data has changed (by comparing data hash)
   */
  generateDataHash(households) {
    const keys = households.map(h => `${h.id || h.address}_${h.barangay}`).sort();
    return btoa(keys.join('|')).substring(0, 20);
  }

  /**
   * Cache processed household data
   */
  cacheHouseholdsData(households, processed) {
    try {
      const dataHash = this.generateDataHash(households);
      const cacheData = {
        households: processed,
        hash: dataHash,
        timestamp: Date.now(),
        version: this.cacheVersion
      };
      localStorage.setItem(this.householdsCacheKey, JSON.stringify(cacheData));
      console.log(' Cached processed household data');
    } catch (error) {
      console.warn('Failed to cache household data:', error);
    }
  }

  /**
   * Load cached household data if available and valid
   */
  loadCachedHouseholdsData(households) {
    try {
      const cached = localStorage.getItem(this.householdsCacheKey);
      if (!cached) return null;

      const { households: cachedHouseholds, hash, timestamp, version } = JSON.parse(cached);
      const now = Date.now();
      const currentHash = this.generateDataHash(households);

      // Check if cache is valid
      if (now - timestamp < this.maxCacheAge && 
          version === this.cacheVersion && 
          hash === currentHash) {
        console.log(' Using cached household data');
        return cachedHouseholds;
      } else {
        console.log(' Household data changed or cache expired');
        return null;
      }
    } catch (error) {
      console.warn('Failed to load cached household data:', error);
      return null;
    }
  }

  async geocodeAddress(address, barangay) {
    const cacheKey = `${address}_${barangay}`;
    
    // Check memory cache first
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey);
    }

    try {
      const result = await this.tryMultipleGeocoders(address, barangay);
      
      // Cache the result
      this.memoryCache.set(cacheKey, result);
      
      // Periodically save to localStorage (every 10 items)
      if (this.memoryCache.size % 10 === 0) {
        this.saveCacheToStorage();
      }
      
      return result;
    } catch (error) {
      console.warn(`Geocoding failed for ${address}, ${barangay}:`, error);
      const fallback = this.getFallbackCoordinates(barangay);
      
      // Cache fallback results too
      this.memoryCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  async tryMultipleGeocoders(address, barangay) {
    const queries = this.buildQueries(address, barangay);
    
    for (const query of queries) {
      try {
        const result = await this.nominatimGeocode(query);
        if (result && this.isWithinTaguig(result.coords)) {
          return { ...result, source: 'nominatim' };
        }
      } catch (error) {
        console.warn(`Nominatim failed for query: ${query}`, error);
      }
    }

    return this.getFallbackCoordinates(barangay);
  }

  buildQueries(address, barangay) {
    const cleanAddress = address?.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    return [
      `${cleanAddress}, ${barangay}, Taguig City, Metro Manila, Philippines`,
      `${barangay}, Taguig City, Philippines`,
      `${cleanAddress}, Taguig, Philippines`,
      `${barangay}, Taguig, Metro Manila`
    ].filter(q => q.length > 10);
  }

  async nominatimGeocode(query) {
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&format=json&limit=1&` +
      `countrycodes=ph&addressdetails=1`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'TaguigGeoApp/1.0' }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (data.length === 0) return null;

    const result = data[0];
    return {
      coords: [parseFloat(result.lat), parseFloat(result.lon)],
      confidence: this.calculateConfidence(result, query),
      address: result.display_name
    };
  }

  calculateConfidence(result, query) {
    const address = result.display_name.toLowerCase();
    const queryLower = query.toLowerCase();
    
    let score = 0.5;
    
    if (address.includes('taguig')) score += 0.3;
    if (address.includes('metro manila')) score += 0.1;
    if (queryLower.split(',').some(part => address.includes(part.trim()))) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  isWithinTaguig(coords) {
    const [lat, lng] = coords;
    return lat >= this.taguigBounds.south && lat <= this.taguigBounds.north &&
           lng >= this.taguigBounds.west && lng <= this.taguigBounds.east;
  }

  getFallbackCoordinates(barangay) {
    const reference = this.referenceCoords[barangay];
    if (reference) {
      return {
        coords: reference.coords,
        confidence: reference.confidence,
        source: 'reference'
      };
    }
    
    return {
      coords: [14.5176, 121.0509],
      confidence: 0.3,
      source: 'default'
    };
  }

  async reverseGeocode(lat, lng) {
    const cacheKey = `reverse_${lat}_${lng}`;
    
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey);
    }

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`;

      const response = await fetch(url, {
        headers: { 'User-Agent': 'TaguigGeoApp/1.0' }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const result = {
        address: data.display_name,
        barangay: this.extractBarangay(data.address),
        confidence: 0.8
      };

      this.memoryCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      const fallback = { address: 'Unknown location', barangay: 'Unknown', confidence: 0.1 };
      this.memoryCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  extractBarangay(addressComponents) {
    const barangayFields = ['suburb', 'neighbourhood', 'village', 'hamlet'];
    for (const field of barangayFields) {
      if (addressComponents[field]) {
        return addressComponents[field];
      }
    }
    return 'Unknown';
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.memoryCache.size,
      hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0,
      lastSaved: localStorage.getItem(this.cacheKey) ? 'Available' : 'None'
    };
  }

  /**
   * Force save current cache to storage
   */
  forceSaveCache() {
    this.saveCacheToStorage();
  }
}