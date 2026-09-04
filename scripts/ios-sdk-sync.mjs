#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const stableVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function parseStableVersion(value, name = "version") {
  const match = stableVersionPattern.exec(value ?? "");
  if (!match) {
    throw new Error(`${name} must be a stable MAJOR.MINOR.PATCH version`);
  }
  return match.slice(1).map(Number);
}

export function compareStableVersions(left, right) {
  const leftParts = parseStableVersion(left, "left version");
  const rightParts = parseStableVersion(right, "right version");
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return Math.sign(leftParts[index] - rightParts[index]);
    }
  }
  return 0;
}

export function nextMinorVersion(version) {
  const [major, minor] = parseStableVersion(version, "React Native version");
  return `${major}.${minor + 1}.0`;
}

export function planUpdate({
  targetIosVersion,
  currentIosVersion,
  baseRnVersion,
  workingRnVersion,
}) {
  const comparison = compareStableVersions(targetIosVersion, currentIosVersion);
  if (comparison < 0) {
    return { status: "stale", targetIosVersion, currentIosVersion };
  }
  if (comparison === 0) {
    return { status: "noop", targetIosVersion, currentIosVersion };
  }

  const targetRnVersion = nextMinorVersion(baseRnVersion);
  if (
    workingRnVersion !== baseRnVersion &&
    workingRnVersion !== targetRnVersion
  ) {
    throw new Error(
      `working React Native version ${workingRnVersion} is neither base ${baseRnVersion} nor target ${targetRnVersion}`
    );
  }

  return {
    status: "update",
    targetIosVersion,
    currentIosVersion,
    targetRnVersion,
  };
}

export function validateReleasePayload(payload) {
  parseStableVersion(payload.release, "release");
  let releaseUrl;
  try {
    releaseUrl = new URL(payload.releaseUrl);
  } catch {
    throw new Error("release URL must be a valid URL");
  }
  if (
    releaseUrl.origin !== "https://github.com" ||
    releaseUrl.pathname !==
      `/radarlabs/radar-sdk-ios/releases/tag/${payload.release}` ||
    releaseUrl.search ||
    releaseUrl.hash
  ) {
    throw new Error("release URL must point to a radar-sdk-ios GitHub release");
  }
  if (!/^[0-9a-f]{40}$/.test(payload.sourceSha ?? "")) {
    throw new Error("source SHA must be a full Git commit SHA");
  }
  return payload;
}

function markdownList(values, fallback) {
  return values.length > 0
    ? values.map((value) => `- ${value}`).join("\n")
    : `- ${fallback}`;
}

export function renderPullRequestBody({
  oldIosVersion,
  newIosVersion,
  rnVersion,
  releaseUrl,
  agentResult,
  validationStatus,
  validationSummary,
  validationLog,
}) {
  const forbiddenTestPlanText =
    /\b(?:automated|build|ci|coverage|jest|lint|npm|test suite|xcode)\b/i;
  const manualSteps = (agentResult.manual_test_steps ?? []).filter(
    (step) => typeof step === "string" && !forbiddenTestPlanText.test(step)
  );
  const testPlan =
    manualSteps.length > 0
      ? manualSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")
      : [
          "1. Install the generated React Native package in the Example app.",
          "2. Launch the Example app on an iOS simulator.",
          "3. Confirm the app opens and initializes Radar without an error.",
        ].join("\n");

  const body = [
    "## Summary",
    "",
    `- Updates the vendored Radar iOS SDK from \`${oldIosVersion}\` to [\`${newIosVersion}\`](${releaseUrl}).`,
    `- Prepares React Native version \`${rnVersion}\`; this workflow does not publish the package.`,
    `- ${
      agentResult.summary || "Claude did not return an implementation summary."
    }`,
    "",
    "## Exposed APIs",
    "",
    markdownList(
      agentResult.exposed_apis ?? [],
      "No new shared APIs were exposed."
    ),
    "",
    "## Deferred parity work",
    "",
    markdownList(agentResult.deferred_apis ?? [], "No APIs were deferred."),
    "",
    "## Test Plan",
    "",
    testPlan,
    "",
    "## Validation",
    "",
    `- Agent confidence: \`${agentResult.confidence || "unknown"}\`.`,
    `- Final automated validation: **${validationStatus}**.`,
    `- ${validationSummary || "No validation summary was captured."}`,
    ...(agentResult.validation_failures ?? []).map(
      (failure) => `- Agent-reported failure: ${failure}`
    ),
    "",
  ];
  if (validationLog) {
    body.push(
      "<details>",
      "<summary>Final validation failure output</summary>",
      "",
      "```text",
      validationLog.trimEnd(),
      "```",
      "</details>",
      ""
    );
  }
  return body.join("\n");
}

function readFrameworkVersion(plistPath) {
  const plist = readFileSync(plistPath, "utf8");
  const match = plist.match(
    /<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/
  );
  if (!match) {
    throw new Error(
      `could not read CFBundleShortVersionString from ${plistPath}`
    );
  }
  parseStableVersion(match[1], "vendored iOS version");
  return match[1];
}

function readPackageVersion(packagePath) {
  return JSON.parse(readFileSync(packagePath, "utf8")).version;
}

function readAndroidVersion(buildGradlePath) {
  const source = readFileSync(buildGradlePath, "utf8");
  const match = source.match(/def radar_sdk_version = '([^']+)'/);
  if (!match) {
    throw new Error(`could not read radar_sdk_version from ${buildGradlePath}`);
  }
  parseStableVersion(match[1], "pinned Android version");
  return match[1];
}

function updateJsonVersion(filePath, version) {
  const json = JSON.parse(readFileSync(filePath, "utf8"));
  json.version = version;
  if (json.packages?.[""]?.version) {
    json.packages[""].version = version;
  }
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
}

