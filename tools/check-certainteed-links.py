#!/usr/bin/env python3
"""Quarterly check: every outbound certainteed.com / widen.net link used on the
site must still resolve (CertainTeed rotates DAM asset URLs roughly annually).
Run from repo root: python3 tools/check-certainteed-links.py"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
import re, sys

root = Path(__file__).resolve().parents[1] / 'site-src/docs'
pat = re.compile(r'https?://(?:[a-z0-9.-]*certainteed\.com|certainteed\.widen\.net)[^"\'\s<>]*', re.I)
urls = {}
for p in root.rglob('*.html'):
    for u in pat.findall(p.read_text()):
        urls.setdefault(u, []).append(p.relative_to(root).as_posix())

bad = 0
for u in sorted(urls):
    try:
        r = urlopen(Request(u, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'}), timeout=20)
        code = r.status
    except HTTPError as e:
        code = e.code
    except URLError as e:
        code = f'ERR {e.reason}'
    ok = code == 200
    bad += not ok
    print(f'{"OK " if ok else "FAIL"} {code} {u}  ({len(urls[u])} page(s))')
print(f'\n{len(urls)} links checked, {bad} failing')
sys.exit(bool(bad))
