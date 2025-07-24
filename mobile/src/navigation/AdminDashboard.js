import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import StatCard from '../components/cards/StatCard';
import HouseholdTable from './HouseholdTable';

const Dashboard = ({ role }) => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Configuration - easily switch between mock and real API
  const USE_MOCK_DATA = false; // Set to true for testing, false for real API
  const API_BASE_URL = 'http://192.168.97.118:5000'; // Change this to your actual API URL

  // TODO: Replace this with a real token from your backend login
  // For now, paste a valid JWT token here for testing
  const token = 'PASTE_YOUR_VALID_JWT_TOKEN_HERE';

  // Calculate statistics from household data
  const getDisplayData = () => {
    if (!households || households.length === 0) {
      return {
        totalHouseholds: 0,
        avgPovertyScore: 0,
        riskLevels: { Low: 0, Moderate: 0, High: 0 }
      };
    }

    const totalHouseholds = households.length;
    const avgPovertyScore = households.length > 0 
      ? (households.reduce((sum, h) => sum + (h.povertyScore || 0), 0) / households.length).toFixed(2)
      : 0;
    
    const riskLevels = households.reduce((acc, household) => {
      const risk = household.riskLevel || 'Low';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, { Low: 0, Moderate: 0, High: 0 });

    return { totalHouseholds, avgPovertyScore, riskLevels };
  };

  // Function to refresh household data from backend
  const refreshHouseholds = async () => {
    try {
      setLoading(true);
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/households', {
  headers: { Authorization: `Bearer ${token}` }
});
      if (Array.isArray(response.data)) {
        setHouseholds(response.data);
      } else if (response.data && Array.isArray(response.data.households)) {
        setHouseholds(response.data.households);
      } else {
        setHouseholds([]);
      }
      setError(null);
      setLoading(false);
    } catch (err) {
      let errorMessage = 'Failed to refresh data';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!USE_MOCK_DATA) {
                const token = getToken();
                if (token) {
                  // Optional: Call logout API
                  await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                }
              }
              
              removeToken();
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout error:', error);
              // Still logout even if API call fails
              removeToken();
              navigation.navigate('Login');
            }
          }
        }
      ]
    );
  };

  // Function to handle API errors and retry
  const handleRetry = () => {
    setError(null);
    refreshHouseholds();
  };

  useEffect(() => {
    refreshHouseholds();
  }, [role]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loadingText}>
            {USE_MOCK_DATA ? 'Loading mock data...' : 'Loading from API...'}
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          {!USE_MOCK_DATA && (
            <TouchableOpacity 
              style={[styles.retryButton, styles.mockDataButton]} 
              onPress={() => {
                // Quick switch to mock data if API fails
                Alert.alert(
                  'Switch to Mock Data?',
                  'Would you like to use mock data instead?',
                  [
                    { text: 'No', style: 'cancel' },
                    { text: 'Yes', onPress: () => {
  setError(null);
  refreshHouseholds();
} }
                  ]
                );
              }}
            >
              <Text style={styles.retryButtonText}>Use Mock Data</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const displayData = getDisplayData();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with refresh and logout buttons */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
            </Text>
            {USE_MOCK_DATA && <Text style={styles.mockIndicator}>(Mock Data)</Text>}
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.refreshButton, loading && styles.refreshButtonDisabled]}
              onPress={refreshHouseholds}
              disabled={loading}
            >
              <Text style={styles.refreshButtonText}>
                {loading ? '↻ Refreshing...' : '↻ Refresh'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard title="Total Households" value={displayData.totalHouseholds} />
          <StatCard title="Avg Poverty Score" value={displayData.avgPovertyScore} />
          <StatCard title="High Risk" value={displayData.riskLevels.High} type="high" />
          <StatCard title="Moderate Risk" value={displayData.riskLevels.Moderate} type="moderate" />
          <StatCard title="Low Risk" value={displayData.riskLevels.Low} type="low" />
        </View>

        {/* Household Table */}
        <View style={styles.tableContainer}>
          <HouseholdTable households={households} setHouseholds={setHouseholds} />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {role === 'admin' 
              ? `Managing ${displayData.totalHouseholds} household${displayData.totalHouseholds !== 1 ? 's' : ''}. Use the table above to manage household data.`
              : `Dashboard shows statistics for ${displayData.totalHouseholds} household${displayData.totalHouseholds !== 1 ? 's' : ''}. ${displayData.totalHouseholds === 0 ? 'No households found - data will appear here when households are added.' : 'Chart visualization coming soon.'}`
            }
          </Text>
        </View>

        {/* Admin Tools Section (only visible for admin) */}
        {role === 'admin' && (
          <View style={styles.adminToolsContainer}>
            <Text style={styles.adminToolsTitle}>Admin Tools</Text>
            <View style={styles.adminToolsGrid}>
              <TouchableOpacity 
                style={styles.adminToolButton}
                onPress={() => {
                  Alert.alert('Admin Tools', 'User management coming soon!');
                }}
              >
                <Text style={styles.adminToolButtonText}> Manage Users</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.adminToolButton}
                onPress={() => {
                  Alert.alert('Admin Tools', 'Reports coming soon!');
                }}
              >
                <Text style={styles.adminToolButtonText}>📊 View Reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Loading States
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  // Error States
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  mockDataButton: {
    backgroundColor: '#6B7280',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  mockIndicator: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  refreshButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonDisabled: {
    backgroundColor: '#FECACA',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  // Table Container
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  // Info Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
  },
  // Admin Tools
  adminToolsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  adminToolsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  adminToolsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  adminToolButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  adminToolButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default Dashboard;