function updateExampleLockVersion(filePath, version) {
  const json = JSON.parse(readFileSync(filePath, "utf8"));
  for (const key of ["..", "node_modules/react-native-radar"]) {
    if (!json.packages?.[key]) {
      throw new Error(
        `${filePath} is missing packages[${JSON.stringify(key)}]`
      );
    }
    json.packages[key].version = version;
  }
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
}

function replaceVersion(filePath, pattern, replacement, expectedCount) {
  const source = readFileSync(filePath, "utf8");
  const matches = source.match(pattern) ?? [];
  if (matches.length !== expectedCount) {
    throw new Error(
      `${filePath} contained ${matches.length} version markers; expected ${expectedCount}`
    );
  }
  writeFileSync(filePath, source.replace(pattern, replacement));
}

export function applyReactNativeVersion(root, version) {
  parseStableVersion(version, "React Native version");
  updateJsonVersion(path.join(root, "package.json"), version);
  updateJsonVersion(path.join(root, "package-lock.json"), version);
  updateExampleLockVersion(
    path.join(root, "example/package-lock.json"),
    version
  );
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

function copyMatchingFiles(sourceRoot, destinationRoot) {
  for (const name of readdirSync(sourceRoot)) {
    const source = path.join(sourceRoot, name);
    const destination = path.join(destinationRoot, name);
    const stat = statSync(source);
    if (stat.isDirectory()) {
      copyMatchingFiles(source, destination);
    } else if (
      source.includes(`${path.sep}Headers${path.sep}`) ||
      (name.endsWith(".swiftinterface") && !name.includes("private"))
    ) {
      mkdirSync(path.dirname(destination), { recursive: true });
      cpSync(source, destination);
    }
  }
}

function snapshotApi(frameworkRoot, outputRoot) {
  rmSync(outputRoot, { recursive: true, force: true });
  mkdirSync(outputRoot, { recursive: true });
  copyMatchingFiles(
    path.join(frameworkRoot, "ios-arm64/RadarSDK.framework"),
    outputRoot
  );
}

function writeApiReport(
  oldRoot,
  newRoot,
  oldVersion,
  newVersion,
  upstreamDiffPath,
  outputPath
) {
  let frameworkDiff = "No public framework interface changes detected.\n";
  try {
    frameworkDiff = execFileSync(
      "git",
      ["diff", "--no-index", "--no-ext-diff", "--", oldRoot, newRoot],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
    );
  } catch (error) {
    if (error.status !== 1) throw error;
    frameworkDiff = error.stdout;
  }
  frameworkDiff = frameworkDiff
    .replaceAll(oldRoot, "old-api")
    .replaceAll(newRoot, "new-api");
  const upstreamDiff =
    readFileSync(upstreamDiffPath, "utf8") ||
    "No public source-header changes detected.\n";
  const report = [
    `# Radar iOS API change report: ${oldVersion} to ${newVersion}`,
    "",
    "## Public source-header diff",
    "```diff",
    upstreamDiff.trimEnd(),
    "```",
    "",
    "## Rebuilt framework interface diff",
    "```diff",
    frameworkDiff.trimEnd(),
    "```",
    "",
  ].join("\n");
  writeFileSync(outputPath, report);
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error(`invalid option near ${key ?? "end of arguments"}`);
    }
    options[key.slice(2)] = value;
  }
  return options;
}

function required(options, name) {
  if (!options[name]) throw new Error(`--${name} is required`);
  return options[name];
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  const options = parseOptions(args);
  switch (command) {
    case "validate-payload":
      validateReleasePayload({
        release: required(options, "release"),
        releaseUrl: required(options, "release-url"),
        sourceSha: required(options, "source-sha"),
      });
      break;
    case "framework-version":
      process.stdout.write(readFrameworkVersion(required(options, "plist")));
      break;
    case "package-version":
      process.stdout.write(
        readPackageVersion(required(options, "package-json"))
      );
      break;
    case "android-version":
      process.stdout.write(
        readAndroidVersion(required(options, "build-gradle"))
      );
      break;
    case "plan":
      process.stdout.write(
        JSON.stringify(
          planUpdate({
            targetIosVersion: required(options, "target-ios"),
            currentIosVersion: required(options, "current-ios"),
            baseRnVersion: required(options, "base-rn"),
            workingRnVersion: required(options, "working-rn"),
          })
        )
      );
      break;
    case "apply-rn-version":
      applyReactNativeVersion(
        required(options, "root"),
        required(options, "version")
      );
      break;
    case "snapshot-api":
      snapshotApi(required(options, "framework"), required(options, "output"));
      break;
    case "api-report":
      writeApiReport(
        required(options, "old-root"),
        required(options, "new-root"),
        required(options, "old-version"),
        required(options, "new-version"),
        required(options, "upstream-diff"),
        required(options, "output")
      );
      break;
    case "render-pr-body": {
      const agentResultPath = required(options, "agent-result");
      let agentResult = {};
      try {
        agentResult = JSON.parse(readFileSync(agentResultPath, "utf8"));
      } catch {
        agentResult = {
          summary: "Claude did not return valid structured output.",
        };
      }
      const body = renderPullRequestBody({
        oldIosVersion: required(options, "old-ios"),
        newIosVersion: required(options, "new-ios"),
        rnVersion: required(options, "rn-version"),
        releaseUrl: required(options, "release-url"),
        agentResult,
        validationStatus: required(options, "validation-status"),
        validationSummary: required(options, "validation-summary"),
        validationLog: options["validation-log"]
          ? readFileSync(options["validation-log"], "utf8")
          : "",
      });
      writeFileSync(required(options, "output"), body);
      break;
    }
    default:
      throw new Error(`unknown command: ${command ?? "none"}`);
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
