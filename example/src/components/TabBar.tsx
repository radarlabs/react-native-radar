import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme";

export type Tab = "Map" | "Debug" | "Tests";

export const TABS: Tab[] = ["Map", "Debug", "Tests"];

type Props = {
  selected: Tab;
  onSelect: (tab: Tab) => void;
};

export default function TabBar({ selected, onSelect }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          accessibilityRole="tab"
          accessibilityLabel={`${tab} tab`}
          accessibilityState={{ selected: tab === selected }}
          style={styles.tab}
          onPress={() => onSelect(tab)}
        >
          <Text style={[styles.label, tab === selected && styles.selected]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  selected: {
    color: colors.tint,
  },
});
