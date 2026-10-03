#!/usr/bin/env python3
"""Print rejected HTML copy with file/line numbers; exit 1 on a match.

Existing asset filenames are exempt: Jordan explicitly retained those names.
With no arguments, scan the source of truth. Optional paths support spot checks.
"""
from pathlib import Path
import re
import sys

PHRASES = (
    "Get an Estimate", "Get an Upfront Estimate", "for Central Ohio Homes",
    "swatch", "Swatch", "not a Matchwork installation", "not a MATCHWORK",
    "manufacturer blistering", "Primary Service", "premium discount",
    "save money", "rest with your insurer", "Craftsmanship With the Paperwork",
)
PATTERN = re.compile("|".join(re.escape(phrase) for phrase in PHRASES))
ASSET_PATH = re.compile(r'''["']/assets/[^"']+["']''')


def main():
    roots = [Path(arg) for arg in sys.argv[1:]] or [
        Path(__file__).resolve().parents[1] / "site-src/docs"
    ]
    pages = sorted({p for root in roots for p in (
        root.rglob("*.html") if root.is_dir() else [root]
    )})
    matches = 0
    for page in pages:
        for number, line in enumerate(page.read_text().splitlines(), 1):
            if PATTERN.search(ASSET_PATH.sub('"asset-path"', line)):
                print(f"{page}:{number}: {line.strip()}")
                matches += 1
    print(f"Voice scan: {len(pages)} HTML files, {matches} matching lines.")
    return int(matches > 0)


if __name__ == "__main__":
    sys.exit(main())
