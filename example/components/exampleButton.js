import React from "react";
import { Button } from "react-native";

const ExampleButton = ({ title, onPress }) => {
  return <Button title={title} onPress={onPress} />;
};

export default ExampleButton;