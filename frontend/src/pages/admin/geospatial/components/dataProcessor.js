/**
 * Enhanced Data Processing utilities with smart caching and optimization
 */

export const aggregateHouseholdData = (households, geocodingService) => {
  const barangayGroups = {};

  households.forEach(household => {
    const barangayName = household.barangay ? household.barangay.name : 'Unknown';
    
    if (!barangayGroups[barangayName]) {
      barangayGroups[barangayName] = {
        households: [],
        coordinates: [],
        totalIncome: 0,
        totalPoverty: 0,
        educationCounts: {}
      };
    }

    const group = barangayGroups[barangayName];
    group.households.push(household);
    group.totalIncome += parseFloat(household.familyIncome) || 0;
    group.totalPoverty += parseFloat(household.povertyScore) || 0;
    
    const education = household.educationLevel || 'Unknown';
    group.educationCounts[education] = (group.educationCounts[education] || 0) + 1;

    if (household.latitude && household.longitude) {
      group.coordinates.push([
        parseFloat(household.latitude),
        parseFloat(household.longitude)
      ]);
    }
  });

  return Object.entries(barangayGroups).map(([barangayName, group]) => {
    const count = group.households.length;
    const avgPoverty = count > 0 ? group.totalPoverty / count : 0;
    const avgIncome = count > 0 ? group.totalIncome / count : 0;
    
    const mostCommonEducation = Object.entries(group.educationCounts)
      .reduce((prev, current) => current[1] > prev[1] ? current : prev, ['Unknown', 0])[0];

    // Calculate centroid of coordinates
    let centerCoords;
    if (group.coordinates.length > 0) {
      const avgLat = group.coordinates.reduce((sum, coord) => sum + coord[0], 0) / group.coordinates.length;
      const avgLng = group.coordinates.reduce((sum, coord) => sum + coord[1], 0) / group.coordinates.length;
      centerCoords = [avgLat, avgLng];
    } else {
      const fallback = geocodingService.getFallbackCoordinates(barangayName);
      centerCoords = fallback.coords;
    }

    return {
      barangay: barangayName,
      coordinates: centerCoords,
      poverty_score: Math.round(avgPoverty),
      income: Math.round(avgIncome),
      education: mostCommonEducation,
      householdCount: count,
      population: count * 4
    };
  });
};

export const filterData = (data, filters) => {
  return data.filter(item =>
    item.povertyScore >= filters.minPoverty &&
    item.povertyScore <= filters.maxPoverty &&
    (filters.education === 'all' || item.educationLevel === filters.education)
  );
};

/**
 * Enhanced geocoding with smart caching and progress tracking
 */
export const geocodeHouseholds = async (householdsData, geocodingService, setProgress) => {
  console.log('🔍 Starting simplified geocoding process...');
  const total = householdsData.length;
  setProgress({ current: 0, total, fromCache: false });

  const geocodedHouseholds = [];

  for (let i = 0; i < householdsData.length; i++) {
    const household = householdsData[i];
    try {
      const result = await geocodingService.geocodeAddress(
        household.address,
        household.barangay.name
      );

      geocodedHouseholds.push({
        ...household,
        latitude: result.coords[0],
        longitude: result.coords[1],
      });

      setProgress(prev => ({ ...prev, current: i + 1 }));
    } catch (error) {
      console.warn(`Geocoding failed for household ${i}:`, error);
      // Still push the household so it doesn't get lost, even if geocoding fails
      geocodedHouseholds.push(household);
    }
  }

  console.log(`✅ Simplified geocoding complete.`);
  return geocodedHouseholds;
};

/**
 * Check if households data needs re-processing
 */
export const needsReprocessing = (households, geocodingService) => {
  const cachedData = geocodingService.loadCachedHouseholdsData(households);
  return !cachedData;
};

/**
 * Get processing statistics
 */
export const getProcessingStats = (geocodingService) => {
  return geocodingService.getCacheStats();
};