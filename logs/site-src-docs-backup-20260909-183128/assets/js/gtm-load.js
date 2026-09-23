/* =============================================================================
   Matchwork Roofing — GTM loader (self-hosted, mock-v2)

   Why this file exists: the deploy CSP is `script-src 'self'` with NO
   'unsafe-inline' anywhere, and the standard Google Tag Manager snippet is an
   inline <script>. Under that policy the inline snippet is silently blocked.
   This file is a same-origin script, so it is allowed, and it injects gtm.js
   from the edge instead of inlining it.

   It is only referenced by head.html while config.json GTM_ID is a real
   container ID (build.py sets GTM_LIVE). The shipped config carries the
   placeholder GTM-XXXXXXX, so nothing third-party is requested until a real
   ID is pasted in and the site is rebuilt. build.py relaxes the CSP for
   googletagmanager.com / google-analytics.com under the same gate.

   The <noscript> iframe half of the standard snippet is deliberately omitted:
   it needs frame-src, and adding it would weaken a policy that otherwise has
   no frame relaxation. Any browser without JS is not firing GA4 events anyway.
   ========================================================================== */

(function () {
  'use strict';

  var tag = document.querySelector('script[data-gtm-id]');
  if (!tag) return;

  var id = (tag.getAttribute('data-gtm-id') || '').trim();
  if (!id || id.toUpperCase().indexOf('XXXX') !== -1 || !/^GTM-[A-Z0-9]+$/.test(id.toUpperCase())) {
    return; /* placeholder or malformed — stay silent, request nothing */
  }

  var trade = tag.getAttribute('data-page-trade') || 'none';

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_context',
    trade: trade,
    path: window.location.pathname
  });
  window.dataLayer.push(['js', new Date()]);
  window.dataLayer.push(['config', id]);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
  var first = document.getElementsByTagName('script')[0];
  if (first && first.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
})();
