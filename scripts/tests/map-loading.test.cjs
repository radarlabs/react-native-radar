const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, realpathSync, symlinkSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { createRequire } = require('node:module');
const runtimeRequire = process.env.METRO_TEST_RUNTIME_ROOT
  ? createRequire(path.join(process.env.METRO_TEST_RUNTIME_ROOT, 'package.json'))
  : require;
const Metro = runtimeRequire('metro');
const { getDefaultConfig } = runtimeRequire('metro-config');

const root = path.resolve(__dirname, '../..');
const mapSource = readFileSync(path.join(root, 'src/ui/map.jsx'), 'utf8');

test('the example retains its independent MapLibre load after TypeScript transformation', () => {
  const filename = path.join(root, 'example/App.tsx');
  const { ast } = require('@babel/core').transformFileSync(filename, {
    ast: true,
    configFile: false,
    babelrc: false,
    presets: [require.resolve('@react-native/babel-preset')],
  });
  let references = 0;
  require('@babel/traverse').default(ast, {
    StringLiteral(p) {
      if (p.node.value === '@maplibre/maplibre-react-native') references++;
    },
  });
  assert.equal(references, 1);
});

// Exercise Metro's actual dependency collection, exports resolution and runtime.
// The peer models MapLibre 11's separate ESM/CJS builds and native registration.
async function bundle({ installed = true, legacy = false, broken = false, unmount = false, mount = true, platform = 'ios', dev = false, realPeer = false, packaged = false } = {}) {
  const dir = realpathSync(mkdtempSync(path.join(tmpdir(), 'radar-map-loading-')));
  const write = (name, source) => {
    const file = path.join(dir, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, source);
    return file;
  };
  try {
    const react = write('react.js', `
      const states = []; const effects = []; let cursor = 0;
      export function useState(value) {
        const i = cursor++;
        if (!(i in states)) states[i] = value;
        return [states[i], value => { states[i] = value; global.updates++; }];
      }
      export function useEffect(effect) { if (!global.rerender) effects.push(effect); }
      export function reset() { cursor = 0; }
      export { effects };
      export default { createElement: (type, props, ...children) => ({ type, props, children }) };
    `);
    const native = write('native.js', 'export const View = "View"; export const Image = "Image";');
    const jsx = write('jsx.js', 'export const jsx = (type, props) => ({ type, props, children: props.children }); export const jsxs = jsx; export const jsxDEV = jsx;');
    const radar = write('radar.js', 'export default { getLocation: async () => ({}) };');
    const helpers = write('helpers.js', `
      export const getHost = async () => 'https://api.radar.io';
      export const getPublishableKey = async () => 'pk_test';
      export const getMobileOrigin = async () => 'com.test';
    `);
    const styles = write('styles.js', 'export default {};');
    const asset = write('asset.js', 'module.exports = 1;');
    if (realPeer) {
      mkdirSync(path.join(dir, 'node_modules/@maplibre'), { recursive: true });
      symlinkSync(process.env.MAPLIBRE_TEST_PACKAGE_ROOT, path.join(dir, 'node_modules/@maplibre/maplibre-react-native'), 'dir');
    } else if (installed) {
      write('node_modules/@maplibre/maplibre-react-native/package.json', JSON.stringify({
        name: '@maplibre/maplibre-react-native',
        exports: { '.': { import: './lib/module/index.js', require: './lib/commonjs/index.js' } },
      }));
      for (const kind of ['module', 'commonjs']) {
        write(`node_modules/@maplibre/maplibre-react-native/lib/${kind}/index.js`, `
          global.builds.push('${kind}');
          if (global.registered) throw new Error('Tried to register two views with the same name MLRNGeoJSONSource');
          global.registered = true;
          ${broken ? "throw new Error('native initialization failed');" : ''}
          export const Map = 'Map'; export const GeoJSONSource = 'GeoJSONSource'; export const Layer = 'Layer';
          export const TransformRequestManager = { addHeader: header => global.headers.push(header) };
        `);
      }
    }
    const source = packaged ? readFileSync(path.join(root, 'dist/ui/map.jsx'), 'utf8') : mapSource;
    write('map.jsx', legacy ? source.replace(
      "await import('@maplibre/maplibre-react-native')",
      "require('@maplibre/maplibre-react-native')",
    ) : source);
    write('entry.js', `
      ${installed && !broken ? "import * as appMapLibre from '@maplibre/maplibre-react-native'; global.appMap = appMapLibre.Map;" : ''}
      import RadarMap from './map';
      import { effects, reset } from 'react';
      global.renderMap = () => { reset(); return RadarMap({ mapOptions: { mapStyle: 'custom', showUserLocation: false } }); };
      global.initial = ${mount ? 'global.renderMap()' : 'null'};
      global.cleanups = effects.map(effect => effect());
    `);
    const defaults = await getDefaultConfig(root);
    const config = {
      ...defaults,
      projectRoot: dir,
      watchFolders: [...new Set([dir, path.join(root, 'node_modules'), path.dirname(path.dirname(runtimeRequire.resolve('metro/package.json')))])],
      maxWorkers: 1,
      reporter: { update() {} },
      resolver: {
        ...defaults.resolver,
        useWatchman: false,
        nodeModulesPaths: [path.join(root, 'node_modules'), ...(realPeer ? [path.join(process.env.METRO_TEST_RUNTIME_ROOT, 'node_modules')] : [])],
        unstable_enablePackageExports: true,
        resolveRequest(context, name, platform) {
          const stub = { react, 'react/jsx-runtime': jsx, 'react/jsx-dev-runtime': jsx, 'react-native': native, '../index.native': radar, '../helpers': helpers, './styles': styles, './map-logo.png': asset, 'missing-asset-registry-path': asset }[name]
            || (realPeer && name.startsWith('react-native/') ? native : null);
          return stub ? { type: 'sourceFile', filePath: stub } : context.resolveRequest(context, name, platform);
        },
      },
      transformer: {
        ...defaults.transformer,
        babelTransformerPath: require.resolve('metro-babel-transformer'),
        allowOptionalDependencies: true,
        asyncRequireModulePath: runtimeRequire.resolve('metro-runtime/src/modules/asyncRequire'),
        getTransformOptions: async () => ({ transform: { experimentalImportSupport: true, inlineRequires: true } }),
      },
      ...(realPeer ? { serializer: {
        ...defaults.serializer,
        customSerializer: (_entry, _pre, graph) => JSON.stringify([...graph.dependencies.keys()]),
      } } : {}),
    };
    write('babel.config.js', `module.exports = { presets: [${JSON.stringify(runtimeRequire.resolve('@react-native/babel-preset'))}] };`);
    const result = await Metro.runBuild(config, { entry: 'entry.js', platform, dev, minify: !dev });
    if (realPeer) return JSON.parse(result.code);
    const warnings = [];
    const context = vm.createContext({
      builds: [], headers: [], updates: 0,
      console: { ...console, warn: message => warnings.push(message) },
      setTimeout, clearTimeout,
      __DEV__: dev,
    });
    vm.runInContext(result.code, context);
    if (unmount) context.cleanups.forEach(cleanup => cleanup?.());
    // Flush async imports, helper promises, and React state updates.
    await new Promise(resolve => setImmediate(resolve));
    context.rerender = true;
    const tree = mount ? context.renderMap() : null;
    return { builds: Array.from(context.builds), headers: Array.from(context.headers), warnings, tree, initial: context.initial, updates: context.updates };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('reproduces duplicate registration when Radar requires the CommonJS build', async () => {
  const result = await bundle({ legacy: true });
  assert.deepEqual(result.builds, ['module', 'commonjs']);
  assert.match(result.warnings[0], /Tried to register two views with the same name MLRNGeoJSONSource/);
  assert.equal(result.tree, null);
});

for (const platform of ['ios', 'android']) {
  for (const dev of [false, true]) {
    test(`shares the app's ESM build and configures the map (${platform}, dev=${dev})`, async () => {
      const result = await bundle({ platform, dev });
      assert.deepEqual(result.builds, ['module']);
      assert.deepEqual(result.warnings, []);
      assert.equal(result.initial, null);
      const map = result.tree.children[0];
      assert.equal(map.type, 'Map');
      assert.equal(map.props.mapStyle, 'https://api.radar.io/maps/styles/custom?publishableKey=pk_test');
      assert.equal(result.headers[0].name, 'X-Radar-Mobile-Origin');
      assert.equal(result.headers[0].value, 'com.test');
    });
  }
}

test('bundles without the optional peer and reports the loading error', async () => {
  const result = await bundle({ installed: false });
  assert.deepEqual(result.builds, []);
  assert.equal(result.tree, null);
  assert.match(result.warnings[0], /Failed to load MapLibre/);
});

test('does not load MapLibre until a map is mounted', async () => {
  const result = await bundle({ installed: false, mount: false });
  assert.deepEqual(result.builds, []);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.updates, 0);
});

test('reports initialization failures instead of silently rendering a blank map', async () => {
  const result = await bundle({ broken: true });
  assert.equal(result.tree, null);
  assert.match(result.warnings[0], /native initialization failed/);
});

test('does not update state or configure headers after unmount during loading', async () => {
  const result = await bundle({ unmount: true });
  assert.equal(result.updates, 0);
  assert.equal(result.tree, null);
  assert.equal(result.headers.length, 0);
});

if (process.env.MAPLIBRE_TEST_PACKAGE_ROOT) {
  for (const legacy of [true, false]) {
    test(`actual MapLibre package includes ${legacy ? 'both builds before' : 'only ESM after'} the fix`, async () => {
      const files = await bundle({ realPeer: true, legacy });
      const registrations = files.filter(file => file.endsWith('/GeoJSONSourceNativeComponent.ts'));
      assert.equal(registrations.length, legacy ? 2 : 1);
      assert.ok(registrations.some(file => file.includes('/lib/module/')));
      assert.equal(registrations.some(file => file.includes('/lib/commonjs/')), legacy);
    });
  }
}

if (process.env.MAP_LOADING_TEST_PACKAGED) {
  test('the published JSX asset preserves ESM loading', async () => {
    const result = await bundle({ packaged: true });
    assert.deepEqual(result.builds, ['module']);
    assert.deepEqual(result.warnings, []);
    assert.equal(result.tree.children[0].type, 'Map');
  });
}
