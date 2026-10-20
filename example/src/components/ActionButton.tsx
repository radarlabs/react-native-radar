import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useLogStore } from "../console/logStore";
import { colors } from "../theme";

export type ActionButtonStyle = "primary" | "secondary" | "destructive";

type Props = {
  title: string;
  onPress: () => unknown;
  variant?: ActionButtonStyle;
};

// Logs its own tap to the console before running the action, like ActionButton on iOS.
export default function ActionButton({ title, onPress, variant = "primary" }: Props) {
  const { write } = useLogStore();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.button, buttonStyles[variant]]}
      onPress={() => {
        write("action", title);
        onPress();
      }}
    >
      <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 3,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});

const buttonStyles = StyleSheet.create({
  primary: { backgroundColor: colors.tint },
  secondary: { backgroundColor: colors.secondaryFill },
  destructive: { backgroundColor: colors.destructiveFill },
});

const textStyles = StyleSheet.create({
  primary: { color: "#FFFFFF" },
  secondary: { color: colors.text },
  destructive: { color: colors.destructive },
});
