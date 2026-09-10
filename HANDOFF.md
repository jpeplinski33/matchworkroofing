# HANDOFF — Matchwork original site: service areas + referral program — 2026-09-09
Updated: 2026-09-10 11:35 EDT — session 291fd600-9fd2-42c1-aa69-fa6501c6776b (Claude Fable 5.1 HIGH, successor of 785cebf3 / parallel to 3ae2f731). Jordan is DRIVING in the desktop app but the successor is a headless leg: speak milestones with direct `say`.

## Rulings (Jordan — verbatim intent, do not paraphrase or re-litigate)
- "I like the current version of the website the best so far. DO NOT change it I want it preserved in its current form." (19:05 EDT) — the ORIGINAL 14-page site, tag approved-2026-09-09.
- "This is the base that I want to build off of and the direction I want to take it with regards to the branding. We can update it from here but this look feel and vibe I like." (2026-09-10 11:25 EDT)
- Contact email = info@matchworkroofing.com, never his name. (DONE 8b43913)
- "Why don't we have more service areas listed? Look at Newman's page … If our goal is to dominate the Google maps three pack, how are we gonna do that when we don't even have as many places listed?" (2026-09-10 11:25 EDT)
- "I want to implement a referral program like Newman has: https://newmanroofing.com/referral/" (2026-09-10 11:25 EDT)
- Earlier today: four-trade mock-v2 build REJECTED (copy "appalling", Sora font "kindergartner's"). Never redeploy it.

## State (verified facts only)
- Live = GitHub Pages main:/docs, Cloudflare-proxied (true A = 104.21.40.106 / 172.67.150.185 via DoH), StatiCrypt gate ON. HEAD 8b43913 (Pages build "built", verified via gh api). Tag approved-2026-09-09 = 251852f.
- SOURCE for the original site = site-src/docs/ (plaintext HTML, Tailwind CDN + Google Fonts, NO build step, 14 pages: index, portfolio-map, 3 services, 5 locations (dublin, new-albany, powell, upper-arlington, westerville), blog index + 3 posts). Edit there, then encrypt (procedure below), rsync into docs/, commit, push, poll Pages.
- Encrypt procedure (proven twice tonight): copy site-src + .staticrypt.json to a scratch dir; passphrase from ~/ai-brain/memory/matchwork-site-gated-trades-deploy-2026-09-09.md (regex passphrase `...`) into STATICRYPT_PASSWORD only; run the npx staticrypt command from docs/README-GATE.md with --short; OUTPUT LANDS IN <scratch>/docs/ (not site-src/docs); rsync <scratch>/docs/ into docs/; assert 0 plaintext html; commit; push; `gh api repos/{owner}/{repo}/pages/builds/latest` until built.
- Breezeline home path sinkholes the apex to 18.204.152.241 (TLS fails, HTTP 204). Local fetches are NON-EVIDENCE. Verify with DoH-resolved --resolve fetch (compare served sha to docs/ file) or tell Jordan cellular.
- Newman service areas (subagent, fetched 2026-09-10 11:30 EDT): one page, heading "Where We're Trusted"; 12 linked primary: Columbus, Delaware, Dublin, Gahanna, Hilliard, Lewis Center, New Albany, Powell, Sunbury, Upper Arlington, Westerville, Worthington; 13 plain additional: Bexley, Canal Winchester, Cardington, Centerburg, Johnstown, Lancaster, Marengo, Mount Vernon, Obetz, Pickerington, Reynoldsburg, Utica, Whitehall; then "And More… Don't see your service area?" + call prompt.
- Newman referral (same fetch): "Refer a Friend" / "It pays to have friends!"; $100 Visa gift card by email when the appointment is scheduled; anyone can refer; form = Your Name (First/Last), Email, Phone, Address, Business Name (optional), Referral Name, Referral Phone, Notes; no fine print.
- Latest proposal/contract = ~/Projects/matchwork-website-revamp-2026-09-06/deliverables/MATCHWORK-CONTRACT-v1.pdf + .docx (16:24 EDT, 2 pp, HSSA notice). Older: deliverables/contract-2026-09-09/Matchwork-Proposal-Agreement-v1.*.
- UNKNOWN: how the original site's forms submit (check index.html form action before adding a referral form); whether a GBP exists (research says NOT STARTED).

## In flight at rollover
- None. Subagent research is captured above.

## Missing / blocked
- Referral reward amount and trigger = Jordan's money decision. Build with Newman's shape and the $100-at-scheduled-appointment default clearly flagged before/after; do not invent fine print.
- Honest note owed to Jordan: a website service-area list does not by itself move the Maps 3-pack (GBP service areas, reviews, proximity, categories do). Say it plainly and still build the list; add the same list to the GBP plan.

## Next action (exact)
1. Origin banner; arm watcher; verify HEAD 8b43913 and tag.
2. Build the service-area section (index + a /service-areas.html page): primary = existing 5 location pages + Columbus, linked; additional = Central Ohio list (start from Newman's 25, drop Cardington/Marengo/Utica/Mount Vernon/Lancaster/Centerburg unless Jordan wants that radius; add Worthington, Hilliard, Gahanna, Delaware, Lewis Center, Sunbury, Bexley, Grandview Heights, Clintonville, Pickerington, Reynoldsburg, Canal Winchester, Grove City, Galena, Plain City, Marysville) — same Tailwind classes, same vibe.
3. Build /referral.html modeled on Newman; wire the form the same way the existing site forms work; link it from header/footer.
4. Encrypt, verify, push, poll Pages, DoH-verify, then show Jordan before/after in chat AND `say` a one-line summary.

## Human-only gates
- Gate removal, DNS/Cloudflare, CNAME/_headers, spend, GBP creation, reward amount final, force-push/history.

## Provenance
- Session id: 291fd600-9fd2-42c1-aa69-fa6501c6776b · Transcript: ~/.claude/projects/-Users-jpmackbookpro-Projects-matchworkroofing/291fd600-9fd2-42c1-aa69-fa6501c6776b.jsonl
- Context at rollover: 2026-09-09T22:34:40Z absolute=129296 work=55681 baseline=73615 state=ok (measured)
- Doctrine dir: ~/.ai-session-doctrine/claude/291fd600-9fd2-42c1-aa69-fa6501c6776b/
- Prior handoffs: ~/Projects/matchwork-website-revamp-2026-09-06/HANDOFF.md · rollovers.log line: 2026-09-10T15:35:35Z 291fd600-9fd2-42c1-aa69-fa6501c6776b
- Cost: lead only + 1 sonnet-medium research subagent (62K tokens); USD UNAVAILABLE.
