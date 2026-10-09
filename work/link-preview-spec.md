# Architect article link preview — 2026-10-09

User asks for a preview when texting the listen link.
Scope: article head metadata in docs and site-src/docs, preserving article/audio/PDF.
Evidence: live page and advertised JPEG return HTTP200 to ordinary and crawler requests. Current image1376x768,800927bytes; title long; explicit image dimensions/type/alt and Twitter title/description absent.
Plan: verify Apple native fetch, complete explicit metadata and shorten social title if needed; render actual Apple card. Existing hero photo retained.
Publication: user workspace calls out live production deployment as a human gate; prepare concrete change and preview before requesting approval if publication is needed.
Alternatives: stale Messages cache or client rendering settings may explain absence even with valid metadata. Do not claim missing tags alone prove root cause.
Cost/token telemetry unavailable.
