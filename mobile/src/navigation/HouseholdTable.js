import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../css/HouseholdTableStyles';

const HouseholdTable = ({ households = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(households.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHouseholds = useMemo(
    () => households.slice(startIndex, endIndex),
    [households, startIndex, endIndex]
  );

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when households data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [households.length]);

  const renderHouseholdItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellLabel}>Barangay</Text>
        <Text style={styles.cellValue}>{item.barangay || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellLabel}>Family Income</Text>
        <Text style={styles.cellValue}>₱{item.familyIncome?.toLocaleString() || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellLabel}>Poverty Score</Text>
        <Text style={styles.cellValue}>{item.povertyScore || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellLabel}>Risk Level</Text>
        <View style={[
          styles.riskBadge,
          item.riskLevel === 'High' ? styles.riskBadgeHigh :
          item.riskLevel === 'Moderate' ? styles.riskBadgeModerate :
          styles.riskBadgeLow
        ]}>
          <Text style={[
            styles.riskText,
            item.riskLevel === 'High' ? styles.riskTextHigh :
            item.riskLevel === 'Moderate' ? styles.riskTextModerate :
            styles.riskTextLow
          ]}>
            {item.riskLevel || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <TouchableOpacity
          key="prev"
          style={styles.paginationButton}
          onPress={() => handlePageChange(currentPage - 1)}
        >
          <Text style={styles.paginationButtonText}>‹</Text>
        </TouchableOpacity>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.paginationButton,
            i === currentPage && styles.paginationButtonActive
          ]}
          onPress={() => handlePageChange(i)}
        >
          <Text style={[
            styles.paginationButtonText,
            i === currentPage && styles.paginationButtonTextActive
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <TouchableOpacity
          key="next"
          style={styles.paginationButton}
          onPress={() => handlePageChange(currentPage + 1)}
        >
          <Text style={styles.paginationButtonText}>›</Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Household Data Management</Text>
        <Text style={styles.headerSubtitle}>
          Total Households: {households.length} | Showing {startIndex + 1}-
          {Math.min(endIndex, households.length)} of {households.length}
        </Text>
      </View>

      {/* Table Content */}
      {households.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No household data available</Text>
        </View>
      ) : (
        <FlatList
          data={currentHouseholds}
          renderItem={renderHouseholdItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Pagination */}
      {households.length > 0 && totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationInfo}>
            Showing {startIndex + 1} to {Math.min(endIndex, households.length)} of {households.length} entries
          </Text>
          <View style={styles.paginationButtons}>
            {renderPaginationButtons()}
          </View>
        </View>
      )}
    </View>
  );
};

export default HouseholdTable;