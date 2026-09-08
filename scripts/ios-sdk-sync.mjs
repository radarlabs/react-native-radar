#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const stableVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function parseStableVersion(value) {
  const match = stableVersionPattern.exec(value ?? "");
  if (!match) throw new Error(`${value} is not a stable semantic version`);
  return match.slice(1).map(Number);
}

export function compareStableVersions(left, right) {
  const leftParts = parseStableVersion(left);
  const rightParts = parseStableVersion(right);
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return Math.sign(leftParts[index] - rightParts[index]);
    }
  }
  return 0;
}

export function nextMinorVersion(version) {
  const [major, minor] = parseStableVersion(version);
  return `${major}.${minor + 1}.0`;
}

function frameworkVersion(root) {
  const plistPath = path.join(
    root,
    "ios/RadarSDK.xcframework/ios-arm64/RadarSDK.framework/Info.plist"
  );
  const version = execFileSync(
    "/usr/bin/plutil",
    ["-extract", "CFBundleShortVersionString", "raw", plistPath],
    { encoding: "utf8" }
  ).trim();
  parseStableVersion(version);
  return version;
}

export function planUpdate(targetIosVersion, root) {
  parseStableVersion(targetIosVersion);
  const currentIosVersion = frameworkVersion(root);
  const currentRnVersion = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8")
  ).version;
  return {
    status:
      compareStableVersions(targetIosVersion, currentIosVersion) > 0
        ? "update"
        : "noop",
    currentIosVersion,
    targetRnVersion: nextMinorVersion(currentRnVersion),
  };
}

export function androidVersion(root) {
  const source = readFileSync(path.join(root, "android/build.gradle"), "utf8");
  const match = source.match(/def radar_sdk_version = '([^']+)'/);
  if (!match) throw new Error("Could not read the pinned Android SDK version");
  return match[1];
}

function updateJsonVersion(filePath, version) {
  const json = JSON.parse(readFileSync(filePath, "utf8"));
  json.version = version;
  if (json.packages?.[""]?.version) json.packages[""].version = version;
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
}

function replaceVersion(filePath, pattern, replacement, expectedCount) {
  const source = readFileSync(filePath, "utf8");
  const matches = source.match(pattern) ?? [];
  if (matches.length !== expectedCount) {
    throw new Error(
      `${filePath} has ${matches.length} markers; expected ${expectedCount}`
    );
  }
  writeFileSync(filePath, source.replace(pattern, replacement));
}

export function applyReactNativeVersion(root, version) {
  parseStableVersion(version);
  updateJsonVersion(path.join(root, "package.json"), version);
  updateJsonVersion(path.join(root, "package-lock.json"), version);

  const exampleLockPath = path.join(root, "example/package-lock.json");
  const exampleLock = JSON.parse(readFileSync(exampleLockPath, "utf8"));
  for (const key of ["..", "node_modules/react-native-radar"]) {
    if (!exampleLock.packages?.[key]) {
      throw new Error(`Example lockfile is missing ${key}`);
    }
    exampleLock.packages[key].version = version;
  }
  writeFileSync(exampleLockPath, `${JSON.stringify(exampleLock, null, 2)}\n`);

  writeFileSync(
    path.join(root, "src/version.ts"),
    `// This file contains the version of the react-native-radar package\n// It should be updated to match the version in package.json\nexport const VERSION = '${version}';\n`
  );
  replaceVersion(
    path.join(root, "ios/RNRadar.mm"),
    /setObject:@"[^"]+" forKey:@"radar-xPlatformSDKVersion"/g,
    `setObject:@"${version}" forKey:@"radar-xPlatformSDKVersion"`,
    2
  );
  replaceVersion(
    path.join(root, "android/src/oldarch/java/com/radar/RadarModule.java"),
    /putString\("x_platform_sdk_version", "[^"]+"\)/g,
    `putString("x_platform_sdk_version", "${version}")`,
    2
  );
  replaceVersion(
    path.join(root, "android/src/newarch/java/com/radar/RadarModule.kt"),
    /putString\("x_platform_sdk_version", "[^"]+"\)/g,
    `putString("x_platform_sdk_version", "${version}")`,
    2
  );
}

function main() {
  const [command, value, root = process.cwd()] = process.argv.slice(2);
  if (command === "plan") {
    process.stdout.write(JSON.stringify(planUpdate(value, root)));
  } else if (command === "android-version") {
    process.stdout.write(androidVersion(value ?? process.cwd()));
  } else if (command === "apply-version") {
    applyReactNativeVersion(root, value);
  } else {
    throw new Error(`Unknown command: ${command ?? "none"}`);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
