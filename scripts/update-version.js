#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Update version.ts
const versionFilePath = path.join(__dirname, '..', 'src', 'version.ts');
const versionFileContent = `// This file contains the version of the react-native-radar package
// It should be updated to match the version in package.json
export const VERSION = '${version}';
`;

fs.writeFileSync(versionFilePath, versionFileContent);
console.log(`Updated version.ts to version ${version}`); 