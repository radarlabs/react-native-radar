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
  renderPullRequestBody,
  validateReleasePayload,
} from "../ios-sdk-sync.mjs";

test("compares stable versions numerically", () => {
  assert.equal(compareStableVersions("3.10.0", "3.9.9"), 1);
  assert.equal(compareStableVersions("3.10.0", "3.10.0"), 0);
  assert.equal(compareStableVersions("3.9.9", "3.10.0"), -1);
});

test("rejects prerelease payloads and untrusted metadata", () => {
  assert.throws(() =>
    validateReleasePayload({
      release: "3.41.0-beta.1",
      releaseUrl:
        "https://github.com/radarlabs/radar-sdk-ios/releases/tag/3.41.0-beta.1",
      sourceSha: "a".repeat(40),
    })
  );
  assert.throws(() =>
    validateReleasePayload({
      release: "3.41.0",
      releaseUrl: "https://example.com/3.41.0",
      sourceSha: "a".repeat(40),
    })
  );
  assert.throws(() =>
    validateReleasePayload({
      release: "3.41.0",
      releaseUrl:
        "https://github.com/radarlabs/radar-sdk-ios/releases/tag/3.42.0",
      sourceSha: "a".repeat(40),
    })
  );
});

test("accepts a stable Radar iOS release payload", () => {
  assert.doesNotThrow(() =>
    validateReleasePayload({
      release: "3.41.0",
      releaseUrl:
        "https://github.com/radarlabs/radar-sdk-ios/releases/tag/3.41.0",
      sourceSha: "a".repeat(40),
    })
  );
});

test("calculates the next React Native minor", () => {
  assert.equal(nextMinorVersion("4.36.2"), "4.37.0");
});

test("plans an update without incrementing an existing automation version", () => {
  assert.deepEqual(
    planUpdate({
      targetIosVersion: "3.41.0",
      currentIosVersion: "3.40.0",
      baseRnVersion: "4.36.0",
      workingRnVersion: "4.37.0",
    }),
    {
      status: "update",
      targetIosVersion: "3.41.0",
      currentIosVersion: "3.40.0",
      targetRnVersion: "4.37.0",
    }
  );
});

test("classifies repeated and stale releases", () => {
  const common = { baseRnVersion: "4.36.0", workingRnVersion: "4.36.0" };
  assert.equal(
    planUpdate({
      targetIosVersion: "3.40.0",
      currentIosVersion: "3.40.0",
      ...common,
    }).status,
    "noop"
  );
  assert.equal(
    planUpdate({
      targetIosVersion: "3.39.1",
      currentIosVersion: "3.40.0",
      ...common,
    }).status,
    "stale"
  );
});

test("renders manual steps separately from automated validation", () => {
  const body = renderPullRequestBody({
    oldIosVersion: "3.40.0",
    newIosVersion: "3.41.0",
    rnVersion: "4.37.0",
    releaseUrl:
      "https://github.com/radarlabs/radar-sdk-ios/releases/tag/3.41.0",
    agentResult: {
      summary: "Exposes Radar.example().",
      exposed_apis: ["Radar.example()"],
      deferred_apis: [],
      confidence: "high",
      manual_test_steps: [
        "Tap Example and confirm a result appears.",
        "Run npm test.",
      ],
    },
    validationStatus: "passed",
    validationSummary: "TypeScript and Jest passed.",
    validationLog: "",
  });

  const testPlan = body
    .split("## Test Plan\n\n")[1]
    .split("\n\n## Validation")[0];
  assert.match(testPlan, /Tap Example/);
  assert.doesNotMatch(testPlan, /npm test/);
  assert.match(body, /TypeScript and Jest passed/);
});

test("puts automated failure logs under Validation", () => {
  const body = renderPullRequestBody({
    oldIosVersion: "3.40.0",
    newIosVersion: "3.41.0",
    rnVersion: "4.37.0",
    releaseUrl:
      "https://github.com/radarlabs/radar-sdk-ios/releases/tag/3.41.0",
    agentResult: {},
    validationStatus: "failed",
    validationSummary: "Automated checks failed.",
    validationLog: "FAIL src/index.test.ts",
  });

  const validation = body.split("## Validation\n\n")[1];
  assert.match(validation, /FAIL src\/index\.test\.ts/);
  const testPlan = body
    .split("## Test Plan\n\n")[1]
    .split("\n\n## Validation")[0];
  assert.doesNotMatch(testPlan, /FAIL/);
});

test("updates every React Native package and telemetry version marker", () => {
  const root = mkdtempSync(path.join(tmpdir(), "ios-sdk-sync-test-"));
  for (const directory of [
    "src",
    "ios",
    "example",
    "android/src/oldarch/java/com/radar",
    "android/src/newarch/java/com/radar",
  ]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  writeFileSync(path.join(root, "package.json"), '{"version":"4.36.0"}\n');
  writeFileSync(
    path.join(root, "package-lock.json"),
    '{"version":"4.36.0","packages":{"":{"version":"4.36.0"}}}\n'
  );
  writeFileSync(
    path.join(root, "example/package-lock.json"),
    '{"packages":{"..":{"version":"4.36.0"},"node_modules/react-native-radar":{"version":"4.36.0"}}}\n'
  );
  writeFileSync(
    path.join(root, "src/version.ts"),
    "export const VERSION = '4.36.0';\n"
  );
  writeFileSync(
    path.join(root, "ios/RNRadar.mm"),
    'setObject:@"4.36.0" forKey:@"radar-xPlatformSDKVersion"\nsetObject:@"4.36.0" forKey:@"radar-xPlatformSDKVersion"\n'
  );
  const androidMarkers =
    'putString("x_platform_sdk_version", "4.36.0")\nputString("x_platform_sdk_version", "4.36.0")\n';
  writeFileSync(
    path.join(root, "android/src/oldarch/java/com/radar/RadarModule.java"),
    androidMarkers
  );
  writeFileSync(
    path.join(root, "android/src/newarch/java/com/radar/RadarModule.kt"),
    androidMarkers
  );

  applyReactNativeVersion(root, "4.37.0");

  assert.equal(
    JSON.parse(readFileSync(path.join(root, "package.json"))).version,
    "4.37.0"
  );
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
