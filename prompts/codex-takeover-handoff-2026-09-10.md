# CODEX TAKEOVER — Matchwork Roofing website + launch process — 2026-09-10 12:45 EDT

You are Codex, taking over the ENTIRE Matchwork Roofing process from the Claude fleet. Jordan (owner, Matchwork Roofing LLC, Ohio entity 5671365, Columbus OH) is DRIVING. DO IT FOR JORDAN: execute, don't ask how-to; ask only at human-only gates. Read every reply aloud (`pkill -x say; nohup say -r 190 -f <file> &`). Deliver files by opening them (`open`), revealing in Finder (`open -R`) and linking them; paste text deliverables in ONE fenced block. Write-through every decision to disk before acting.

## READ FIRST (in order)
1. ~/Projects/matchworkroofing/STATUS.md, ROUTE.md, HANDOFF.md (the 12:12 handoff lists 7 open decisions a–g), docs/README-GATE.md (gate + encrypt procedure).
2. ~/Projects/matchwork-website-revamp-2026-09-06/deliverables/OS-DECISIONS-2026-09-09.md (write-through log; append, never rewrite), OPEN-DECISIONS-FOR-JORDAN-2026-09-10.md, OPEN-DECISIONS-2026-09-09.md, OPERATING-SYSTEM-2026-09-09.md (§8.10: pushes to main allowed while the gate is ON), GBP-PLAN-2026-09-10.md.
3. ~/ai-brain/memory/matchwork-site-gated-trades-deploy-2026-09-09.md (passphrase lives ONLY here; use it only as STATICRYPT_PASSWORD; never write it anywhere).

## GROUND TRUTH (verified 12:43 EDT — do not re-investigate)
- LIVE = GitHub Pages, repo jpeplinski33/matchworkroofing, branch main, folder /docs, Cloudflare-proxied (true A records 104.21.40.106 / 172.67.150.185). origin/main = **133d7ed** "Restore saved original website with info contact email only" (Codex, 12:35), Pages status **built** on 133d7ed at 16:36Z. Local main has ONE unpushed commit e9f517e "Record verified live restoration" — push it or drop it, your call, but reconcile first.
- The live site = the ORIGINAL 14-page site (index, portfolio-map, services ×3, locations ×5, blog index + 3 posts), plain Tailwind-CDN HTML, **no build step**; source = site-src/docs/ (plaintext); docs/ = StatiCrypt-encrypted output, never hand-edited. Only change vs the approved tag: email jordan@ → info@matchworkroofing.com (15 places).
- Tag **approved-2026-09-09** = 251852f = the exact site Jordan approved from his phone screenshot. Plaintext exports for reference: logs/site-before-update-251852f/ and logs/site-before-areas-referral-8b43913/ (untracked).
- Encrypt procedure (proven 3×): copy site-src/ + .staticrypt.json to a scratch dir; `export STATICRYPT_PASSWORD=$(python3 -c "...regex passphrase \`...\` from the memory file...")`; run the exact npx staticrypt command in README-GATE.md **with --short**; output lands in `<scratch>/docs/`; rsync into docs/; assert every .html contains "staticrypt"; commit; push; `gh api repos/{owner}/{repo}/pages/builds/latest` until status=built (force with `gh api -X POST .../pages/builds` if none starts in 5 min). Back up docs/ to logs/docs-backup-<ts>/ before every rsync.
- Jordan's home network (Breezeline) sinkholes the apex to 18.204.152.241 (TLS fails / HTTP 204). Local fetches are NON-EVIDENCE. Verify with `--resolve matchworkroofing.com:443:104.21.40.106` and compare the served bytes to docs/, or ask Jordan to check on cellular.
- The repo is PUBLIC and site-src/docs (plaintext) is tracked → the passphrase gate has a back door via github.com. History purge = force-push = human gate.
- In history, NOT live: bf614bc (service-areas.html + referral.html + Newman-style lists, Tailwind style) and 6a658d4 (the 52-page four-trade mock-v2 build — REJECTED, never redeploy). mock-v2 source: ~/Projects/matchwork-website-revamp-2026-09-06/mock-v2 (git repo; build.py carries the §0 ban list + American-English bans).
- No STATUS/ROUTE in the revamp folder; FACTS.md does not exist yet (Lane B was to create it).

## RULINGS (Jordan, verbatim intent — never re-litigate)
- "I like the current version of the website the best so far. DO NOT change it I want it preserved in its current form." (09-09 19:05) — the original site.
- "This is the base that I want to build off of and the direction I want to take it with regards to the branding. We can update it from here but this look feel and vibe I like." (09-10 11:25)
- Email = info@matchworkroofing.com, never his name. DONE.
- "Why don't we have more service areas listed? Look at Newman's page … dominate the Google maps three pack." Wants a service-area list like newmanroofing.com/service-area/additional-service-areas/ (12 linked primary + 13 plain additional + "and more").
- "I want to implement a referral program like Newman has" (newmanroofing.com/referral/: "Refer a Friend / It pays to have friends!", $100 Visa gift card by email when the appointment is scheduled, anyone can refer, form: name/email/phone/address/business/referral name/referral phone/notes).
- Four-trade build: "appalling", "a monkey could write that", font "kindergartner's" → rejected. British spelling and any false crew-structure claim ("one crew", "no subcontracted handoffs") are banned; the honest framing is one company / one contract / one project lead / one warranty. Copy standard: specificity, proof, trade-accurate sequencing, adult tone; every copy change shown before/after in chat.
- Retail-first, never $/sq pricing; no financing copy until a lender is signed; repair-only warranty language; no fake reviews, no AI-generated houses/people, no fabricated addresses, no "certif*", no Owens Corning (CertainTeed only), no 555 numbers, no personal name/cell in site copy, no RSO/JobShutter photos. NOTE: Jordan's APPROVED original copy currently contains "Owens Corning" (index ×1, blog hail ×1, roof-replacement ×2) and "certif*" (shingle-matching ×5, roof-replacement ×2, storm ×2) — conflict is his call (open item 4).

