import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 100,
    justifyContent: 'center',
  },
  cardDefault: {
    backgroundColor: '#FFFFFF',
  },
  cardHigh: {
    backgroundColor: '#EF4444',
  },
  cardModerate: {
    backgroundColor: '#F87171',
  },
  cardLow: {
    backgroundColor: '#FECACA',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  textDark: {
    color: '#374151',
  },
  textWhite: {
    color: '#FFFFFF',
  },
});

export default styles;