# HANDOFF — Matchwork original site: service areas + referral program — 2026-09-10
Updated: 2026-09-10 11:45 EDT — session 2dc2683d-ca80-4edc-acb6-3a5b235a2141 (Claude Fable 5.1 HIGH, successor of 291fd600). Jordan is NOT DRIVING: this was a headless `claude -p` leg; milestones were spoken with direct `say -r 190`.

## Rulings (Jordan — verbatim intent, do not paraphrase or re-litigate)
- "I like the current version of the website the best so far. DO NOT change it I want it preserved in its current form." (2026-09-09 19:05 EDT) — the ORIGINAL site, tag approved-2026-09-09 = 251852f.
- "This is the base that I want to build off of and the direction I want to take it with regards to the branding. We can update it from here but this look feel and vibe I like." (2026-09-10 11:25 EDT)
- Contact email = info@matchworkroofing.com, never his name. (DONE 8b43913)
- "Why don't we have more service areas listed? Look at Newman's page … If our goal is to dominate the Google maps three pack, how are we gonna do that when we don't even have as many places listed?" (2026-09-10 11:25 EDT) — DONE bf614bc.
- "I want to implement a referral program like Newman has: https://newmanroofing.com/referral/" (2026-09-10 11:25 EDT) — DONE bf614bc, reward amount still placeholder.
- Four-trade mock-v2 build REJECTED (copy "appalling", Sora font "kindergartner's"). Never redeploy it.

## State (verified facts only — each says HOW it was verified)
- HEAD of main = **bf614bc** "feat: add Service Areas and Refer a Friend pages; fix the fake 555 phone in schema" — verified `git ls-remote origin main` = bf614bc.
- GitHub Pages build **status "built" on bf614bc**, created 2026-09-10T15:41:27Z, duration 33.3s — verified `gh api repos/jpeplinski33/matchworkroofing/pages/builds/latest`.
- Deployed bytes are the intended bytes — verified blob-SHA equality: `gh api contents/<f>?ref=bf614bc .sha` == `git hash-object <f>` for docs/service-areas.html, docs/referral.html, docs/index.html, docs/sitemap.xml. All 4 MATCH.
- Site is now **16 pages** (was 14). New: `/service-areas.html`, `/referral.html`. Source = site-src/docs/ (plaintext, Tailwind CDN, no build step); docs/ = encrypted output, never hand-edited.
- docs/ contains **0 plaintext HTML** — verified: all 16 files carry the staticrypt marker and none contains probe strings ("Canal Winchester", "Visa gift card", "Grandview Heights", "Architectural Roofing.", "info@matchworkroofing.com").
- All internal hrefs resolve (script walked every `href="/..."` against the filesystem); all 16 pages pass an HTMLParser tag-balance check.
- Gate is ON. Passphrase lives only in STATICRYPT_PASSWORD at encrypt time, read from ~/ai-brain/memory/matchwork-site-gated-trades-deploy-2026-09-09.md. Never written to a file, commit or chat.
- Backup of the pre-change docs/ = `logs/docs-backup-20260910-113751/` (18 files). Not committed.
- **The DoH-resolved verification could NOT be completed from this machine.** Both Cloudflare A records (104.21.40.106, 172.67.150.185) time out at TCP connect (`connect=0.000000`, curl 28) even with `--resolve`. This is worse than the documented Breezeline sinkhole — outbound to those IPs does not establish at all. The Pages-build + blob-SHA evidence above is what stands in its place. UNKNOWN until someone loads the site on cellular: that the two new URLs render in a browser.

### What was built (bf614bc)
- `/service-areas.html` (19.7KB): hero, 6 linked primary areas (Columbus -> /services/roof-replacement-columbus.html, plus the 5 location pages), 25 plain-text additional Central Ohio communities, closing "Don't see your area? Call (614) 741-1393." band. JSON-LD areaServed = 31 cities, telephone +1-614-741-1393.
- `/referral.html` (18.4KB): "Refer a Friend / It pays to have friends", reward placeholder, 3-step how-it-works, full Newman-shape form (First/Last, Email, Phone, Address, Business optional, Referral Name, Referral Phone, Notes), "Send My Referral" button, "Prefer to call?" tel link.
- index.html: `#locations` grew 8 -> 31 names + "View All Service Areas" button + don't-see-your-area line; JSON-LD areaServed 8 -> 31; new compact navy referral band above the footer.
- Sitewide: both pages added to nav and footer on all 14 old pages; stale `/#locations` anchors repointed to `/service-areas.html`; sitemap.xml 14 -> 16 URLs.

