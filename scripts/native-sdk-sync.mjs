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

function androidVersion(root) {
  const source = readFileSync(path.join(root, "android/build.gradle"), "utf8");
  const match = source.match(/def radar_sdk_version = '([^']+)'/);
  if (!match) throw new Error("Could not read the pinned Android SDK version");
  return match[1];
}

function platformPlan(current, target) {
  parseStableVersion(target);
  return {
    current,
    target,
    update: compareStableVersions(target, current) > 0,
  };
}

// Plans one release that moves each native SDK to its latest stable version.
// A platform whose target is not newer keeps its current pin.
export function planUpdate(targetIosVersion, targetAndroidVersion, root) {
  const ios = platformPlan(frameworkVersion(root), targetIosVersion);
  const android = platformPlan(androidVersion(root), targetAndroidVersion);
  const currentRnVersion = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8")
  ).version;
  return {
    status: ios.update || android.update ? "update" : "noop",
    ios,
    android,
    targetRnVersion: nextMinorVersion(currentRnVersion),
  };
}

// Concatenates the notes of every stable release after fromVersion, up to and
// including toVersion, oldest first.
export function releaseNotesBetween(releases, fromVersion, toVersion) {
  return releases
    .filter(
      (release) =>
        !release.draft &&
        !release.prerelease &&
        stableVersionPattern.test(release.tag_name) &&
        compareStableVersions(release.tag_name, fromVersion) > 0 &&
        compareStableVersions(release.tag_name, toVersion) <= 0
    )
    .sort((left, right) => compareStableVersions(left.tag_name, right.tag_name))
    .map((release) => `## ${release.tag_name}\n\n${(release.body ?? "").trim()}\n`)
    .join("\n");
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

export function applyAndroidVersion(root, version) {
  parseStableVersion(version);
  replaceVersion(
    path.join(root, "android/build.gradle"),
    /def radar_sdk_version = '[^']+'/g,
    `def radar_sdk_version = '${version}'`,
    1
  );
}

const eventTypeMarker = /`(user\.[a-z_]+)`/g;

// Returns the event types documented in the iOS RadarEventType enum that the
// RadarEventType union in src/@types/types.ts does not list.
export function missingEventTypes(radarEventHeader, typesSource) {
  const enumMatch = radarEventHeader.match(
    /typedef NS_ENUM\(NSInteger, RadarEventType\) \{([\s\S]*?)\};/
  );
  if (!enumMatch) throw new Error("RadarEvent.h has no RadarEventType enum");
  const unionMatch = typesSource.match(
    /export type RadarEventType =([\s\S]*?);/
  );
  if (!unionMatch) throw new Error("types.ts has no RadarEventType union");
  const known = new Set(
    [...unionMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
  );
  return [...enumMatch[1].matchAll(eventTypeMarker)]
    .map((match) => match[1])
    .filter((type) => !known.has(type));
}

export function applyReactNativeVersion(root, version) {
  parseStableVersion(version);
  updateJsonVersion(path.join(root, "package.json"), version);
  updateJsonVersion(path.join(root, "package-lock.json"), version);

  const exampleLockPath = path.join(root, "example/package-lock.json");
  const exampleLock = JSON.parse(readFileSync(exampleLockPath, "utf8"));
  // npm records the file:.. dependency as a link (".." plus a link entry) or
  // as an installed copy (only node_modules/react-native-radar).
  const exampleKeys = ["..", "node_modules/react-native-radar"].filter(
    (key) => exampleLock.packages?.[key]
  );
  if (exampleKeys.length === 0) {
    throw new Error("Example lockfile has no react-native-radar entry");
  }
  for (const key of exampleKeys) {
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
    // plan <ios version> <android version> [root]
    const [, ios, android, planRoot = process.cwd()] = process.argv.slice(2);
    process.stdout.write(JSON.stringify(planUpdate(ios, android, planRoot)));
  } else if (command === "apply-version") {
    applyReactNativeVersion(root, value);
  } else if (command === "apply-android-version") {
    applyAndroidVersion(root, value);
  } else if (command === "check-event-types") {
    const checkRoot = value ?? process.cwd();
    const missing = missingEventTypes(
      readFileSync(
        path.join(
          checkRoot,
          "ios/RadarSDK.xcframework/ios-arm64/RadarSDK.framework/Headers/RadarEvent.h"
        ),
        "utf8"
      ),
      readFileSync(path.join(checkRoot, "src/@types/types.ts"), "utf8")
    );
    if (missing.length > 0) {
      throw new Error(
        `RadarEventType in src/@types/types.ts is missing: ${missing.join(", ")}`
      );
    }
  } else if (command === "release-notes") {
    // Reads the GitHub releases JSON array from stdin; the third argument is
    // the target version rather than a root.
    const releases = JSON.parse(readFileSync(0, "utf8"));
    process.stdout.write(releaseNotesBetween(releases, value, root));
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
