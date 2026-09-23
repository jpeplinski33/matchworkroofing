# Private preview gate (StatiCrypt)

`matchworkroofing.com` is published by GitHub Pages from **branch `main`, folder `/docs`**.
Every HTML page in `/docs` is **encrypted at rest** (AES-256-CBC, PBKDF2-SHA256 600k iterations,
StatiCrypt v3.5.4) and unlocked in the browser with a shared passphrase. "Remember me" keeps the
derived key in `localStorage` for 30 days so internal links unlock without re-typing.
The gate page hops `http://` -> `https://` first, because Web Crypto only exists on secure origins.

## Layout

| Path | What it is |
| --- | --- |
| `~/Projects/matchwork-website-revamp-2026-09-06/mock-v2/` | **The real source.** Edit `src/`, run `python3 build.py`. Not in this repo. |
| `site-src/docs/` | Plaintext snapshot of the last built site that was encrypted. Not published. |
| `site-src/gate-template.html` | The navy gate page (custom StatiCrypt template, `noindex`, https hop). |
| `docs/` | **Generated, encrypted output.** This is what GitHub Pages serves. Do not hand-edit. |
| `.staticrypt.json` | The salt. Committed on purpose so re-encrypting keeps "remember me" sessions valid. |

Non-HTML files (`CNAME`, `robots.txt`, `sitemap.xml`, `assets/`, this README) are copied through unchanged.
`_headers` / `_redirects` are inert on GitHub Pages; they are for the later Cloudflare Pages cut-over.

## Re-encrypt after editing

1. In `mock-v2/`: `python3 build.py && python3 build.py --check && python3 tools/verify.py`
2. Copy the build output (everything except `src/ tools/ copy/ returns/ *.md build.py config.json`)
   plus `CNAME` and this README over `site-src/docs/`.
3. From the repo root, with the passphrase in the environment (never on the command line):

```sh
STATICRYPT_PASSWORD='<passphrase>' npx --yes staticrypt site-src/docs -r -d . --short \
  -c .staticrypt.json --remember 30 -t site-src/gate-template.html \
  --template-title "Matchwork Roofing — private preview" \
  --template-instructions "This site is in private preview. Enter the passphrase to continue." \
  --template-placeholder "Passphrase" --template-button "Enter" \
  --template-remember "Remember me on this device for 30 days" \
  --template-error "That passphrase is not correct." \
  --template-color-primary "#1e3a6e" --template-color-secondary "#10233f"
```

StatiCrypt writes to `<-d>/<input path>`, so run it in a scratch dir and rsync the result into `docs/`
(see the 2026-09-09 session notes). `--short` suppresses the interactive short-password prompt that
otherwise hangs a non-interactive run.

## Taking the site public again

Copy `site-src/docs/` over `docs/` (minus this file), delete `.staticrypt.json` and `site-src/`, commit.

## What this gate does and does not cover

It covers the website: every page on `matchworkroofing.com` is ciphertext plus a passphrase prompt.
It does not cover this public GitHub repository: `site-src/docs/` is plaintext on github.com, and the
original site is in commit history. Making the repo private on a free plan takes GitHub Pages offline.