## OPEN ITEMS — WEBSITE (numbered; ask Jordan the ones marked Q)
1. Q: Service areas + referral pages exist at bf614bc but were dropped by the 12:35 baseline restoration. Rebuild them onto the current baseline (same Tailwind style, nav/footer/sitemap links) — yes/no, and same radius? (Dropped from Newman's list: Cardington, Marengo, Utica, Mount Vernon, Centerburg, Lancaster.)
2. Q: Referral reward amount + trigger (Newman: $100 gift card at scheduled appointment). His money.
3. Q: Form backend — all 9 lead forms on the live site are dead mockups; every lead is discarded. Needs an endpoint (Formspree/Netlify-style or Workspace mail) and maybe spend.
4. Q: "Owens Corning" / "certif*" in his approved copy vs the §0 bans — keep or fix?
5. Fabricated JSON-LD streetAddress ("Columbus Metro Hub"/"Service Hub") on ~10 pages + schema name missing "LLC" — invisible fix, rebuild+redeploy; recommend doing it.
6. Q: Browser verification on cellular of whatever is live (nobody on this machine can reach Cloudflare).
7. Public-repo plaintext back door (gitignore site-src/docs going forward = safe; purge history = human gate).
8. www.matchworkroofing.com → 18.204.152.241 on public resolvers — Cloudflare www record is wrong; draft the exact fix, Jordan applies (DNS = human gate).
9. GTM_ID is the placeholder GTM-XXXXXXX; no analytics fire. Always-HTTPS / redirects unverified.
10. Lane A (typography ship + four-trade copy pass, prompts/lane-a-website-execute-2026-09-09.md + lane-a-addendum-copy-standards-2026-09-09.md) is SUSPENDED — it targeted the rejected build. If Jordan wants a redesign lane it must be rewritten against the original site as base and shown to him page by page.
11. Process defect: three `claude -p` legs ran on this cwd at once on 09-10 and one overwrote .ai-session-notes; resume prompts got launched twice. Before any work: `ps aux | grep "claude -p"`, kill stale legs, one owner per file.

## OPEN ITEMS — BUSINESS / LAUNCH (from OPEN-DECISIONS-2026-09-09 + research, all unanswered)
12. Q: Interim logo pick (AGY's 28 concepts; family vote gallery has no persistence). Palette held until logo.
13. Q: Photo budget — 0 real photographs on the site; hired shoot + owner portrait is the answer; number?
14. Friends/former-employer clients leaving reviews — recommendation NO (policy + new-profile filter risk). Q: confirm.
15. Q: GBP — create as service-area business (hidden address), primary "Roofing contractor" (only valid category), 20-area cap vs 31 listed, video verification needs logo on vehicle/sign first. GBP creation = human gate. Plan: GBP-PLAN-2026-09-10.md.
16. Q: Attorney for contract + storm inspection letter + warranty wording (one packet). Latest contract: deliverables/MATCHWORK-CONTRACT-v1.pdf/.docx (2 pp, HSSA 3-day notice).
17. Q: Print vendor + spend (cards, hats, shirts, vehicle magnet).
18. Q: EIN — absent; blocks insurance FEIN + BWC. GL (Atlantic Casualty via Amy Blackstone) drafted, unsigned. WC/BWC, Columbus BZS Home Improvement Contractor registration ($25k bond, $185, exam), bank accounts, Workspace mailboxes: NOT STARTED. Dublin registration UNKNOWN.
19. Mail: MX = Google Workspace exists; SPF, DKIM, DMARC absent → add SPF `v=spf1 include:_spf.google.com ~all`, DKIM from Admin console, DMARC p=none (DNS = human gate). Whether info@/jordan@ actually receive is UNKNOWN — send test.
20. Q: History purge of plaintext (force-push) — recommendation: no, gitignore forward only.
21. CertainTeed tier / SureStart PLUS / Hardie program: zero documentation; "Lifetime Workmanship Warranty" is marketing language with no defined program.
22. Trademark packet incomplete; D01 gate unanswered (Grok-only patent skill is unrelated).

## FIRST ACTIONS
1. Kill stale legs; reconcile local e9f517e vs origin 133d7ed; confirm Pages built; DoH-resolved fetch matches docs/.
2. Put items 1–4, 6, 12–18, 20 to Jordan as ONE numbered list, read aloud, and wait for answers; do item 5 (schema fix) and 7 (gitignore forward) without waiting; draft 8 and 19 as exact Cloudflare changes for him to apply.
3. Every site change: edit site-src/docs → encrypt → verify 0 plaintext → commit (clear message) → push → Pages built → before/after in chat.

## HUMAN-ONLY GATES
Gate removal · DNS/Cloudflare (www, SPF/DKIM/DMARC) · CNAME/_headers/gate template · spend · GBP creation/claiming · reward amount · password resets (never click "forgot password") · force-push/history rewrite · redeploying mock-v2 · 2FA (use iPhone Mirroring, don't ask him to read codes).
