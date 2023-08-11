import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const ExampleButton = ({ title,onPress }) => {
  return <Button title={title} onPress={onPress} />;
};


export default ExampleButton;