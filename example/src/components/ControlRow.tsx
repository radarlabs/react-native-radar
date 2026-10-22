import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export default function ControlRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  label: {
    fontSize: 15,
    color: colors.text,
  },
  value: {
    fontSize: 15,
    color: colors.secondaryText,
    flexShrink: 1,
    marginLeft: 12,
    textAlign: "right",
  },
});
