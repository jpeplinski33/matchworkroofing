# HANDOFF — Matchwork: GBP plan delivered; 7 decisions waiting on Jordan — 2026-09-10
Updated: 2026-09-10 12:02 EDT — session `6ac9fe70-0f45-4dd5-a767-c74d92ffbf1d` (Claude **Opus 5, 1M context** — Fable 5.1 was requested but a CLI launch does NOT preserve a Fable binding; record the model that actually resolves). Successor of `2dc2683d`. Jordan is NOT DRIVING: headless `claude -p` leg; all seven decisions were spoken with `say -r 190`.

## THE SITE IS DONE. DO NOT REBUILD IT.
No site file was created, edited, encrypted, committed or deployed this session. `docs/` untouched. Look, feel, typography and voice unchanged.

## Rulings (Jordan — verbatim intent, do not paraphrase or re-litigate)
- "I like the current version of the website the best so far. DO NOT change it I want it preserved in its current form." (2026-09-09 19:05) — the ORIGINAL site. Tag `approved-2026-09-09` (annotated, object 60cd5d1) → commit **`251852f`** — resolved this session with `git rev-parse approved-2026-09-09^{commit}`.
- "This is the base that I want to build off of and the direction I want to take it with regards to the branding. We can update it from here but this look feel and vibe I like." (2026-09-10 11:25)
- Contact email = `info@matchworkroofing.com`, never his name. (DONE 8b43913)
- Wants the Google Maps 3-pack; wanted more service areas (DONE bf614bc) and a Newman-style referral program (DONE bf614bc, reward still placeholder).
- Four-trade mock-v2 build REJECTED ("appalling" copy, "kindergartner's" font). Never redeploy it.

## State (verified facts only — each says HOW)
- `main` = **`09d31a2`** — `git ls-remote origin main`. This is the predecessor's docs/handoff commit on top of the approved `bf614bc`.
- **The published site is byte-identical to `bf614bc`** — `git rev-parse bf614bc:docs` == `09d31a2:docs` == `32b3aa6354a88af7b06ab92abc513495df5e2069`, and `git diff --name-only bf614bc 09d31a2 -- docs/ site-src/` is empty. (The resume prompt expected main==bf614bc; this deviation was proved benign rather than treated as a STOP.)
- GitHub Pages **status "built" on `09d31a2`**, updated 2026-09-10T15:50:22Z — `gh api repos/jpeplinski33/matchworkroofing/pages/builds/latest`.
- Site is **16 pages**. Gate ON. Passphrase lives only in `STATICRYPT_PASSWORD` at encrypt time.
- Repo is **PUBLIC** and **20 plaintext files are tracked under `site-src/docs/`** — `gh repo view`, `git ls-files`. **The gate is bypassable via the repo.** See decision (f).
- Services the site actually sells (checked this session): architectural roof replacement (incl. Grand Manor, Landmark PRO, standing-seam metal), ITEL shingle match testing, storm damage & insurance claims. **Gutters appear only in blog text; siding appears once and only as a surface shingle color is matched to.** This matters for GBP categories.
- **Still UNKNOWN:** that `/service-areas.html` and `/referral.html` render in a browser. This machine cannot reach Cloudflare at all (both IPs time out at TCP connect, curl 28). Needs Jordan on cellular.

## Delivered this session
`~/Projects/matchwork-website-revamp-2026-09-06/deliverables/`
- **`GBP-PLAN-2026-09-10.md`** — the deliverable. 31 communities verbatim from source, the 20-area GBP cap + prioritized 20 and the 11 held back, categories, the honest Tier1/2/3 lever ranking with the website's real role, NAP + citations, reviews, photos, Q&A, execution order, and what it does NOT claim.
- `GBP-CATEGORIES-RESEARCH-2026-09-10.md` · `GBP-NAP-CITATIONS-2026-09-10.md` · `gbp-us-categories-2026-09-10.tsv` (4,044 real Google categories, the ground truth)
- **`OPEN-DECISIONS-FOR-JORDAN-2026-09-10.md`** — the 7 decisions in one table.

