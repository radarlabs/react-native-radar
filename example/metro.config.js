const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// Exclude react/react-native from parent node_modules
config.resolver.blockList = [
  /\/node_modules\/react\//,
  /\/node_modules\/react-native\//,
].map(re => new RegExp(workspaceRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + re.source));

module.exports = config;