import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  applyReactNativeVersion,
  compareStableVersions,
  nextMinorVersion,
  planUpdate,
} from "../ios-sdk-sync.mjs";

function fixtureRoot() {
  const root = mkdtempSync(path.join(tmpdir(), "ios-sdk-sync-test-"));
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
    path.join(root, "package-lock.json"),
    '{"version":"4.36.2","packages":{"":{"version":"4.36.2"}}}\n'
  );
  writeFileSync(
    path.join(root, "example/package-lock.json"),
    '{"packages":{"..":{"version":"4.36.2"},"node_modules/react-native-radar":{"version":"4.36.2"}}}\n'
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

test("plans updates and resets the React Native patch", () => {
  const root = fixtureRoot();
  assert.equal(planUpdate("3.41.0", root).status, "update");
  assert.equal(planUpdate("3.40.0", root).status, "noop");
  assert.equal(planUpdate("3.39.0", root).status, "noop");
  assert.equal(nextMinorVersion("4.36.2"), "4.37.0");
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
