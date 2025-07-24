/**
 * Constants and configuration values
 */

export const API_CONFIG = {
  BASE_URL: "http://localhost:5000",
  HOUSEHOLDS_ENDPOINT: "/api/households"
};

export const EDUCATION_OPTIONS = [
  { value: "all", label: "All Education Levels" },
  { value: "None", label: "No Formal Education" },
  { value: "Elementary", label: "Elementary" },
  { value: "High School", label: "High School" },
  { value: "College", label: "College" },
  { value: "Graduate", label: "Graduate" }
];

export const LEGEND_DATA = [
  { color: "#dc2626", label: "Very High (80-100)", emoji: "🔴" },
  { color: "#ea580c", label: "High (60-79)", emoji: "🟠" },
  { color: "#ca8a04", label: "Moderate (40-59)", emoji: "🟡" },
  { color: "#65a30d", label: "Low (20-39)", emoji: "🟢" },
  { color: "#16a34a", label: "Very Low (0-19)", emoji: "💚" }
];

export const INITIAL_FILTERS = {
  minPoverty: 0,
  maxPoverty: 100,
  education: 'all'
};