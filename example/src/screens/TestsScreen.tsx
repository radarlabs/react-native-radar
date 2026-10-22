import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Autocomplete } from "react-native-radar";
import ActionButton from "../components/ActionButton";
import TogglePanel from "../components/TogglePanel";
import ConsoleEntryRow from "../console/ConsoleEntryRow";
import { useLogStore } from "../console/logStore";
import type { Actions } from "../actions";
import { PANELS } from "../panels";
import { colors, monospace } from "../theme";

type Props = {
  actions: Actions;
  architecture: string;
  onOpenSettings: () => void;
  onViewAll: () => void;
};

export default function TestsScreen({ actions, architecture, onOpenSettings, onViewAll }: Props) {
  const { entries, lastResult } = useLogStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tests</Text>
          <Text style={styles.subtitle}>
            {architecture} · {Platform.OS}
          </Text>
        </View>
        <TouchableOpacity accessibilityLabel="Settings" onPress={onOpenSettings}>
          <Text style={styles.gear}>⚙︎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last result</Text>
        <ScrollView style={styles.lastResultScroll} nestedScrollEnabled>
          <Text selectable style={styles.lastResult}>
            {lastResult || "Tap an action below."}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent activity</Text>
          <TouchableOpacity accessibilityLabel="View all activity" onPress={onViewAll}>
            <Text style={styles.link}>View all</Text>
          </TouchableOpacity>
        </View>
        {entries.length === 0 ? (
          <Text style={styles.empty}>Nothing yet</Text>
        ) : (
          entries.slice(0, 5).map((entry) => <ConsoleEntryRow key={entry.id} entry={entry} compact />)
        )}
      </View>

      {PANELS.map((panel) => (
        <TogglePanel key={panel.title} title={panel.title} initiallyExpanded={panel.initiallyExpanded}>
          {panel.showAutocomplete && Platform.OS !== "web" && (
            <View style={styles.autocomplete}>
              <Autocomplete options={{ near: { latitude: 40.7342, longitude: -73.9911 } }} />
            </View>
          )}
          {panel.actions.map(({ title, action, variant }) => (
            <ActionButton key={title} title={title} variant={variant} onPress={actions[action]} />
          ))}
        </TogglePanel>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  gear: {
    fontSize: 26,
    color: colors.tint,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    marginBottom: 12,
    paddingVertical: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    textTransform: "uppercase",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  link: {
    fontSize: 15,
    color: colors.tint,
    paddingHorizontal: 12,
  },
  lastResultScroll: {
    maxHeight: 160,
    paddingHorizontal: 12,
  },
  lastResult: {
    fontFamily: monospace,
    fontSize: 12,
    color: colors.text,
  },
  empty: {
    color: colors.secondaryText,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  autocomplete: {
    height: 60,
    marginBottom: 8,
  },
});
