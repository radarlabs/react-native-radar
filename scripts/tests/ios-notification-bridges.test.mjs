import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  checkIosNotificationBridges,
  checkNotificationBridgeSymbols,
} from "../check-ios-notification-bridges.mjs";

const radarSymbol = "_OBJC_CLASS_$_Radar";
const unsafeSymbols = [
  "_$sSo22UNNotificationSettingsCIeyBhy_ABTz_",
  "_$sSo7NSArrayCIeyBhy_SaySo21UNNotificationRequestCGTz_",
  "_$sSo7NSErrorCSgIeyBhy_ytTz_",
];
const safeSymbols = unsafeSymbols.map((symbol) => symbol.replace("Tz_", "TZ_"));

test("accepts distinct checked bridge symbols and unrelated async bridges", () => {
  checkNotificationBridgeSymbols(
    [radarSymbol, ...safeSymbols, "_$sSo8NSStringCIeyBhy_ABTz_"].join("\n"),
    "RadarSDK"
  );
});

test("accepts a Radar build that no longer emits imported notification bridges", () => {
  checkNotificationBridgeSymbols(`${radarSymbol}\n`, "RadarSDK");
});

for (const symbol of unsafeSymbols) {
  test(`rejects the colliding bridge ${symbol}`, () => {
    assert.throws(
      () =>
        checkNotificationBridgeSymbols(
          `${radarSymbol}\n${symbol}\n`,
          "device/RadarSDK"
        ),
      (error) =>
        error.message.includes("device/RadarSDK") &&
        error.message.includes(symbol)
    );
  });
}

test("rejects an unsafe definition even when a safe definition is also present", () => {
  assert.throws(
    () =>
      checkNotificationBridgeSymbols(
        [radarSymbol, ...safeSymbols, ...unsafeSymbols].join("\n"),
        "RadarSDK"
      ),
    /notification continuation bridges can collide/
  );
});

test("handles duplicate symbols, archive headings, whitespace and CRLF", () => {
  assert.throws(
    () =>
      checkNotificationBridgeSymbols(
        `RadarSDK (for architecture arm64):\r\nobject.o:\r\n ${radarSymbol} \r\n ${unsafeSymbols[0]} \r\n${unsafeSymbols[0]}\r\n`,
        "simulator/RadarSDK"
      ),
    /simulator\/RadarSDK: notification continuation bridges can collide/
  );
});

for (const output of ["", "object.o:\n", safeSymbols.join("\n")]) {
  test(`rejects a missing Radar symbol table: ${JSON.stringify(
    output
  )}`, () => {
    assert.throws(
      () => checkNotificationBridgeSymbols(output, "RadarSDK"),
      /could not identify the RadarSDK symbol table/
    );
  });
}

test("checks both slices and all simulator architectures", () => {
  const inspected = [];
  checkIosNotificationBridges("/sdk", (command, args) => {
    assert.equal(command, "xcrun");
    assert.deepEqual(args.slice(0, 4), ["nm", "-arch", "all", "-j"]);
    inspected.push(args[4]);
    return `${radarSymbol}\n${safeSymbols.join("\n")}\n`;
  });
  assert.deepEqual(
    inspected.map((binary) =>
      path.relative("/sdk/ios/RadarSDK.xcframework", binary)
    ),
    [
      "ios-arm64/RadarSDK.framework/RadarSDK",
      "ios-arm64_x86_64-simulator/RadarSDK.framework/RadarSDK",
    ]
  );
});

test("rejects an unsafe simulator slice after a safe device slice", () => {
  assert.throws(
    () =>
      checkIosNotificationBridges(
        "/sdk",
        (_command, args) =>
          `${radarSymbol}\n${
            args.at(-1).includes("simulator")
              ? unsafeSymbols[1]
              : safeSymbols[1]
          }\n`
      ),
    /simulator.*notification continuation bridges can collide/
  );
});

test("propagates missing binaries and nm failures", () => {
  const failure = new Error("nm failed");
  assert.throws(
    () =>
      checkIosNotificationBridges("/sdk", () => {
        throw failure;
      }),
    (error) => error === failure
  );
});
