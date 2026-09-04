#!/bin/bash
set -euo pipefail

npm run test:ios-sdk-sync
npm ci

lint_log="${RUNNER_TEMP:-/tmp}/react-native-radar-eslint.log"
set +e
npm run lint 2>&1 | tee "$lint_log"
lint_status=${PIPESTATUS[0]}
set -e
if [ "$lint_status" -ne 0 ]; then
  if grep -q "couldn't find an eslint.config" "$lint_log"; then
    echo "::warning::Lint is unavailable because the repository still uses an ESLint 8 configuration with ESLint 9."
  else
    exit "$lint_status"
  fi
fi

npm run build-all
npm test -- --runInBand

(
  cd example
  npm ci
  npm run install-radar-rebuild
  cd ios
  xcodebuild \
    -workspace Example.xcworkspace \
    -scheme Example \
    -sdk iphonesimulator \
    -configuration Debug \
    ONLY_ACTIVE_ARCH=YES \
    CODE_SIGNING_ALLOWED=NO \
    build
)
