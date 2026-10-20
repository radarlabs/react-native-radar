import React, { useMemo, useState } from "react";
import { FlatList, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ConsoleEntryRow from "../console/ConsoleEntryRow";
import { useLogStore, type ConsoleEntry, type ConsoleKind } from "../console/logStore";
import { colors } from "../theme";

type Filter = "All" | "Actions" | "Events" | "Locations" | "Logs";

const FILTERS: Filter[] = ["All", "Actions", "Events", "Locations", "Logs"];

const FILTER_KINDS: Record<Filter, ConsoleKind[] | null> = {
  All: null,
  Actions: ["action", "result", "error"],
  Events: ["event"],
  Locations: ["location"],
  Logs: ["log", "error"],
};

const toText = (entries: ConsoleEntry[]) =>
  entries
    .map((e) => `${e.timestamp.toISOString()} [${e.kind}] ${e.summary}${e.detail ? "\n" + e.detail : ""}`)
    .join("\n");

// "Console" screen, a port of LogsView in the native example apps.
export default function DebugScreen() {
  const { entries, clear } = useLogStore();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const kinds = FILTER_KINDS[filter];
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (!kinds || kinds.includes(e.kind)) &&
        (!q || e.summary.toLowerCase().includes(q) || e.detail?.toLowerCase().includes(q))
    );
  }, [entries, filter, query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Console</Text>
          <Text style={styles.count}>{entries.length} entries</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity accessibilityLabel="Share console" onPress={() => Share.share({ message: toText(visible) })}>
            <Text style={styles.headerButton}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Clear console" onPress={clear}>
            <Text style={[styles.headerButton, styles.clear]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        accessibilityLabel="Search console"
        style={styles.search}
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            accessibilityLabel={`${f} filter`}
            accessibilityState={{ selected: f === filter }}
            style={[styles.chip, f === filter && styles.chipSelected]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, f === filter && styles.chipTextSelected]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        style={styles.list}
        data={visible}
        keyExtractor={(e) => String(e.id)}
        renderItem={({ item }) => <ConsoleEntryRow entry={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>{entries.length === 0 ? "Nothing yet" : "No matches"}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  count: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    fontSize: 16,
    color: colors.tint,
    marginLeft: 16,
  },
  clear: {
    color: colors.destructive,
  },
  search: {
    marginHorizontal: 16,
    backgroundColor: colors.secondaryFill,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.secondaryFill,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: colors.tint,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  list: {
    backgroundColor: colors.card,
  },
  empty: {
    textAlign: "center",
    color: colors.secondaryText,
    padding: 32,
  },
});
