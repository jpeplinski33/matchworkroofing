# Current state — September 11, 2026

Jordan explicitly authorized public launch: prospects must be able to use the website within an hour without a password and without false CertainTeed, financing, licensing or insurance claims.

Published source revision: e1f48ae0f871daa1583cdd4ab69bd8cf3f9ed823. GitHub Pages build reports built. Public docs are now exact plaintext copies of site-src/docs; the gate is OFF intentionally. Do not re-encrypt or restore historical protected pages. Old gate files are retained only for versioned rollback.

Same 13 content URLs plus retired portfolio redirect. No warranty/certification, financing, licensing/bonding/insured-company claims, Owens Corning, bespoke, emojis, invented map jobs or case studies. CertainTeed product names retained. Lean true company schema. Four trades represented. Business card colors/type applied to existing architecture. Real phone/email contact links replace inert forms.

Actual route completed: Antigravity CLI design -> Claude Fable 5.1 CLI copy (319 changes) -> Codex editorial review/implementation -> Grok CLI PASS at3f7ffce. All four optional low findings addressed; final bounded refinements177899b, public output6c5a52f. Evidence, exact prompts and logs live in sibling matchwork-refresh-2026-09-11. FACTS.md and tools/verify-site.py are authoritative for future work.

No DNS, mailbox, external messages, purchases or credentials changed. Phone(614)741-1393 and info@matchworkroofing.com preserved. No new photo/JobShutter integration. Saved original and rejected builds remain in history and must not overwrite current source.

Owner follow-up published: larger Arial body text and Georgia headings; original card wordmark and navy/gold retained. Friendly Get an Estimate wording replaces Discuss Your Project and other formal sales copy (59 occurrences). New Albany first and Bexley included across service-area lists. Claim/link audit and 26 local desktop/mobile checks pass. Six fresh live-browser checks and 28 public asset/page/domain comparisons pass. Public CSS uses ?v=20260911-2 to bypass old cached stylesheet. Evidence in sibling task deliverables/typography-*.

## 2026-09-15 — OG candidate, local only

Codex added the approved v5 candidate matchwork-og-da1a813a.jpg and head-only OG/Twitter tags to all 14 pages in both site-src/docs and docs. Candidate uses Meyer-Hero.jpg solely for local review; photo choice and publishing await Jordan. No push; copy, body, JSON-LD, CSS, navigation, gate files, CNAME, sitemap and robots unchanged. Capture app needs no changes.

## 2026-09-22 — Brand lockup MATCHWORK(TM) / Roofing & Exteriors (Claude bfb08316), local only

Jordan: "I think I want it as: MATCHWORK / Roofing & Exteriors, with the little TM next to MATCHWORK." Applied to site header wordmark (TM added; lockup already existed), footer brand block (now the same two-line lockup; LLC name stays in the copyright line), page titles and og:title ("| Matchwork Roofing" -> "| Matchwork Roofing & Exteriors"; home title reordered). brand.css gained .mw-tm / .mw-footer-brand rules, cache-busted to ?v=20260922. tools/verify-site.py passes; site-src/docs and docs identical. Commit 8727d88, NOT pushed (pushing would also publish the pending OG candidate).

Same lockup applied to the documents: Proposal & Agreement v1.4 and Master Contract v1.5 (from the 09-18 LLC-RENAME html; builder `build_tm_2026-09-22.py` in matchwork-website-revamp-2026-09-06/deliverables/contract-2026-09-09; docx also renamed to the LLC name), and the RSO-style write-on contract (`matchwork-rso-contract-rebrand-2026-09-19/work/build_writeon_contract.py` header; body text and 144 fields byte-identical by page). Desktop/Matchwork Roofing holds only v1.4/v1.5; older moved to Old versions/. Not touched: business cards, John Lump v4 proposal (delivered), invoice/operating-agreement templates, Google Business Profile.

Correction same morning: Jordan on first look — "looks like shit and you can't make out what it is." The first pass kept the old 15–16.5pt header size, 7pt descriptor and a tiny TM. Rebuilt all three documents with the lockup at 24–25pt wordmark, 9.5pt bold letterspaced descriptor, 10pt TM (TM sits on the cap line; pushing it above the line clipped it at the page edge in Chrome print). Body/pages unchanged (3/4 pp; WriteOn 8 pp, 144 fields, body identical). Word files match. Website was not part of the complaint and was not changed.

## 2026-09-22 midday — email signature (Claude bfb08316)
Jordan wanted the MATCHWORK(TM) lockup in his signature; first said Gmail, then "I'd rather have it work through Apple Mail". Claude in Chrome extension not connected (installed in Default + Profile 1 but not signed in), so Gmail settings were not reachable; a Gmail-ready rich signature was left on the clipboard and at scratchpad gmail-signature.html. Apple Mail: two signatures "Matchwork — Primary" (D7C03C92) and "Matchwork — Reply" (69687D8D), both already mapped to the Google account jordan@matchworkroofing.com (AccountsMap.plist; Primary selected in com.apple.mail.plist SignaturesSelected). Patched the "Matchwork Roofing & Exteriors" span to the lockup in BOTH ~/Library/Mail/V10/MailData/Signatures/*.mailsignature AND ~/Library/Mobile Documents/com~apple~mail/Data/V4/Signatures/*.mailsignature (Mail restored the old file from the iCloud copy the first time). Google account: IMAP enabled, 52 inbox msgs, imap/smtp reachable, no errors in logs — no evidence yet of what "can't get that email to work" means beyond the signature.

## 2026-09-23 — Published OG candidate + TM brand lockup (Kimi CLI)

Jordan authorized publishing the pending local work. Pushed ebb39e4 (v5 OG candidate matchwork-og-da1a813a.jpg + OG/Twitter tags on all 14 pages), a788cb1 (legal name in og:description) and 8727d88 (MATCHWORK(TM) / Roofing & Exteriors lockup in header, footer, titles; brand.css ?v=20260922). Pre-publish: tools/verify-site.py errors=[], site-src/docs and docs identical, gate OFF (no staticrypt), CNAME/sitemap/robots untouched. OG card photo is the Meyer hero already used on the site; TM intentionally omitted from the share-card graphic (lockup text matches; TM is a markup/title element).
