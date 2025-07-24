import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  listContainer: {
    paddingBottom: 10,
  },
  tableRow: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
    padding: 16,
  },
  tableCell: {
    marginBottom: 8,
  },
  cellLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  cellValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },
  riskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  riskBadgeHigh: {
    backgroundColor: '#FEE2E2',
  },
  riskBadgeModerate: {
    backgroundColor: '#FECACA',
  },
  riskBadgeLow: {
    backgroundColor: '#F3F4F6',
  },
  riskText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  riskTextHigh: {
    color: '#EF4444',
  },
  riskTextModerate: {
    color: '#DC2626',
  },
  riskTextLow: {
    color: '#374151',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  paginationContainer: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE4E6',
  },
  paginationInfo: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  paginationButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
    marginVertical: 2,
    borderRadius: 4,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  paginationButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  paginationButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default styles;