// Taguig City Barangays
export const TAGUIG_BARANGAYS = [
  'Bagumbayan',
  'Bambang', 
  'Calzada',
  'Central Bicutan',
  'Central Signal Village',
  'Fort Bonifacio',
  'Hagonoy',
  'Ibayo-Tipas',
  'Katuparan',
  'Ligid-Tipas',
  'Lower Bicutan',
  'Maharlika Village',
  'Napindan',
  'New Lower Bicutan',
  'North Daang Hari',
  'North Signal Village',
  'Palingon',
  'Pinagsama',
  'San Miguel',
  'Santa Ana',
  'South Daang Hari',
  'South Signal Village',
  'Tanyag',
  'Tuktukan',
  'Upper Bicutan',
  'Ususan',
  'Wawa',
  'Western Bicutan',
  'Cembo',
  'Comembo',
  'East Rembo',
  'Pembo',
  'Pitogo',
  'Post Proper Northside',
  'Post Proper Southside',
  'Rizal',
  'South Cembo',
  'West Rembo'
];

// Employment Status Options
export const EMPLOYMENT_STATUS_OPTIONS = [
  'Employed',
  'Unemployed', 
  'Self-Employed'
];

// Education Level Options
export const EDUCATION_LEVEL_OPTIONS = [
  'None',
  'Elementary',
  'High School',
  'College'
];

// Housing Type Options
export const HOUSING_TYPE_OPTIONS = [
  'Owned',
  'Rented',
  'Informal Settler'
];

// Risk Level Options
export const RISK_LEVELS = {
  HIGH: 'High',
  MODERATE: 'Moderate',
  LOW: 'Low'
};

// Risk Level Colors
export const RISK_LEVEL_COLORS = {
  [RISK_LEVELS.HIGH]: 'red',
  [RISK_LEVELS.MODERATE]: 'yellow',
  [RISK_LEVELS.LOW]: 'green'
};

// Income Thresholds for Risk Calculation
export const INCOME_THRESHOLDS = {
  LOW_RISK: 30000,
  MODERATE_RISK: 20000
};

// Service Types
export const SERVICE_TYPES = {
  WATER: 'water',
  ELECTRICITY: 'electricity',
  SANITATION: 'sanitation'
};

// Default Form Data
export const DEFAULT_FORM_DATA = {
  barangay: TAGUIG_BARANGAYS[0],
  familyIncome: '',
  employmentStatus: EMPLOYMENT_STATUS_OPTIONS[0],
  educationLevel: EDUCATION_LEVEL_OPTIONS[2], // High School
  housingType: HOUSING_TYPE_OPTIONS[0], // Owned
  accessToServices: {
    [SERVICE_TYPES.WATER]: true,
    [SERVICE_TYPES.ELECTRICITY]: true,
    [SERVICE_TYPES.SANITATION]: true
  },
  governmentAssistance: ''
};

// Common Government Assistance Programs
export const GOVERNMENT_ASSISTANCE_PROGRAMS = [
  '4Ps',
  'DSWD',
  'PhilHealth',
  'SSS',
  'GSIS',
  'Senior Citizen Pension',
  'PWD Benefits'
];

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Barangay and Family Income are required',
  INVALID_INCOME: 'Please enter a valid income amount',
  UPLOAD_FAILED: 'Failed to upload CSV file',
  DELETE_FAILED: 'Failed to delete household',
  UPDATE_FAILED: 'Failed to update household'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  HOUSEHOLD_ADDED: 'Household added successfully',
  HOUSEHOLD_UPDATED: 'Household updated successfully',
  HOUSEHOLD_DELETED: 'Household deleted successfully',
  CSV_UPLOADED: 'CSV file uploaded successfully'
};

// Table Column Headers
export const TABLE_HEADERS = {
  BARANGAY: 'Barangay',
  INCOME: 'Income',
  POVERTY_SCORE: 'Poverty Score',
  RISK_LEVEL: 'Risk Level',
  SERVICES: 'Services',
  ACTIONS: 'Actions'
};

// Statistics Card Labels
export const STATS_LABELS = {
  TOTAL_HOUSEHOLDS: 'Total Households',
  HIGH_RISK: 'High Risk',
  MODERATE_RISK: 'Moderate Risk',
  AVERAGE_INCOME: 'Average Income'
};