### The plan's headline findings
- **Primary category = `Roofing contractor`, and it is not a choice** — no "Roofer"/"Roof repair service"/"Roof inspection service" exists in the 4,044-row en-US list.
- **No Google category exists for insurance restoration.** Near-misses are traps (`Water/Fire damage restoration service` = a different trade; `Loss adjuster` = a licensed activity in Ohio, hard reject; `Roofing supply store` = retail/suspension risk). That relevance must come from the profile's services list, description, linked pages and reviews.
- **Secondaries are ALL conditional** on what Matchwork actually does — on website evidence only the primary is confirmable.
- **GBP caps service areas at 20**, the site lists 31. Re-verify the cap in the interface at entry time.
- **The website is Tier 2 support, not the lever.** Proximity, primary category, and review volume+velocity decide the 3-pack.
- `roofing-review-builder` skill is the review engine but is **branded for RSO** — point it at Matchwork before the first run.

## 7 OPEN DECISIONS — ALL SPOKEN TO JORDAN, ALL WAITING
Full table: `OPEN-DECISIONS-FOR-JORDAN-2026-09-10.md`.
- **(a)** Referral reward amount + trigger — placeholder `$100 Visa gift card… once your referral's appointment is scheduled`, `<!-- OWNER DECISION -->` at `site-src/docs/referral.html:95`. His money.
- **(b)** Form backend — **all 9 lead forms are dead mockups; every lead typed into the live site is discarded.** May cost money.
- **(c)** "Owens Corning" / "certif\*" in his approved copy (locations below). His call.
- **(d)** Browser verification of the two new URLs — needs his phone on cellular.
- **(e)** Radius: Cardington, Marengo, Utica, Mount Vernon, Centerburg, Lancaster were DROPPED. Confirm.
- **(f)** Public repo + tracked plaintext = the gate has a back door. (Finding of 2026-09-09, re-verified still live.)
- **(g)** **NEW:** fabricated `streetAddress` in JSON-LD on **10 pages** ("Columbus Metro Hub", "…Service Hub") + schema name missing "LLC". Same class as the 555 phone. **Invisible fix, zero copy change**, but needs a rebuild+redeploy.

## Pre-existing copy NOT touched (Jordan's approved text)
- "Owens Corning": `index.html` ×1, `blog/hail-damage-vs-blistering-ohio.html` ×1, `services/roof-replacement-columbus.html` ×2.
- "certif\*": `services/shingle-matching-test.html` ×5, `services/roof-replacement-columbus.html` ×2, `services/storm-damage-insurance-claims.html` ×2.

## Ruled out — do not re-raise
The street addresses in `locations/*.html` (2100 Tremont Rd, 5600 Memorial Dr, 400 Olentangy St, 7000 Market St, …) are **`placeholder=` example text in form fields** asking the homeowner for their own address. Benign.

## In flight at rollover
- **None.** Both research subagents completed and their files are on disk. **All three assigned tasks are COMPLETE.** There is no unfinished work — the session rotated on context, not mid-task.

## Next action (exact, first thing the successor does)
1. Origin banner; arm watcher; **check for a second `claude -p` on this cwd and kill any stale one before working** (this trap fired again this session — PID 74533).
2. Verify `git ls-remote origin main` and that `<sha>:docs` still equals `32b3aa6354a88af7b06ab92abc513495df5e2069`.
3. **Do not start new work — the 7 decisions are Jordan's.** If he has answered any, execute that one.
4. If and only if he green-lights (g): fix the JSON-LD `streetAddress`/`name` on the 10 pages in `site-src/docs/`, re-encrypt per the documented procedure, assert 0 plaintext HTML in `docs/`, commit, push, poll the Pages build. Zero visible copy may change.

## Human-only gates (never auto-do)
Gate removal · DNS/Cloudflare · CNAME/_headers/gate-template · spend · **GBP creation or claiming** · reward amount final · password resets · force-push/history rewrite · mock-v2 deploy.

## Provenance
- Session `6ac9fe70-0f45-4dd5-a767-c74d92ffbf1d` · transcript `~/.claude/projects/-Users-jpmackbookpro-Projects-matchworkroofing/6ac9fe70-0f45-4dd5-a767-c74d92ffbf1d.jsonl`
- Doctrine dir `~/.ai-session-doctrine/claude/6ac9fe70-0f45-4dd5-a767-c74d92ffbf1d/` (context.log, ROLLOVER-*, scorecard.json)
- **Context at rollover: Context: 117K abs · +69K above 48K baseline** — measured by context-watch.py 2026-09-10T16:02:30Z, last line of that dir's `context.log`. Never estimated.
- Resume prompt: `prompts/matchwork-gbp-decisions-resume-2026-09-10-b.md`
- Model actually resolved: **claude-opus-5[1m]** (Fable 5.1 requested, not preserved by CLI launch).
- Cost: lead + 2 research subagents (90,041 + 60,674 subagent tokens). **USD UNAVAILABLE.**
