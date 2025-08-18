import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ExampleButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    margin: 2,
  },
  text: {
    textTransform: 'none', // Ensure normal casing
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ExampleButton;
