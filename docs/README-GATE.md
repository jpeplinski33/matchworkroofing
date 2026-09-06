# Private preview gate (StatiCrypt)

`matchworkroofing.com` is published by GitHub Pages from **branch `main`, folder `/docs`**.
While the new site is being built, every page in `/docs` is **encrypted at rest** and unlocked
in the browser with a shared passphrase.

- Encryption: **AES-256-CBC** via the browser's Web Crypto API.
- Key derivation: **PBKDF2-SHA256, 600,000 iterations**, with the salt in `.staticrypt.json`
  (repo root). The salt is not a secret; the passphrase is never stored in this repo.
- "Remember me" keeps the derived key in `localStorage` for **30 days**, so internal links
  between gated pages unlock without re-typing.
- Tool: [StatiCrypt](https://github.com/robinmoisson/staticrypt) v3.5.4.

## Layout

| Path | What it is |
| --- | --- |
| `site-src/docs/` | **Plaintext source.** Edit here. Not published. |
| `site-src/gate-template.html` | The navy gate page (custom StatiCrypt template, `noindex`). |
| `docs/` | **Generated, encrypted output.** This is what GitHub Pages serves. Do not hand-edit. |
| `.staticrypt.json` | The salt. Committed on purpose so re-encrypting keeps existing "remember me" sessions valid. |

Non-HTML files (`CNAME`, `robots.txt`, `sitemap.xml`, this README) are copied through unchanged.

## Re-encrypt after editing

Edit the pages under `site-src/docs/`, then run this one command from the repo root.
It prompts for the passphrase — do not put the passphrase on the command line.

```sh
npx --yes staticrypt site-src/docs -r -d . -c .staticrypt.json --remember 30 \
  -t site-src/gate-template.html \
  --template-title "Matchwork Roofing — private preview" \
  --template-instructions "This site is in private preview. Enter the passphrase to continue." \
  --template-placeholder "Passphrase" \
  --template-button "Enter" \
  --template-remember "Remember me on this device for 30 days" \
  --template-error "That passphrase is not correct." \
  --template-color-primary "#1e3a6e" \
  --template-color-secondary "#10233f"
```

Then commit both `site-src/` and the regenerated `docs/`.

## Preview locally

```sh
python3 -m http.server 8851 --directory docs
# then open http://127.0.0.1:8851/
```

## Taking the site public again

Copy `site-src/docs/` back over `docs/` (minus this file), delete `.staticrypt.json` and
`site-src/`, and commit. Nothing else in the pages was modified by the gate.

## Notes

- The passphrase is **not** in this repo, in any commit message, or in the PR. It is held
  separately by Jordan.
- The gate page itself carries `<meta name="robots" content="noindex, nofollow">`. The page
  bodies are ciphertext, so there is nothing for a crawler to index either way.
- `robots.txt` is unchanged.
