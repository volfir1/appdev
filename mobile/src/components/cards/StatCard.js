import React from 'react';
import { View, Text } from 'react-native';
import styles from './StatCardStyles';

const StatCard = ({ title, value, type = 'default' }) => {
  const getCardStyle = () => {
    switch (type) {
      case 'high':
        return styles.cardHigh;
      case 'moderate':
        return styles.cardModerate;
      case 'low':
        return styles.cardLow;
      default:
        return styles.cardDefault;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'high':
      case 'moderate':
      case 'low':
        return styles.textWhite;
      default:
        return styles.textDark;
    }
  };

  return (
    <View style={[styles.card, getCardStyle()]}>
      <Text style={[styles.title, getTextStyle()]}>
        {title}
      </Text>
      <Text style={[styles.value, getTextStyle()]}>
        {value}
      </Text>
    </View>
  );
};

export default StatCard;