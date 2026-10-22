import React, { useCallback, useEffect, useState } from "react";
import { Linking, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Radar from "react-native-radar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../components/ActionButton";
import ControlRow from "../components/ControlRow";
import FieldEditor from "../components/FieldEditor";
import { useLogStore } from "../console/logStore";
import type { Actions } from "../actions";
import { colors, monospace } from "../theme";

type Props = {
  visible: boolean;
  actions: Actions;
  onClose: () => void;
};

type Snapshot = {
  userId: string;
  description: string;
  metadata: string;
  isTracking: boolean | null;
  remoteOptions: boolean | null;
  trackingOptions: string;
  permissions: string;
};

const EMPTY: Snapshot = {
  userId: "",
  description: "",
  metadata: "",
  isTracking: null,
  remoteOptions: null,
  trackingOptions: "",
  permissions: "",
};

const PRESETS = [
  { label: "Efficient", action: "startTrackingEfficient" },
  { label: "Responsive", action: "startTrackingResponsive" },
  { label: "Continuous", action: "startTrackingContinuous" },
] as const;

const settle = async <T,>(promise: Promise<T>, fallback: T) => {
  try {
    return await promise;
  } catch {
    return fallback;
  }
};

// Port of TestsSettingsView: presets, identity, tracking status and permissions.
export default function SettingsSheet({ visible, actions, onClose }: Props) {
  const { write, captureLogs, setCaptureLogs } = useLogStore();
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY);
  const [showOptions, setShowOptions] = useState(false);

  const refresh = useCallback(async () => {
    const [userId, description, metadata, isTracking, remoteOptions, trackingOptions, permissions] = await Promise.all([
      settle(Radar.getUserId(), ""),
      settle(Radar.getDescription(), ""),
      settle(Radar.getMetadata(), {}),
      settle(Radar.isTracking(), null),
      settle(Radar.isUsingRemoteTrackingOptions(), null),
      settle(Radar.getTrackingOptions(), null),
      settle(Radar.getPermissionsStatus(), "UNKNOWN"),
    ]);
    setSnapshot({
      userId: userId ?? "",
      description: description ?? "",
      metadata: JSON.stringify(metadata ?? {}),
      isTracking,
      remoteOptions,
      trackingOptions: trackingOptions ? JSON.stringify(trackingOptions, null, 2) : "",
      permissions: String(permissions),
    });
  }, []);

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible, refresh]);

  // Run an action, then refresh so the status rows reflect it.
  const run = (action: () => unknown) => async () => {
    await action();
    refresh();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {/* Modals get their own safe area; on Android the sheet is full screen under the status bar. */}
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={Platform.OS === "ios" ? ["bottom"] : ["top", "bottom"]}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity accessibilityLabel="Done" onPress={onClose}>
              <Text style={styles.done}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Section title="Presets">
              <View style={styles.chips}>
                {PRESETS.map(({ label, action }) => (
                  <TouchableOpacity
                    key={label}
                    accessibilityLabel={`${label} preset`}
                    style={styles.chip}
                    onPress={run(() => {
                      write("action", action);
                      actions[action]();
                    })}
                  >
                    <Text style={styles.chipText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity accessibilityLabel="Active tracking options" onPress={() => setShowOptions(!showOptions)}>
                <Text style={styles.disclosure}>{showOptions ? "▾" : "▸"} Active tracking options</Text>
              </TouchableOpacity>
              {showOptions && (
                <Text selectable style={styles.code}>
                  {snapshot.trackingOptions || "Not tracking"}
                </Text>
              )}
            </Section>

            <Section title="Identity">
              <FieldEditor
                label="User ID"
                value={snapshot.userId}
                onSubmit={(value) => {
                  Radar.setUserId(value);
                  write("result", `setUserId: ${value}`);
                  refresh();
                }}
              />
              <FieldEditor
                label="Description"
                value={snapshot.description}
                onSubmit={(value) => {
                  Radar.setDescription(value);
                  write("result", `setDescription: ${value}`);
                  refresh();
                }}
              />
              <ControlRow label="Metadata" value={snapshot.metadata} />
            </Section>

            <Section title="Tracking">
              <ControlRow
                label="Status"
                value={snapshot.isTracking == null ? "—" : snapshot.isTracking ? "On" : "Off"}
              />
              <ControlRow
                label="Source"
                value={snapshot.remoteOptions == null ? "—" : snapshot.remoteOptions ? "Remote" : "Local"}
              />
              <ActionButton title="Refresh" variant="secondary" onPress={refresh} />
              <ActionButton title="stopTracking" variant="destructive" onPress={run(actions.stopTracking)} />
            </Section>

            <Section title="Permissions">
              <ControlRow label="Location" value={snapshot.permissions || "—"} />
              <ActionButton title="requestPermissionsForeground" onPress={run(actions.requestPermissionsForeground)} />
              <ActionButton title="requestPermissionsBackground" onPress={run(actions.requestPermissionsBackground)} />
              {Platform.OS === "android" && (
                <ActionButton title="requestBluetoothPermissions" onPress={run(actions.requestBluetoothPermissions)} />
              )}
              <ActionButton title="Open Settings" variant="secondary" onPress={() => Linking.openSettings()} />
            </Section>

            <Section title="Console">
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Capture SDK logs</Text>
                <Switch accessibilityLabel="Capture SDK logs" value={captureLogs} onValueChange={setCaptureLogs} />
              </View>
            </Section>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
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
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  done: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.tint,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    textTransform: "uppercase",
    marginBottom: 6,
    marginLeft: 4,
  },
  sectionBody: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.secondaryFill,
    marginRight: 8,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
  },
  disclosure: {
    fontSize: 15,
    color: colors.tint,
    paddingVertical: 8,
  },
  code: {
    fontFamily: monospace,
    fontSize: 11,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  switchLabel: {
    fontSize: 15,
    color: colors.text,
  },
});
