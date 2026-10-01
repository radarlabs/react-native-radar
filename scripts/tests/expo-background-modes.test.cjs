const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');
const { compileModsAsync } = require('expo/config-plugins');
const { withRadarIOS } = require('../../plugin/build/withRadarIOS');

for (const { name, modes, enabled, expected } of [
  {
    name: 'preserves notification and other app background modes',
    modes: ['location', 'remote-notification', 'fetch', 'audio'],
    enabled: true,
    expected: ['location', 'remote-notification', 'fetch', 'audio'],
  },
  {
    name: 'adds required modes without duplicating existing location',
    modes: ['remote-notification', 'location'],
    enabled: true,
    expected: ['remote-notification', 'location', 'fetch'],
  },
  {
    name: 'adds required modes when none are configured',
    enabled: true,
    expected: ['location', 'fetch'],
  },
  {
    name: 'leaves configured modes alone when disabled',
    modes: ['remote-notification'],
    enabled: false,
    expected: ['remote-notification'],
  },
]) {
  test(name, async () => {
    const projectRoot = mkdtempSync(join(tmpdir(), 'radar-background-modes-'));
    try {
      const config = withRadarIOS({
        name: 'BackgroundModesTest',
        slug: 'background-modes-test',
        ios: { infoPlist: modes ? { UIBackgroundModes: modes } : {} },
      }, { iosBackgroundMode: enabled });
      const result = await compileModsAsync(config, {
        projectRoot,
        platforms: ['ios'],
        introspect: true,
      });
      assert.deepEqual(result.ios.infoPlist.UIBackgroundModes, expected);
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });
}
