const fs = require('fs');
const packageJSON = require('../package.json');
const packageLockJSON = require('../package-lock.json');

let tagVersion = process.env.GITHUB_REF_NAME || '';
console.log('Checking tag:', tagVersion);

if (!tagVersion.startsWith('v')) {
  console.error('Tag must start with "v"');
  process.exit(1);
}
if (tagVersion.includes('-')) {
  console.error('Latest tag should not include any suffix:', `-${tagVersion.split('-')[1]}`);
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
