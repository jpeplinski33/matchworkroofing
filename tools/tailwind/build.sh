#!/usr/bin/env bash
# Regenerate site-src/docs/assets/utilities.css with the pinned Tailwind 3.4.17,
# mirror site-src/docs to docs/, then run the site verifier.
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then npm ci; fi
npx tailwindcss -c tailwind.config.js -i input.css -o ../../site-src/docs/assets/utilities.css --minify
rsync -a --delete ../../site-src/docs/ ../../docs/
status=0
python3 ../verify-site.py > /dev/null || status=$?
echo "utilities.css bytes: $(wc -c < ../../site-src/docs/assets/utilities.css | tr -d ' ')"
exit "$status"
