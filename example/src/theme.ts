import { Platform } from "react-native";

export const colors = {
  background: "#F2F2F7",
  card: "#FFFFFF",
  separator: "#E5E5EA",
  text: "#000000",
  secondaryText: "#6C6C70",
  tint: "#007AFF",
  secondaryFill: "#E9E9EE",
  destructive: "#FF3B30",
  destructiveFill: "#FFE5E3",
  success: "#34C759",
  warning: "#FF9500",
  purple: "#AF52DE",
};

export const monospace = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });

export const kindColors = {
  action: colors.tint,
  result: colors.success,
  event: colors.purple,
  location: colors.warning,
  log: colors.secondaryText,
  error: colors.destructive,
} as const;
