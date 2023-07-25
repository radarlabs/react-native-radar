const fs = require('fs');
const packageJSON = require('../package.json');
const packageLockJSON = require('../package-lock.json');

let tagVersion = process.env.GITHUB_REF_NAME || '';
console.log('Checking tag:', tagVersion);


if (!tagVersion.includes('-beta')) {
  console.error('Prelease version should contain a "-beta" suffix');
  process.exit(1);
}

if (tagVersion !== packageJSON.version) {
  console.error('VERSION MISMATCH - version does not match package.json.');
  process.exit(1);
}
if (tagVersion !== packageLockJSON.version) {
  console.error('VERSION MISMATCH - version does not match package-lock.json.');
  process.exit(1);
}
console.log('Tag OK.', tagVersion);
