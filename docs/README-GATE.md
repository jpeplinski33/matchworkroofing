# Matchwork private preview build

Current editable website: `site-src/docs/`. The rejected mock-v2 is not a source for this site.

1. Read root `FACTS.md`. Only verified owner-approved claims belong on the website.
2. Edit the existing plaintext pages and shared `assets/brand.css`.
3. Run `python3 tools/verify-site.py` from the repository root. It rejects banned claims, broken local links/anchors, invalid structured data, dead forms, retired-map links, missing mobile navigation, and the Tailwind development CDN.
4. If utility classes change, regenerate `assets/utilities.css` with Tailwind 3.4.17. Brand fonts are served locally.
5. Build every HTML page with StatiCrypt 3.5.4 in a scratch directory, using the existing `.staticrypt.json` and `site-src/gate-template.html`. Password comes from STATICRYPT_PASSWORD only. Preserve the salt/template and 30-day remember setting. Never log the password.
6. Decrypt all generated pages and require byte-for-byte equality with the plaintext source. Copy verified encrypted HTML and static assets into `docs/`.
7. Check desktop/mobile appearance and have the reviewer inspect the exact candidate revision before publication. The original 14 URLs remain: the retired portfolio URL is a noindex redirect home.

The production branch is main, served from docs. Removing the password gate, changing its template, changing DNS/CNAME, or taking the site public requires Jordan's explicit direction. No automatic form submission backend is installed: current contact actions are phone and email links.

Canonical refresh evidence and guarded build helper: sibling project `matchwork-refresh-2026-09-11/`, tools/build_gate.py and deliverables/. Current root FACTS.md supersedes claims in historical plans and handoffs. No assets from the old project map or made-up case studies may be restored.
