import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About ActOnPov</Text>
      <Text style={styles.text}>This app helps identify poverty risks in Taguig using open data and mapping.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff5f5',
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#b91c1c',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#7f1d1d',
  },
});

export default About;
