import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const quickActions = [
  {
    label: 'View Dashboard',
    description: 'Access analytics and insights',
    bg: '#EF4444',
    textColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    onPress: (navigation) => navigation.navigate('Login'),
  },
  {
    label: 'Map View',
    description: 'Explore geographical data',
    bg: '#FFFFFF',
    textColor: '#374151',
    arrowColor: '#9CA3AF',
    border: true,
    onPress: (navigation) => navigation.navigate('About'),
  },
];

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
      <View className="flex-1" style={{ backgroundColor: '#FFF1F2' }}>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="mt-16 mb-8">
            <Text className="text-2xl font-bold text-center mb-3" style={{ color: '#374151' }}>
              Welcome to ActOnPov
            </Text>
            <Text className="text-base text-center mb-4" style={{ color: '#6B7280' }}>
              Poverty Profiling System for Taguig City
            </Text>
            <View className="w-12 h-1 rounded-full mx-auto" style={{ backgroundColor: '#EF4444' }} />
          </View>

          {/* Stats Cards Row */}
          <View className="flex-row justify-between mb-6" style={{ gap: 12 }}>
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <Text className="text-2xl font-bold mb-1" style={{ color: '#EF4444' }}>847</Text>
              <Text className="text-xs font-medium" style={{ color: '#6B7280' }}>Households</Text>
            </View>
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <Text className="text-2xl font-bold mb-1" style={{ color: '#EF4444' }}>23</Text>
              <Text className="text-xs font-medium" style={{ color: '#6B7280' }}>Barangays</Text>
            </View>
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <Text className="text-2xl font-bold mb-1" style={{ color: '#EF4444' }}>156</Text>
              <Text className="text-xs font-medium" style={{ color: '#6B7280' }}>Priority Areas</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-lg font-semibold mb-4" style={{ color: '#374151' }}>
              Quick Actions
            </Text>
            <View style={{ gap: 12 }}>
              {quickActions.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  className={`rounded-xl p-5 flex-row items-center${action.border ? ' border' : ''}`}
                  style={{
                    backgroundColor: action.bg,
                    borderColor: action.border ? '#E5E7EB' : undefined,
                  }}
                  onPress={() => action.onPress(navigation)}
                  activeOpacity={0.9}
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold mb-1" style={{ color: action.textColor }}>
                      {action.label}
                    </Text>
                    <Text className="text-sm" style={{ color: action.bg === '#EF4444' ? '#FECACA' : '#6B7280' }}>
                      {action.description}
                    </Text>
                  </View>
                  <Text className="text-xl" style={{ color: action.arrowColor }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Features Grid */}
          <View className="mb-8">
            <Text className="text-lg font-semibold mb-4" style={{ color: '#374151' }}>
              Key Features
            </Text>
            <View style={{ gap: 16 }}>
              <View className="flex-row" style={{ gap: 12 }}>
                <View className="flex-1 rounded-xl p-5" style={{ backgroundColor: '#FFFFFF' }}>
                  <View className="w-10 h-10 rounded-lg justify-center items-center mb-3" style={{ backgroundColor: '#FEF2F2' }}>
                    <Text className="text-lg font-bold" style={{ color: '#EF4444' }}>H</Text>
                  </View>
                  <Text className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                    Household Analysis
                  </Text>
                  <Text className="text-xs leading-4" style={{ color: '#6B7280' }}>
                    Comprehensive data analysis of income and housing
                  </Text>
                </View>

                <View className="flex-1 rounded-xl p-5" style={{ backgroundColor: '#FFFFFF' }}>
                  <View className="w-10 h-10 rounded-lg justify-center items-center mb-3" style={{ backgroundColor: '#FEF2F2' }}>
                    <Text className="text-lg font-bold" style={{ color: '#EF4444' }}>D</Text>
                  </View>
                  <Text className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                    Data Analytics
                  </Text>
                  <Text className="text-xs leading-4" style={{ color: '#6B7280' }}>
                    Advanced analytics on public datasets
                  </Text>
                </View>
              </View>

              <View className="flex-row" style={{ gap: 12 }}>
                <View className="flex-1 rounded-xl p-5" style={{ backgroundColor: '#FFFFFF' }}>
                  <View className="w-10 h-10 rounded-lg justify-center items-center mb-3" style={{ backgroundColor: '#FEF2F2' }}>
                    <Text className="text-lg font-bold" style={{ color: '#EF4444' }}>M</Text>
                  </View>
                  <Text className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                    Mapping Tools
                  </Text>
                  <Text className="text-xs leading-4" style={{ color: '#6B7280' }}>
                    Interactive geospatial visualization
                  </Text>
                </View>

                <View className="flex-1 rounded-xl p-5" style={{ backgroundColor: '#FFFFFF' }}>
                  <View className="w-10 h-10 rounded-lg justify-center items-center mb-3" style={{ backgroundColor: '#FEF2F2' }}>
                    <Text className="text-lg font-bold" style={{ color: '#EF4444' }}>S</Text>
                  </View>
                  <Text className="text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                    SDG Support
                  </Text>
                  <Text className="text-xs leading-4" style={{ color: '#6B7280' }}>
                    UN Goal 1: No Poverty initiatives
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom CTA */}
          <View className="rounded-xl p-6 items-center" style={{ backgroundColor: '#FFFFFF' }}>
            <Text className="text-lg font-bold mb-2 text-center" style={{ color: '#374151' }}>
              Ready to Make Impact?
            </Text>
            <Text className="text-sm text-center mb-4 leading-5" style={{ color: '#6B7280' }}>
              Join us in building data-driven solutions for poverty reduction
            </Text>
            <TouchableOpacity 
              className="py-3 px-8 rounded-lg"
              style={{ backgroundColor: '#DC2626' }}
              onPress={() => navigation.navigate('About')}
              activeOpacity={0.9}
            >
              <Text className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Dashboard;