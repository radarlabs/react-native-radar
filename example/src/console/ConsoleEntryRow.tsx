import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, kindColors, monospace } from "../theme";
import type { ConsoleEntry } from "./logStore";

const ICONS: Record<ConsoleEntry["kind"], string> = {
  action: "▶",
  result: "✓",
  event: "★",
  location: "◎",
  log: "≡",
  error: "!",
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour12: false }) + "." + String(date.getMilliseconds()).padStart(3, "0");

export default function ConsoleEntryRow({ entry, compact = false }: { entry: ConsoleEntry; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = !compact && !!entry.detail;
  const color = kindColors[entry.kind];

  return (
    <TouchableOpacity disabled={!canExpand} onPress={() => setExpanded(!expanded)} style={styles.row}>
      <Text style={[styles.icon, { color }]}>{ICONS[entry.kind]}</Text>
      <View style={styles.body}>
        <Text style={styles.meta}>
          {formatTime(entry.timestamp)} · <Text style={{ color }}>{entry.kind}</Text>
          {canExpand ? (expanded ? "  ▾" : "  ▸") : ""}
        </Text>
        <Text style={styles.summary} numberOfLines={compact ? 2 : expanded ? undefined : 4}>
          {entry.summary}
        </Text>
        {expanded && entry.detail && (
          <Text selectable style={styles.detail}>
            {entry.detail}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  icon: {
    width: 20,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 1,
  },
  body: {
    flex: 1,
    marginLeft: 6,
  },
  meta: {
    fontSize: 11,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  summary: {
    fontSize: 14,
    color: colors.text,
  },
  detail: {
    fontFamily: monospace,
    fontSize: 11,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
});
