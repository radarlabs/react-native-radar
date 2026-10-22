import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme";

type Props = {
  title: string;
  initiallyExpanded?: boolean;
  children: React.ReactNode;
};

// Collapsible card with a rotating chevron, like TogglePanel on iOS.
export default function TogglePanel({ title, initiallyExpanded = false, children }: Props) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  return (
    <View style={styles.card}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.chevron, expanded && styles.chevronExpanded]}>›</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  chevron: {
    fontSize: 22,
    color: colors.secondaryText,
  },
  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
