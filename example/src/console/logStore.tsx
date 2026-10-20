import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Radar from "react-native-radar";
import type { RadarEvent } from "react-native-radar";

// Single console timeline, like LogStream in the native example apps.
export type ConsoleKind = "action" | "result" | "event" | "location" | "log" | "error";

export type ConsoleEntry = {
  id: number;
  timestamp: Date;
  kind: ConsoleKind;
  summary: string;
  detail?: string;
};

const MAX_ENTRIES = 2000;

type LogStore = {
  entries: ConsoleEntry[];
  lastResult: string;
  write: (kind: ConsoleKind, summary: string, detail?: string) => void;
  writeResult: (text: string) => void;
  writeEvents: (events: RadarEvent[]) => void;
  clear: () => void;
  captureLogs: boolean;
  setCaptureLogs: (enabled: boolean) => void;
};

const LogStoreContext = createContext<LogStore | null>(null);

const stringify = (obj: unknown) => JSON.stringify(obj, null, 2);

const formatCoordinate = (latitude: number, longitude: number) =>
  `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

// The Android new-architecture bridge emits location and user as JSON strings, not objects.
const asObject = <T,>(value: T | string): T => (typeof value === "string" ? JSON.parse(value) : value);

const eventSubject = (event: RadarEvent) =>
  event.geofence?.externalId ||
  event.geofence?.description ||
  event.place?.name ||
  (event.beacon?.major != null ? `beacon ${event.beacon.major}/${event.beacon.minor}` : undefined) ||
  event.region?.name ||
  event.trip?.externalId;

export function LogStoreProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [lastResult, setLastResult] = useState("");
  const [captureLogs, setCaptureLogs] = useState(false);
  const nextId = useRef(0);

  const write = useCallback((kind: ConsoleKind, summary: string, detail?: string) => {
    const entry: ConsoleEntry = { id: nextId.current++, timestamp: new Date(), kind, summary, detail };
    setEntries((current) => [entry, ...current].slice(0, MAX_ENTRIES));
  }, []);

  // Results keep their exact text for the "last result" line (PR test plans quote it); in the
  // console a trailing JSON payload moves into the expandable detail.
  const writeResult = useCallback(
    (text: string) => {
      setLastResult(text);
      const kind: ConsoleKind = /\berror\b/i.test(text.split(":")[0]) ? "error" : "result";
      const jsonStart = text.search(/[{[]/);
      if (jsonStart > 0 && text.length - jsonStart > 80) {
        write(kind, text.slice(0, jsonStart).trim(), text.slice(jsonStart));
      } else {
        write(kind, text);
      }
    },
    [write]
  );

  const writeEvents = useCallback(
    (events: RadarEvent[]) => {
      for (const event of events) {
        const subject = eventSubject(event);
        write("event", subject ? `${event.type} — ${subject}` : event.type, stringify(event));
      }
    },
    [write]
  );

  const clear = useCallback(() => setEntries([]), []);

  useEffect(() => {
    // The web SDK (index.web.js) has no listener APIs.
    if (typeof Radar.onLocationUpdated !== "function") {
      return;
    }
    Radar.onLocationUpdated((update) => {
      const location = asObject(update.location);
      const user = asObject(update.user);
      const accuracy = location.accuracy != null ? ` ±${Math.round(location.accuracy)} m` : "";
      write(
        "location",
        `synced ${formatCoordinate(location.latitude, location.longitude)}${accuracy}`,
        stringify({ location, user })
      );
    });
    Radar.onClientLocationUpdated(({ location: rawLocation, stopped, source }) => {
      const location = asObject(rawLocation);
      write(
        "location",
        `${stopped ? "stopped" : "moving"} ${formatCoordinate(location.latitude, location.longitude)}`,
        stringify({ location, stopped, source })
      );
    });
    Radar.onEventsReceived(({ events }) => writeEvents(events));
    Radar.onError((status) => write("error", `error: ${status}`));
    return () => {
      Radar.onLocationUpdated(null);
      Radar.onClientLocationUpdated(null);
      Radar.onEventsReceived(null);
      Radar.onError(null);
    };
  }, [write, writeEvents]);

  // SDK log capture is opt-in: the old example kept onLog off by default on iOS.
  useEffect(() => {
    if (!captureLogs || typeof Radar.onLog !== "function") {
      return;
    }
    Radar.onLog((message) => write("log", message));
    return () => Radar.onLog(null);
  }, [captureLogs, write]);

  const value = useMemo(
    () => ({ entries, lastResult, write, writeResult, writeEvents, clear, captureLogs, setCaptureLogs }),
    [entries, lastResult, write, writeResult, writeEvents, clear, captureLogs]
  );

  return <LogStoreContext.Provider value={value}>{children}</LogStoreContext.Provider>;
}

export function useLogStore() {
  const store = useContext(LogStoreContext);
  if (!store) {
    throw new Error("useLogStore must be used inside LogStoreProvider");
  }
  return store;
}
