# Architect article publication — 2026-10-09

Owner requested publication on MATCHWORK website and a PDF play button for narration. Publication explicitly authorized in chat. Branch starts at current origin/main f5b42f3; existing working tree is untouched.

Scope: full approved article and five images, blog index card, sitemap, Matilda narration, PDF with linked Listen button. User-facing playback uses HTML audio. PDF links to ?listen=1#listen; autoplay attempted, visible controls if blocked.

Prepublication independent audit completed by article_publish_audit. Four bounded edits remove a flawless-execution guarantee, an invented inevitable-three-winter leak timetable, categorical warranty voiding, and an overstated New Albany style prohibition. Preserve other owner-approved text. Regenerate audio and PDF for content parity.

Evidence: https://newalbanyohio.org/wp-content/uploads/2016/04/07-0827-VNA-Design-Guidelines-Section-1.pdf and https://newalbanyoh.new.swagit.com/videos/393302 ; https://www.gaf.com/en-us/resources/warranties/residential

Embedded PDF multimedia lacks mobile support. Hosted audio + normal PDF URI link gives broader compatibility; browser autoplay still requires another tap on some devices.

## Verification
- Desktop 1440px and mobile 390px render checked; mobile navigation and document width passed.
- Five images loaded, every new-page local link exists, JSON-LD present; both site trees byte-identical for all changed delivery files.
- Narration plays and pauses with measured duration 650.292 seconds; ?listen=1 correctly displays tap-to-play fallback when browser blocks autoplay.
- PDF all six pages visually inspected; top URI annotation points to the hosted player.
- Existing broad verifier does not understand page-local inline CSS and reports those classes as missing. Its content regex also flags approved non-credential “Master Craftsmanship,” “financially,” CSS 100%, the sentence “100% complete,” and a decorative lightbulb. These were manually reviewed as false positives/approved presentation; not changed by disabling the verifier. A real missing Bexley footer destination was fixed to the existing service-area page. Targeted article checks pass.
