import React, { useState, useEffect } from "react";
import { Text, View, AppState, AppStateStatus } from "react-native";
import * as Location from "expo-location";
import ExampleButton from "./exampleButton";

interface PermissionsComponentProps {
  setShowPermissionsComponent: (show: boolean) => void;
}

export default function PermissionsComponent({
  setShowPermissionsComponent,
}: PermissionsComponentProps) {
  useEffect(() => {
    setPermissions();
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          setPermissions();
        }
      }
    );

    // Cleanup function - will be called when component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  const [canRequestForegroundPermissions, setCanRequestForegroundPermissions] =
    useState(false);
  const [canRequestBackgroundPermissions, setCanRequestBackgroundPermissions] =
    useState(false);
  const [hasForegroundPermissions, setHasForegroundPermissions] =
    useState(false);
  const [hasBackgroundPermissions, setHasBackgroundPermissions] =
    useState(false);

  const setPermissions = () => {
    (async () => {
      const status = await Location.getForegroundPermissionsAsync();
      setCanRequestForegroundPermissions(status.canAskAgain);
      setHasForegroundPermissions(status.granted);
    })();
    (async () => {
      const status = await Location.getBackgroundPermissionsAsync();
      setCanRequestBackgroundPermissions(status.canAskAgain);
      setHasBackgroundPermissions(status.granted);
    })();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ExampleButton
        title={"back to main page"}
        onPress={() => {
          setShowPermissionsComponent(false);
        }}
      />

      {!hasForegroundPermissions && !canRequestForegroundPermissions && (
        <Text>please allow location permissions from the settings screen</Text>
      )}
      {!hasForegroundPermissions && canRequestForegroundPermissions && (
        <ExampleButton
          onPress={() => {
            Location.requestForegroundPermissionsAsync()
              .then((status) => {
                setCanRequestForegroundPermissions(status.canAskAgain);
                setHasForegroundPermissions(status.granted);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          title={"request foreground permissions"}
        />
      )}
      {hasForegroundPermissions &&
        !hasBackgroundPermissions &&
        !canRequestBackgroundPermissions && (
          <Text>
            please allow background location permissions from the settings
            screen
          </Text>
        )}
      {hasForegroundPermissions &&
        !hasBackgroundPermissions &&
        canRequestBackgroundPermissions && (
          <ExampleButton
            onPress={() => {
              Location.requestBackgroundPermissionsAsync()
                .then((status) => {
                  setCanRequestBackgroundPermissions(status.canAskAgain);
                  setHasBackgroundPermissions(status.granted);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            title={"request background permissions"}
          />
        )}
      {hasBackgroundPermissions && (
        <Text>have background location permissions</Text>
      )}
    </View>
  );
}
