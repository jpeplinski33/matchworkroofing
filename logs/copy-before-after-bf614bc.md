# Before/After Copy Record — commit bf614bc (parent 8b43913)

Scope: `site-src/docs/` plaintext source tree only. The encrypted `/docs/` ciphertext tree is
excluded entirely per instructions (its diff is meaningless noise). Read-only investigation via
`git show` / `git diff` / file reads — nothing in the repo was modified to produce this record.

## ⚠️ TOP-LINE FLAG: one look/typography change slipped in

On **`site-src/docs/index.html`**, three of the eight original service-area chips (Bexley,
Grandview Heights, Worthington) were **restyled**, not just moved. They went from:

```html
<span class="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">📍 Bexley, OH</span>
```

(a bordered white pill, drop-shadow, rounded-lg, px-4/py-2 padding, location-pin emoji, "OH" suffix
— same visual weight as every other city chip on the page) to:

```html
<span>Bexley</span>
```

sitting inside a new plain container:

```html
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2 text-xs text-slate-600 text-center">
```

i.e. no border, no background, no shadow, no rounding, no padding, no pin emoji, no "OH" suffix,
smaller/lighter (`text-xs text-slate-600` vs. the pill's implicit slate-700 on white-card). This is
a genuine visual demotion of those three cities from "card" styling to bare list text — exactly the
kind of typography/visual-weight change the owner ordered must not happen. Everything else in the
diff (new nav links, new sections, new pages, telephone digits, sitemap entries) reuses the site's
existing Tailwind classes verbatim with no color/font/size/spacing-scale changes. No `<title>`,
meta description, or canonical value changed anywhere in this diff.

---

## 1. Modified existing pages — changed visible-text lines (BEFORE → AFTER)

### 1a. Real text/value swaps (not additions)

| Page | Element | BEFORE | AFTER |
|---|---|---|---|
| index.html, dublin-oh.html, new-albany-oh.html, powell-oh.html, upper-arlington-oh.html, westerville-oh.html, roof-replacement-columbus.html, shingle-matching-test.html, storm-damage-insurance-claims.html (all 9 pages carrying the RoofingContractor JSON-LD) | JSON-LD `telephone` | `"+1-614-555-0199"` | `"+1-614-741-1393"` |
| sitemap.xml | homepage `<lastmod>` | `2026-08-27` | `2026-09-10` |

No other pre-existing rendered copy line had its wording changed — every other diff hunk on these
pages is either (a) a brand-new nav/footer link added next to existing ones, (b) a href retarget
with the same visible label, or (c) the index.html city-list restructuring covered above and below.

### 1b. Non-visible plumbing (href-only retargets — label text unchanged, listed for completeness, not a copy change)

| Page | Link label (unchanged) | BEFORE href | AFTER href |
|---|---|---|---|
| index.html (nav) | "Storm & Claims" section is unaffected; new "Service Areas" nav item is an addition, not a retarget | — | `/service-areas.html` (new) |
| dublin-oh.html, new-albany-oh.html, powell-oh.html, upper-arlington-oh.html, westerville-oh.html (nav) | city name, e.g. "Dublin, OH" | `/#locations` | `/service-areas.html` |
| dublin-oh.html, new-albany-oh.html, powell-oh.html, upper-arlington-oh.html, westerville-oh.html (breadcrumb) | "Locations" | `/#locations` | `/service-areas.html` |
| portfolio-map.html (nav) | "Service Areas" | `/#locations` | `/service-areas.html` |
| roof-replacement-columbus.html, shingle-matching-test.html, storm-damage-insurance-claims.html (nav) | "Service Areas" | `/#locations` | `/service-areas.html` |

### 1c. Additions to existing pages (no prior "before" — new lines inserted into an already-live page)

**index.html:**
- Nav (sitewide-pattern, added to header): new link **"Service Areas"** → `/service-areas.html`
- Footer "Services" column: new list item **"Refer a Friend"** → `/referral.html`
- Footer "Locations" column: new list item **"All Service Areas →"** → `/service-areas.html`
- New sub-headline under "Suburban Hubs & Service Areas": *"Matchwork Roofing installs and restores roofs across Columbus and the surrounding Central Ohio communities."*
- New linked chip added to the primary row: **"📍 Columbus, OH"** → `/services/roof-replacement-columbus.html`
- New "We Also Serve" card: heading **"We Also Serve"**, then 24 bare city names (Bexley, Blacklick, Canal Winchester, Clintonville, Delaware, Gahanna, Galena, Galloway, German Village, Grandview Heights, Grove City, Groveport, Hilliard, Johnstown, Lewis Center, Marysville, Minerva Park, Obetz, Pataskala, Pickerington, Plain City, Reynoldsburg, Sunbury, Whitehall, Worthington — 24 total)
- New button **"View All Service Areas →"** → `/service-areas.html`
- New line: *"Don't see your area? Call (614) 741-1393."* (phone is a `tel:+16147411393` link)
- Entirely new "Referral Program" section: eyebrow **"Refer a Friend"**, heading **"It pays to have friends."**, body *"Know a neighbor with storm damage, an aging roof, or a shingle that no longer matches? Send them our way. You don't have to be a past customer to refer."*, button **"Refer a Friend →"** → `/referral.html`
- JSON-LD `areaServed`: grew from 8 cities to 31 cities (Columbus, Dublin, New Albany, Powell, Upper Arlington, Westerville, Bexley, Blacklick, Canal Winchester, Clintonville, Delaware, Gahanna, Galena, Galloway, German Village, Grandview Heights, Grove City, Groveport, Hilliard, Johnstown, Lewis Center, Marysville, Minerva Park, Obetz, Pataskala, Pickerington, Plain City, Reynoldsburg, Sunbury, Whitehall, Worthington). BEFORE list was: Columbus, Dublin, Upper Arlington, New Albany, Powell, Westerville, Bexley, Grandview Heights (8).

**dublin-oh.html, new-albany-oh.html, powell-oh.html, upper-arlington-oh.html, westerville-oh.html** (each identical pattern):
- Nav: new link **"Refer a Friend"** → `/referral.html`
- Footer "Services"/similar column: new list item **"Refer a Friend"** → `/referral.html`
- Footer "Locations" column: new list item **"All Service Areas →"** → `/service-areas.html`

**portfolio-map.html:**
- Nav: new link **"Refer a Friend"** → `/referral.html`

**roof-replacement-columbus.html, shingle-matching-test.html, storm-damage-insurance-claims.html:**
- Footer "Services" column: new list item **"Refer a Friend"** → `/referral.html`
- Footer "Locations"/hub column: new list item **"All Service Areas →"** → `/service-areas.html`

**blog/index.html:**
- Nav: new link **"Service Areas"** → `/service-areas.html` (this page did NOT get a "Refer a Friend" nav link — asymmetric with the other blog posts, noted for completeness, not flagged as an error since scope is copy-record only)

**blog/hail-damage-vs-blistering-ohio.html, blog/nail-pops-roof-leaks-powell-dublin.html, blog/shingle-granule-loss-columbus.html:**
- Nav: new links **"Service Areas"** → `/service-areas.html` and **"Refer a Friend"** → `/referral.html`

**sitemap.xml** (not rendered copy, listed for completeness only): two new `<url>` entries added for `/service-areas.html` (priority 0.9) and `/referral.html` (priority 0.7); homepage `<lastmod>` bumped as noted above.

---

## 2. New page: `site-src/docs/service-areas.html` — full copy transcript (NEW, document order)

- **Top bar:** "📍 Roofing Service Areas Across Columbus & Central Ohio" | "🏘️ Suburban Hubs & Surrounding Communities" · "📞 (614) 741-1393" · "info@matchworkroofing.com"
- **Header:** logo mark "MR"; wordmark "MATCHWORK." ; tagline "Central Ohio Roofing Coverage"; nav — "Roof Replacement", "Designer Shingles", "Storm & Claims", "Refer a Friend", "Service Areas" (active); CTA button "Get Upfront Estimate"
- **Breadcrumb:** "Home / Service Areas"
- **Hero:**
  - Eyebrow pill: "Columbus & Central Ohio Residential Roofing Coverage"
  - H1: "Roofing Service Areas Across Central Ohio"
  - Body: "Matchwork Roofing serves Columbus and the suburban communities that ring it — architectural roof replacements, designer slate profiles, storm damage restoration, and ITEL shingle match testing. Same craftsmanship standard and the same white-glove property care whether your home sits on a Dublin cul-de-sac or a century-old Clintonville street."
  - Buttons: "Request Design & Upfront Quote" (→ `/#quote`), "Speak to Specialist: (614) 741-1393" (→ `tel:+16147411393`)
- **Primary Service Areas section:**
  - Eyebrow: "Central Ohio Coverage"
  - H2: "Primary Service Areas"
  - Sub: "Each of these communities has its own architectural character, its own HOA expectations, and its own storm history. Explore the hub closest to your home."
  - 6 cards, each with a 📍 icon, city name, one paragraph, and a link label:
    1. **Columbus, OH** — "From German Village brick to post-war ranches and new-build infill, Columbus roofs run every profile and age. We measure, color-match, and replace to the architecture that's already there." — link: "Columbus Roof Replacement →"
    2. **Dublin, OH** — "Muirfield Village, Tartan Fields, and Ballantrae carry strict architectural review standards. We spec shingle color and profile to pass ARB the first time — and to match the homes beside you." — link: "Dublin Roofing →"
    3. **New Albany, OH** — "Georgian brick, white fence lines, and steep multi-facet estate roofs. Luxury slate-profile shingles and hand-fabricated copper detailing built to hold the neighborhood's uniform look." — link: "New Albany Roofing →"
    4. **Powell, OH** — "Wooded Olentangy-corridor lots mean shaded north slopes, algae streaking, and heavy tree debris in valleys. We build the full system — leak barriers, breathable underlayment, balanced ridge venting." — link: "Powell Roofing →"
    5. **Upper Arlington, OH** — "Tudor, Colonial, and mid-century homes with slate and tile heritage. Older discontinued shingle lines make matching hard after a storm — which is exactly where ITEL testing earns its keep." — link: "Upper Arlington Roofing →"
    6. **Westerville, OH** — "Uptown historic streets alongside large subdivision builds — and a corridor that catches its share of wind and hail. Free forensic storm audits and full-system architectural replacements." — link: "Westerville Roofing →"
- **Additional Communities section:**
  - Eyebrow: "Wider Coverage"
  - H2: "Additional Central Ohio Communities We Serve"
  - Sub: "Franklin, Delaware, Licking, Fairfield, Madison, and Union County neighborhoods within our service radius:"
  - 25 plain chips (each "📍 [City]"): Bexley, Blacklick, Canal Winchester, Clintonville, Delaware, Gahanna, Galena, Galloway, German Village, Grandview Heights, Grove City, Groveport, Hilliard, Johnstown, Lewis Center, Marysville, Minerva Park, Obetz, Pataskala, Pickerington, Plain City, Reynoldsburg, Sunbury, Whitehall, Worthington
- **Closing CTA band:**
  - Eyebrow: "Not On The List?"
  - H2: "Don't See Your Area?"
  - Body: "Our service radius runs well past the communities listed above, and we routinely travel for storm work and shingle matching cases. Tell us where the home is and we'll tell you straight whether we're the right contractor for it."
  - Line: "Don't see your area? Call (614) 741-1393." (phone linked `tel:+16147411393`)
  - Buttons: "📞 Call (614) 741-1393", "Request Upfront Estimate →" (→ `/#quote`)
  - Fine print: "✉️ info@matchworkroofing.com"
- **Footer:**
  - "MATCHWORK ROOFING LLC" — "Central Ohio architectural residential roofing contractor and craftsmanship specialists."
  - "Services": Architectural Roof Replacement, Luxury Slate & Metal, Storm Damage & Insurance, ITEL Shingle Match Testing, Refer a Friend
  - "Central Ohio Hubs": Dublin OH, Upper Arlington OH, New Albany OH, Powell OH, Westerville OH, All Service Areas →
  - "Contact": "📞 (614) 741-1393", "✉️ info@matchworkroofing.com", "📍 Columbus, Ohio 43215"
  - Copyright: "© 2026 Matchwork Roofing LLC. All Rights Reserved."
- **`<title>`:** "Roofing Service Areas | Columbus & Central Ohio | Matchwork Roofing"
- **Meta description:** "Matchwork Roofing service areas across Columbus and Central Ohio — Dublin, New Albany, Powell, Upper Arlington, Westerville, and the surrounding communities. Architectural roof replacement, storm damage, and shingle matching."
- **JSON-LD string values:** RoofingContractor name "Matchwork Roofing", telephone "+1-614-741-1393", email "info@matchworkroofing.com", 31-city `areaServed` list (see §3), plus BreadcrumbList items "Home" and "Service Areas".

## 3. Service-area city list on `service-areas.html` (page order)

**Primary (linked) — 6 cities:**
1. Columbus, OH → `/services/roof-replacement-columbus.html`
2. Dublin, OH → `/locations/dublin-oh.html`
3. New Albany, OH → `/locations/new-albany-oh.html`
4. Powell, OH → `/locations/powell-oh.html`
5. Upper Arlington, OH → `/locations/upper-arlington-oh.html`
6. Westerville, OH → `/locations/westerville-oh.html`

**Additional (plain, unlinked) — 25 cities:**
1. Bexley
2. Blacklick
3. Canal Winchester
4. Clintonville
5. Delaware
6. Gahanna
7. Galena
8. Galloway
9. German Village
10. Grandview Heights
11. Grove City
12. Groveport
13. Hilliard
14. Johnstown
15. Lewis Center
16. Marysville
17. Minerva Park
18. Obetz
19. Pataskala
20. Pickerington
21. Plain City
22. Reynoldsburg
23. Sunbury
24. Whitehall
25. Worthington

**Counts: Primary = 6, Additional = 25, total = 31** — matches the JSON-LD `areaServed` array on both `service-areas.html` and the expanded `index.html`.

---

## 4. New page: `site-src/docs/referral.html` — full copy transcript (NEW, document order)

- **Top bar:** "📍 Serving Columbus & Central Ohio's Premier Neighborhoods" | "🤝 It Pays to Have Friends" · "📞 (614) 741-1393" · "info@matchworkroofing.com"
- **Header:** logo mark "MR"; wordmark "MATCHWORK."; tagline "Architectural Roofing & Restoration"; nav — "Roof Replacement", "Designer Shingles", "Storm & Claims", "Service Areas", "Refer a Friend" (active); CTA button "Send a Referral"
- **Breadcrumb:** "Home / Refer a Friend"
- **Hero:**
  - Eyebrow pill: "It pays to have friends."
  - H1: "Refer a Friend"
  - Body 1: "Know a neighbor with curling shingles, a client closing on a house, or a friend still arguing with an adjuster? Send them our way. We'll bring the same architectural craftsmanship, white-glove property care, and straight answers we bring to every Central Ohio roof — and you get thanked for it."
  - Body 2: "Anyone can refer. You don't have to be a past customer — homeowners, real estate agents, property managers, and neighbors are all welcome to send someone over."
  - Buttons: "Send My Referral" (→ `#referral-form`), "Call It In: (614) 741-1393" (→ `tel:+16147411393`)
  - **Reward callout card:** eyebrow "The Thank You"; reward sentence (see §4 exact quote below); fine print "🎁 Send us a name and a number — we take it from there."
- **How It Works section:**
  - Eyebrow: "Three Steps"
  - H2: "How It Works"
  - Sub: "No paperwork, no portal, no hoops. Pass along a name and a phone number and we do the rest."
  - Step 1: "Send Us Their Name and Number" — "Fill out the short form below, or just call us and read it off."
  - Step 2: "We Reach Out and Schedule the Appointment" — "A no-pressure conversation, a roof inspection, and a written proposal."
  - Step 3: "Your Gift Card Is Emailed to You" — "Straight to the email address you give us below."
- **Referral Form section:**
  - H2: "Send Your Referral"
  - Badge: "No Pressure"
  - Sub: "Tell us who to call and how to thank you. Takes about a minute."
  - Form fields (see §5 table)
  - Error text (hidden by default): "Please add your referral's name and phone number so we know who to call."
  - Button: "Send My Referral"
  - Fine print: "Prefer to call? (614) 741-1393" (phone linked `tel:+16147411393`)
- **Closing CTA section:**
  - Eyebrow: "Rather Just Tell Us?"
  - H2: "Call It In. One Name, One Number."
  - Body: "Give us a name and a phone number and we'll take it from there — and we'll treat your friend the way you'd want them treated."
  - Buttons: "📞 (614) 741-1393" (`tel:+16147411393`), "✉️ info@matchworkroofing.com" (`mailto:info@matchworkroofing.com`)
- **Footer:**
  - "MATCHWORK ROOFING LLC" — "Central Ohio's premier architectural residential roofing contractor and exterior craftsmanship specialists."
  - "Services": Architectural Roof Replacement, Luxury Slate & Metal, Storm Damage & Insurance, ITEL Shingle Match Testing, Refer a Friend
  - "Central Ohio Hubs": Dublin OH, Upper Arlington OH, New Albany OH, Powell OH, Westerville OH, All Service Areas →
  - "Contact": "📞 (614) 741-1393", "✉️ info@matchworkroofing.com", "📍 Columbus, Ohio 43215"
  - Copyright: "© 2026 Matchwork Roofing LLC. All Rights Reserved."
- **`<title>`:** "Refer a Friend | Matchwork Roofing | Columbus, OH"
- **Meta description:** "Know someone in Central Ohio who needs a roof? Send us their name and number. Anyone can refer a friend, neighbor, or client to Matchwork Roofing — you don't have to be a past customer."
- **JSON-LD string values:** BreadcrumbList items "Home" and "Refer a Friend" (this page carries only a BreadcrumbList, no RoofingContractor block).

---

## 4a. Exact reward sentence + owner-decision comment (verbatim)

Owner-decision HTML comment, quoted exactly as it appears in `site-src/docs/referral.html`:

```
<!-- OWNER DECISION: reward amount and trigger — placeholder default below, confirm before this goes public -->
```

The reward sentence it marks, quoted exactly, immediately below that comment:

```
$100 Visa gift card, emailed to you once your referral's appointment is scheduled.
```

This is explicitly flagged in the file as a **placeholder pending Jordan's decision** — not a
finalized, owner-approved reward term.

---

## 5. Referral form — fields and submission mechanism (`referral.html`)

### Fields (document order)

| Label | Input type | `id` / `name` | Required? |
|---|---|---|---|
| First Name | `text` | `first-name` | No (no `required` attribute; not validated by JS either) |
| Last Name | `text` | `last-name` | No |
| Your Email | `email` | `your-email` | No |
| Your Phone | `tel` | `your-phone` | No |
| Your Address | `text` | `your-address` | No |
| Business Name (Optional) | `text` | `business-name` | No |
| Referral's Name | `text` | `referral-name` | Not HTML-required, but **JS-enforced**: submit is blocked and an error shown if empty |
| Referral's Phone | `tel` | `referral-phone` | Not HTML-required, but **JS-enforced**: submit is blocked and an error shown if empty |
| Notes | `textarea` | `notes` | No |

No field has the HTML5 `required` attribute anywhere in the form. The only enforcement is
client-side JS on click of the submit button, which checks `referral-name` and `referral-phone` are
non-empty before proceeding (see script below) and otherwise reveals:
`<p id="referral-error" ... hidden>Please add your referral's name and phone number so we know who to call.</p>`

### Exact form tag and submit control (verbatim)

```html
<form class="space-y-4" id="referral-fields">
```

```html
<button type="button" id="referral-submit" class="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-3.5 rounded-lg shadow-md transition text-sm uppercase tracking-wider">
  Send My Referral
</button>
```

Note the button is `type="button"`, not `type="submit"` — the `<form>` element itself has **no
`action` and no `method` attribute**, so a native form submission is not possible even if the
button type were changed; all behavior is delegated to JS.

### Exact JS handler (verbatim)

```html
<script>
    (function () {
      var button = document.getElementById('referral-submit');
      var error = document.getElementById('referral-error');
      if (!button) { return; }

      function val(id) {
        var el = document.getElementById(id);
        return el && el.value ? el.value.trim() : '';
      }

      function line(label, value) {
        return value ? label + ': ' + value + '\n' : '';
      }

      button.addEventListener('click', function () {
        var firstName = val('first-name');
        var lastName = val('last-name');
        var yourName = (firstName + ' ' + lastName).trim();
        var referralName = val('referral-name');
        var referralPhone = val('referral-phone');

        if (!referralName || !referralPhone) {
          if (error) { error.hidden = false; }
          var focusTarget = document.getElementById(!referralName ? 'referral-name' : 'referral-phone');
          if (focusTarget) { focusTarget.focus(); }
          return;
        }
        if (error) { error.hidden = true; }

        var subject = 'Roof referral from ' + (yourName || 'a friend of Matchwork');

        var body = 'REFERRAL\n';
        body += line('Name', referralName);
        body += line('Phone', referralPhone);
        body += line('Notes', val('notes'));
        body += '\nFROM\n';
        body += line('Name', yourName);
        body += line('Email', val('your-email'));
        body += line('Phone', val('your-phone'));
        body += line('Address', val('your-address'));
        body += line('Business', val('business-name'));
        body += '\nSent from the Refer a Friend page at matchworkroofing.com\n';

        window.location.href = 'mailto:info@matchworkroofing.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
      });
    })();
  </script>
```

### Does it post anywhere? Plain statement

**No.** The form has no backend, no `action`/`method`, and does not POST/GET to any server or
third-party endpoint. On clicking "Send My Referral" (after the two required-in-practice fields
are filled), JavaScript builds a `mailto:` URL and sets `window.location.href` to it, which hands
the browser off to the visitor's own configured email client (Mail.app, Outlook, Gmail web
compose, etc.) with a pre-filled message. Nothing is transmitted unless the visitor's mail client
opens and the visitor themselves clicks Send in that external application.

