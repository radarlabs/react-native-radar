#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Swift 6.2.4 emits checked continuations under these same names used by
// unsafe continuations in Swift 5 mode. A static consumer can coalesce the
// incompatible definitions. Newer compilers give the checked bridges TZ names.
const collidingSymbols = [
  "_$sSo22UNNotificationSettingsCIeyBhy_ABTz_",
  "_$sSo7NSArrayCIeyBhy_SaySo21UNNotificationRequestCGTz_",
  "_$sSo7NSErrorCSgIeyBhy_ytTz_",
];

export function checkNotificationBridgeSymbols(output, binary) {
  const symbols = new Set(output.split(/\r?\n/).map((line) => line.trim()));
  if (!symbols.has("_OBJC_CLASS_$_Radar")) {
    throw new Error(`${binary}: could not identify the RadarSDK symbol table`);
  }
  const collisions = collidingSymbols.filter((symbol) => symbols.has(symbol));
  if (collisions.length > 0) {
    throw new Error(
      `${binary}: notification continuation bridges can collide with host libraries: ${collisions.join(
        ", "
      )}. Rebuild RadarSDK with Xcode 26.6 or newer and verify the bridge symbols.`
    );
  }
}

export function checkIosNotificationBridges(root, run = execFileSync) {
  for (const slice of ["ios-arm64", "ios-arm64_x86_64-simulator"]) {
    const binary = path.join(
      root,
      "ios/RadarSDK.xcframework",
      slice,
      "RadarSDK.framework/RadarSDK"
    );
    // Inspect all architectures in the simulator archive as well as the device.
    // Missing archives or nm failures must stop the SDK update.
    const output = run("xcrun", ["nm", "-arch", "all", "-j", binary], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    checkNotificationBridgeSymbols(output, binary);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    checkIosNotificationBridges(process.argv[2] ?? process.cwd());
    console.log(
      "RadarSDK device and simulator notification bridge symbols passed."
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