### Two defects found in the approved original site
1. **FIXED in bf614bc — fake 555 phone.** All 9 schema-bearing pages carried `"telephone": "+1-614-555-0199"` in their RoofingContractor JSON-LD while displaying (614) 741-1393. A banned string, and a direct NAP-consistency break for the exact Maps-3-pack goal Jordan asked about. Changed to +1-614-741-1393. Zero visible copy changed, so "preserved in its current form" is intact.
2. **NOT FIXED — flagged for Jordan.** Every one of the 9 existing lead forms is a dead mockup: `<form>` with no action/method, inputs with no `name`, `<button type="button">`. **Every lead submitted on the live site goes nowhere.** Not touched because choosing a form backend is Jordan's call (and may cost money). The new referral form therefore does NOT copy that pattern — its button composes a `mailto:info@matchworkroofing.com` via inline JS (verified: the gate uses `document.write(plainHTML)`, so inline scripts DO execute after unlock), with a `tel:` fallback beneath it.

### Pre-existing copy NOT touched (Jordan's approved text; §0 would ban it in new work)
- "Owens Corning" appears in index.html (x1), blog/hail-damage-vs-blistering-ohio.html (x1), services/roof-replacement-columbus.html (x2).
- "certif*" appears in services/shingle-matching-test.html (x5), services/roof-replacement-columbus.html (x2), services/storm-damage-insurance-claims.html (x2).
- Left alone deliberately: rewriting approved copy is Jordan's decision, not a build decision. Raise it with him.

## In flight at rollover
- None. Both build subagents (opus-high) completed and their files are committed.

## Missing / blocked
- **Referral reward amount + trigger = Jordan's money decision.** Shipped placeholder: "$100 Visa gift card, emailed to you once your referral's appointment is scheduled." Marked in source with `<!-- OWNER DECISION: reward amount and trigger — placeholder default below, confirm before this goes public -->` at site-src/docs/referral.html:95. No fine print invented.
- **Form backend** — 9 dead forms + the referral mailto stopgap. Needs a decision (and possibly spend).
- **Browser verification of the two new URLs** — blocked by the network, needs cellular or another machine.
- **The honest Maps-3-pack note, owed and DELIVERED by `say`:** a website service-area list does not by itself move the Maps 3-pack. GBP service areas, review volume/velocity, categories and searcher proximity do. The website list supports it (relevance + landing pages) but is not the lever. The same 31-community list must go into the GBP plan.

## Next action (exact, first thing the successor does)
1. Origin banner; arm watcher; verify `git ls-remote origin main` = bf614bc and `gh api .../pages/builds/latest` = built.
2. Put the 31-community list into the GBP plan doc (~/Projects/matchwork-website-revamp-2026-09-06/deliverables/) as the GBP "service areas" entry, and write the honest 3-pack lever list (categories, reviews, proximity, NAP) beside it.
3. Ask Jordan (via the log + `say`, no waiting): confirm the $100/at-scheduled-appointment reward, and decide the form backend.
4. Do NOT touch the 9 dead forms or the Owens Corning / certif copy without Jordan's word.

## Human-only gates (never auto-do)
- Gate removal, DNS/Cloudflare, CNAME/_headers/gate-template, spend, GBP creation, reward amount final, password resets, force-push/history rewrite, mock-v2 deploy.

## Provenance
- Session id: 2dc2683d-ca80-4edc-acb6-3a5b235a2141 · Transcript: ~/.claude/projects/-Users-jpmackbookpro-Projects-matchworkroofing/2dc2683d-ca80-4edc-acb6-3a5b235a2141.jsonl
- Context at rollover: Context: 112K abs · +65K above 47K baseline — measured by context-watch.py at 2026-09-10T15:41:51Z (never estimated).
- Doctrine dir: ~/.ai-session-doctrine/claude/2dc2683d-ca80-4edc-acb6-3a5b235a2141/
- Prior handoffs: this file's 291fd600 revision (in git history) · ~/Projects/matchwork-website-revamp-2026-09-06/HANDOFF.md
- Cost: lead + 2 opus-high build subagents (65,792 + 65,355 subagent tokens). USD UNAVAILABLE.
