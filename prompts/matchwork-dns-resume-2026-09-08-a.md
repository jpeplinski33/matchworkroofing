# Matchwork Roofing — DNS & HTTPS Gate Resume Prompt

## Origin & Context
- Origin Session: Antigravity `59cc9508-4c5a-4282-8f54-cf083f0a914c` (2026-09-08T22:38:00-04:00)
- Task: Fix `matchworkroofing.com` private preview password gate and Cloudflare DNS / HTTPS setup.
- Active Project: `/Users/jpmackbookpro/Projects/matchworkroofing`

## Current State & Diagnostics
1. **Password Gate:** 
   - StatiCrypt AES-256 password: `matchwork2026`
   - Gate implementation: `docs/index.html` (encrypts pages from `site-src/docs/`).
   - Root Cause of "Nothing happens when hitting Enter": Insecure plain HTTP (`http://`) disables `window.crypto.subtle` in Chrome and Safari. StatiCrypt fails silently when `crypto.subtle` is undefined.

2. **DNS & Hosting Setup:**
   - Nameservers: Cloudflare (`brian.ns.cloudflare.com` / `isabel.ns.cloudflare.com`).
   - GitHub Pages: `jpeplinski33/matchworkroofing` (publishes from `main:/docs`).
   - Cloudflare Dashboard: Open in Chrome Window 2, Tab 2 (`https://dash.cloudflare.com/61e7e1c7376e97edb509f50ac161fedd/matchworkroofing.com/dns/records`).
   - Current DNS: In Cloudflare, records need to be toggled to **Proxied (Orange Cloud)** so Cloudflare terminates SSL at the edge with its Universal SSL certificate, enabling HTTPS globally.

3. **Immediate Next Step:**
   - Ensure the `@` and `www` DNS records in Cloudflare point to GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` or CNAME `jpeplinski33.github.io`) with **Proxy status = Proxied (Orange Cloud)**.
   - Verify `SSL/TLS` mode is set to **Full** and **Always Use HTTPS** is ON.
   - Test `curl -sI https://matchworkroofing.com` to confirm 200 OK with valid HTTPS.
   - Verify `https://matchworkroofing.com` in Chrome with password `matchwork2026`.
