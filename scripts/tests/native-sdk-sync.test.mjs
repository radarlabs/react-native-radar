import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  applyAndroidFraudVersion,
  applyAndroidVersion,
  applyIosFraudVersion,
  applyReactNativeVersion,
  compareStableVersions,
  describeFraudUpdate,
  latestIosFraudRelease,
  latestMavenVersion,
  missingEventTypes,
  nextMinorVersion,
  planFraudUpdate,
  planUpdate,
  releaseNotesBetween,
  requiredFraudVersion,
} from "../native-sdk-sync.mjs";

const LINKED_EXAMPLE_LOCK =
  '{"packages":{"..":{"version":"4.36.2"},"node_modules/react-native-radar":{"version":"4.36.2"}}}\n';

function fixtureRoot(exampleLock = LINKED_EXAMPLE_LOCK) {
  const root = mkdtempSync(path.join(tmpdir(), "native-sdk-sync-test-"));
  for (const directory of [
    "src",
    "ios/RadarSDK.xcframework/ios-arm64/RadarSDK.framework",
    "ios/RadarSDKFraud.xcframework/ios-arm64/RadarSDKFraud.framework",
    "example",
    "scripts",
    "plugin/src",
    "android/src/main/java/com/radar",
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
    path.join(
      root,
      "ios/RadarSDKFraud.xcframework/ios-arm64/RadarSDKFraud.framework/Info.plist"
    ),
    '<?xml version="1.0" encoding="UTF-8"?>\n<plist version="1.0"><dict><key>CFBundleShortVersionString</key><string>1.2.0</string></dict></plist>\n'
  );
  writeFileSync(
    path.join(root, "scripts/download-xcframeworks.sh"),
    `DEFAULT_FRAUD_VERSION="1.2.0"\nDEFAULT_FRAUD_SHA256="${"a".repeat(64)}"\nFRAUD_VERSION="\${2:-$DEFAULT_FRAUD_VERSION}"\n`
  );
  writeFileSync(
    path.join(root, "plugin/src/withRadarAndroid.ts"),
    "if (buildGradle.includes('io.radar:sdk-fraud:')) {}\n'    implementation \"io.radar:sdk-fraud:1.2.0\"';\n"
  );
  writeFileSync(
    path.join(root, "android/src/main/java/com/radar/RadarModuleImpl.java"),
    '"`implementation \\"io.radar:sdk-fraud:1.2.0\\"` to your android/app/build.gradle.";\n'
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

const FRAUD_SHA = "b".repeat(64);

const IOS_FRAUD_RELEASES = [
  {
    tag_name: "1.5.0",
    html_url: "https://example.test/1.5.0",
    assets: [{ name: "RadarSDKFraud.xcframework.zip", digest: `sha256:${"c".repeat(64)}` }],
  },
  {
    tag_name: "1.6.0",
    html_url: "https://example.test/1.6.0",
    assets: [{ name: "RadarSDKFraud.xcframework.zip", digest: `sha256:${FRAUD_SHA}` }],
  },
  { tag_name: "1.7.0-beta.1", prerelease: true, assets: [] },
  { tag_name: "1.8.0", draft: true, assets: [] },
];

const MAVEN_METADATA = `<metadata><versioning><latest>1.3.0</latest><versions>
<version>initial-setup</version><version>1.2.0</version><version>1.3.0</version>
<version>1.4.0-beta.1</version></versions></versioning></metadata>`;

test("picks the latest stable iOS Fraud release and its zip sha256", () => {
  assert.deepEqual(latestIosFraudRelease(IOS_FRAUD_RELEASES), {
    version: "1.6.0",
    sha256: FRAUD_SHA,
    url: "https://example.test/1.6.0",
  });
  assert.throws(
    () => latestIosFraudRelease([{ tag_name: "1.6.0", assets: [] }]),
    /no RadarSDKFraud.xcframework.zip sha256/
  );
  assert.throws(() => latestIosFraudRelease([]), /no stable release/);
});

test("picks the latest stable Maven version", () => {
  assert.equal(latestMavenVersion(MAVEN_METADATA), "1.3.0");
  assert.throws(() => latestMavenVersion("<metadata/>"), /no stable version/);
});

test("reads the Fraud SDK version native release notes require", () => {
  assert.equal(
    requiredFraudVersion(
      "## 3.43.0\n\nRequires RadarSDKFraud 1.5.0.\n\n## 3.44.0\n\n-  Updates `trackVerified()` to require Radar Fraud SDK `1.6.0`. See 3.43.0.\n"
    ),
    "1.6.0"
  );
  assert.equal(requiredFraudVersion("Use io.radar:sdk-fraud:1.3.0"), "1.3.0");
  assert.equal(requiredFraudVersion("Fraud SDK version 1.4.1 or later"), "1.4.1");
  assert.equal(requiredFraudVersion("Fixes a crash in 3.44.1."), null);
  assert.equal(requiredFraudVersion(""), null);
});

function fraudInputs(overrides = {}) {
  return {
    iosUpdate: true,
    androidUpdate: true,
    iosFraudReleases: IOS_FRAUD_RELEASES,
    androidFraudMetadata: MAVEN_METADATA,
    iosReleaseNotes: "## 3.44.0\n\nRequires Radar Fraud SDK `1.6.0`.\n",
    androidReleaseNotes: "## 4.0.0\n\nBreaking changes.\n",
    ...overrides,
  };
}

test("plans Fraud SDK updates for updated platforms", () => {
  const root = fixtureRoot();
  const plan = planFraudUpdate(fraudInputs(), root);
  assert.deepEqual(plan, {
    ios: {
      current: "1.2.0",
      target: "1.6.0",
      update: true,
      required: "1.6.0",
      platformUpdate: true,
      sha256: FRAUD_SHA,
      url: "https://example.test/1.6.0",
    },
    android: {
      current: "1.2.0",
      target: "1.3.0",
      update: true,
      required: null,
      platformUpdate: true,
      url: "https://central.sonatype.com/artifact/io.radar/sdk-fraud/1.3.0",
    },
  });
  assert.equal(
    describeFraudUpdate(plan),
    "- Updates RadarSDKFraud (iOS) from `1.2.0` to [`1.6.0`](https://example.test/1.6.0), its latest stable release; the Radar iOS SDK release notes require `1.6.0`.\n" +
      "- Updates `io.radar:sdk-fraud` (Android) from `1.2.0` to [`1.3.0`](https://central.sonatype.com/artifact/io.radar/sdk-fraud/1.3.0), its latest stable release; the Radar Android SDK release notes name no required version."
  );
});

test("leaves Fraud SDKs alone when their platform is not updated or current", () => {
  const root = fixtureRoot();
  const notUpdated = planFraudUpdate(
    fraudInputs({ iosUpdate: false, androidUpdate: false }),
    root
  );
  assert.equal(notUpdated.ios.update, false);
  assert.equal(notUpdated.ios.target, "1.2.0");
  assert.equal(notUpdated.ios.sha256, null);
  assert.equal(notUpdated.android.update, false);
  assert.equal(
    describeFraudUpdate(notUpdated),
    "- RadarSDKFraud (iOS) stays at `1.2.0` because the Radar iOS SDK is not updated.\n" +
      "- `io.radar:sdk-fraud` (Android) stays at `1.2.0` because the Radar Android SDK is not updated."
  );

  const current = planFraudUpdate(
    fraudInputs({
      androidFraudMetadata: "<version>1.2.0</version>",
      androidReleaseNotes: "Requires sdk-fraud 1.2.0.",
    }),
    root
  );
  assert.equal(current.android.update, false);
  assert.match(
    describeFraudUpdate(current),
    /`io.radar:sdk-fraud` \(Android\) stays at `1.2.0`, its latest stable release; the Radar Android SDK release notes require `1.2.0`\./
  );
});

test("fails when release notes require an unreleased Fraud SDK", () => {
  const root = fixtureRoot();
  assert.throws(
    () =>
      planFraudUpdate(
        fraudInputs({ iosReleaseNotes: "Requires Radar Fraud SDK `1.7.0`." }),
        root
      ),
    /require Fraud SDK 1.7.0, but the latest release is 1.6.0/
  );
});

test("updates the iOS Fraud download pin", () => {
  const root = fixtureRoot();
  applyIosFraudVersion(root, "1.6.0", FRAUD_SHA);
  assert.equal(
    readFileSync(path.join(root, "scripts/download-xcframeworks.sh"), "utf8"),
    `DEFAULT_FRAUD_VERSION="1.6.0"\nDEFAULT_FRAUD_SHA256="${FRAUD_SHA}"\nFRAUD_VERSION="\${2:-$DEFAULT_FRAUD_VERSION}"\n`
  );
  assert.throws(() => applyIosFraudVersion(root, "1.6.0", "abc"), /not a sha256/);
});

test("updates both Android Fraud SDK markers", () => {
  const root = fixtureRoot();
  applyAndroidFraudVersion(root, "1.3.0");
  assert.equal(
    readFileSync(path.join(root, "plugin/src/withRadarAndroid.ts"), "utf8"),
    "if (buildGradle.includes('io.radar:sdk-fraud:')) {}\n'    implementation \"io.radar:sdk-fraud:1.3.0\"';\n"
  );
  assert.match(
    readFileSync(
      path.join(root, "android/src/main/java/com/radar/RadarModuleImpl.java"),
      "utf8"
    ),
    /io\.radar:sdk-fraud:1\.3\.0\\"/
  );
});
