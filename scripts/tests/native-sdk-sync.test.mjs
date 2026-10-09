import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  applyAndroidVersion,
  applyReactNativeVersion,
  compareStableVersions,
  missingEventTypes,
  nextMinorVersion,
  planUpdate,
  releaseNotesBetween,
} from "../native-sdk-sync.mjs";

const LINKED_EXAMPLE_LOCK =
  '{"packages":{"..":{"version":"4.36.2"},"node_modules/react-native-radar":{"version":"4.36.2"}}}\n';

function fixtureRoot(exampleLock = LINKED_EXAMPLE_LOCK) {
  const root = mkdtempSync(path.join(tmpdir(), "native-sdk-sync-test-"));
  for (const directory of [
    "src",
    "ios/RadarSDK.xcframework/ios-arm64/RadarSDK.framework",
    "example",
    "android/src/oldarch/java/com/radar",
    "android/src/newarch/java/com/radar",
  ]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  writeFileSync(path.join(root, "package.json"), '{"version":"4.36.2"}\n');
  writeFileSync(
    path.join(root, "android/build.gradle"),
    "def radar_sdk_version = '3.35.0'\n\nbuildscript {}\n"
  );
  writeFileSync(
    path.join(root, "package-lock.json"),
    '{"version":"4.36.2","packages":{"":{"version":"4.36.2"}}}\n'
  );
  writeFileSync(
    path.join(root, "example/package-lock.json"),
    exampleLock
  );
  writeFileSync(
    path.join(
      root,
      "ios/RadarSDK.xcframework/ios-arm64/RadarSDK.framework/Info.plist"
    ),
    '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>CFBundleShortVersionString</key><string>3.40.0</string></dict></plist>\n'
  );
  writeFileSync(
    path.join(root, "src/version.ts"),
    "export const VERSION = '4.36.2';\n"
  );
  writeFileSync(
    path.join(root, "ios/RNRadar.mm"),
    'setObject:@"4.36.2" forKey:@"radar-xPlatformSDKVersion"\nsetObject:@"4.36.2" forKey:@"radar-xPlatformSDKVersion"\n'
  );
  const androidMarkers =
    'putString("x_platform_sdk_version", "4.36.2")\nputString("x_platform_sdk_version", "4.36.2")\n';
  writeFileSync(
    path.join(root, "android/src/oldarch/java/com/radar/RadarModule.java"),
    androidMarkers
  );
  writeFileSync(
    path.join(root, "android/src/newarch/java/com/radar/RadarModule.kt"),
    androidMarkers
  );
  return root;
}

test("compares newer, equal, and older releases", () => {
  assert.equal(compareStableVersions("3.41.0", "3.40.0"), 1);
  assert.equal(compareStableVersions("3.40.0", "3.40.0"), 0);
  assert.equal(compareStableVersions("3.39.0", "3.40.0"), -1);
});

test("rejects prerelease versions", () => {
  assert.throws(() => compareStableVersions("3.41.0-beta.1", "3.40.0"));
});

test("plans updates for each platform and resets the React Native patch", () => {
  const root = fixtureRoot();

  const both = planUpdate("3.41.0", "3.38.0", root);
  assert.equal(both.status, "update");
  assert.deepEqual(both.ios, { current: "3.40.0", target: "3.41.0", update: true });
  assert.deepEqual(both.android, {
    current: "3.35.0",
    target: "3.38.0",
    update: true,
  });
  assert.equal(both.targetRnVersion, "4.37.0");

  const iosOnly = planUpdate("3.41.0", "3.35.0", root);
  assert.equal(iosOnly.status, "update");
  assert.equal(iosOnly.android.update, false);

  const androidOnly = planUpdate("3.39.0", "3.36.0", root);
  assert.equal(androidOnly.status, "update");
  assert.equal(androidOnly.ios.update, false);

  assert.equal(planUpdate("3.40.0", "3.35.0", root).status, "noop");
  assert.throws(() => planUpdate("3.41.0", "3.38.0-beta.1", root));
  assert.equal(nextMinorVersion("4.36.2"), "4.37.0");
});

test("updates the pinned Android SDK version", () => {
  const root = fixtureRoot();
  applyAndroidVersion(root, "3.38.0");
  assert.equal(
    readFileSync(path.join(root, "android/build.gradle"), "utf8"),
    "def radar_sdk_version = '3.38.0'\n\nbuildscript {}\n"
  );

  writeFileSync(path.join(root, "android/build.gradle"), "buildscript {}\n");
  assert.throws(() => applyAndroidVersion(root, "3.38.0"), /0 markers/);
});

test("finds iOS event types missing from the TypeScript union", () => {
  const header = `typedef NS_ENUM(NSInteger, RadarEventType) {
    /// Unknown
    RadarEventTypeUnknown NS_SWIFT_NAME(unknown),
    /// \`user.entered_geofence\`
    RadarEventTypeUserEnteredGeofence NS_SWIFT_NAME(userEnteredGeofence),
    /// \`user.fired_trip_orders\`
    RadarEventTypeUserFiredTripOrders NS_SWIFT_NAME(userFiredTripOrders)
};

/// \`user.not_in_the_enum\``;
  const types = `export type RadarEventType =
  | "unknown"
  | "user.entered_geofence";
`;
  assert.deepEqual(missingEventTypes(header, types), ["user.fired_trip_orders"]);
  assert.deepEqual(
    missingEventTypes(
      header,
      types.replace(";", '\n  | "user.fired_trip_orders";')
    ),
    []
  );
});

test("updates all React Native version markers", () => {
  const root = fixtureRoot();
  applyReactNativeVersion(root, "4.37.0");

  assert.equal(
    JSON.parse(readFileSync(path.join(root, "package.json"))).version,
    "4.37.0"
  );
  const rootLock = JSON.parse(
    readFileSync(path.join(root, "package-lock.json"))
  );
  assert.equal(rootLock.packages[""].version, "4.37.0");
  const exampleLock = JSON.parse(
    readFileSync(path.join(root, "example/package-lock.json"))
  );
  assert.equal(exampleLock.packages[".."].version, "4.37.0");
  assert.equal(
    exampleLock.packages["node_modules/react-native-radar"].version,
    "4.37.0"
  );
  for (const file of [
    "src/version.ts",
    "ios/RNRadar.mm",
    "android/src/oldarch/java/com/radar/RadarModule.java",
    "android/src/newarch/java/com/radar/RadarModule.kt",
  ]) {
    assert.match(readFileSync(path.join(root, file), "utf8"), /4\.37\.0/);
  }
});

test("updates an installed (non-linked) example lockfile entry", () => {
  const root = fixtureRoot(
    '{"packages":{"node_modules/react-native-radar":{"version":"4.36.2","resolved":"file:.."}}}\n'
  );
  applyReactNativeVersion(root, "4.37.0");

  const exampleLock = JSON.parse(
    readFileSync(path.join(root, "example/package-lock.json"))
  );
  assert.equal(exampleLock.packages[".."], undefined);
  assert.equal(
    exampleLock.packages["node_modules/react-native-radar"].version,
    "4.37.0"
  );
});

test("rejects an example lockfile without react-native-radar", () => {
  const root = fixtureRoot('{"packages":{}}\n');
  assert.throws(
    () => applyReactNativeVersion(root, "4.37.0"),
    /no react-native-radar entry/
  );
});

test("collects stable release notes after the vendored version", () => {
  const releases = [
    { tag_name: "3.42.0", body: "Adds setExpectedAddress." },
    { tag_name: "3.38.0", body: "Already vendored." },
    { tag_name: "3.43.0", body: "Newer than target." },
    { tag_name: "3.40.0-beta.1", body: "Prerelease tag.", prerelease: true },
    { tag_name: "3.39.0", body: "Draft.", draft: true },
    { tag_name: "3.40.0", body: null },
  ];
  assert.equal(
    releaseNotesBetween(releases, "3.38.0", "3.42.0"),
    "## 3.40.0\n\n\n\n## 3.42.0\n\nAdds setExpectedAddress.\n"
  );
});