**Composed mailto: address, subject, and body:**
- **To:** `info@matchworkroofing.com`
- **Subject:** `Roof referral from {First} {Last}` (falls back to `Roof referral from a friend of Matchwork` if the visitor left their own name blank)
- **Body** (each line only appears if that field was filled in):
  ```
  REFERRAL
  Name: {referral-name}
  Phone: {referral-phone}
  Notes: {notes}

  FROM
  Name: {First} {Last}
  Email: {your-email}
  Phone: {your-phone}
  Address: {your-address}
  Business: {business-name}

  Sent from the Refer a Friend page at matchworkroofing.com
  ```

This matches the commit message's own description: "the site has none [no backend]... the button
composes a mailto: to info@matchworkroofing.com and a tel: link sits under it."

---

## 6. `<title>` / meta description / canonical / JSON-LD changes on PRE-EXISTING pages

| Page | Field | BEFORE | AFTER |
|---|---|---|---|
| All 9 pages carrying RoofingContractor JSON-LD (index.html + 5 location pages + 3 service pages) | JSON-LD `telephone` | `"+1-614-555-0199"` | `"+1-614-741-1393"` |
| index.html | JSON-LD `areaServed` (City array) | 8 entries: Columbus, Dublin, Upper Arlington, New Albany, Powell, Westerville, Bexley, Grandview Heights | 31 entries (see §3 city list; adds Canal Winchester, Clintonville, Delaware, Gahanna, Galena, Galloway, German Village, Grove City, Groveport, Hilliard, Johnstown, Lewis Center, Marysville, Minerva Park, Obetz, Pataskala, Pickerington, Plain City, Reynoldsburg, Sunbury, Whitehall, Worthington, Blacklick; also reorders the original 8 alphabetically-by-hub) |

**No `<title>` tag changed on any pre-existing page.**
**No meta description changed on any pre-existing page.**
**No canonical URL changed on any pre-existing page.**
(Confirmed by grepping every `-` diff line across the full patch for `<title`, `meta name="description"`, and `rel="canonical"` — zero matches.)

---

## Files touched in this commit within `site-src/docs/` (for reference)

Modified: `blog/hail-damage-vs-blistering-ohio.html`, `blog/index.html`,
`blog/nail-pops-roof-leaks-powell-dublin.html`, `blog/shingle-granule-loss-columbus.html`,
`index.html`, `locations/dublin-oh.html`, `locations/new-albany-oh.html`,
`locations/powell-oh.html`, `locations/upper-arlington-oh.html`,
`locations/westerville-oh.html`, `portfolio-map.html`,
`services/roof-replacement-columbus.html`, `services/shingle-matching-test.html`,
`services/storm-damage-insurance-claims.html`, `sitemap.xml`.

New: `referral.html`, `service-areas.html`.
