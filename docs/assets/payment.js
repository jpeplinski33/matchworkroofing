(function () {
  'use strict';
  var config = window.MATCHWORK_PAYMENT || {};
  var button = document.getElementById('mw-stripe-pay');
  if (!button || typeof config.url !== 'string') { return; }
  var url;
  try { url = new URL(config.url); } catch (e) { return; }
  // Only hosted Stripe links are allowed. Test links stay on local previews.
  var local = ['localhost', '127.0.0.1', '[::1]'].indexOf(window.location.hostname) !== -1;
  var test = /^\/test_[A-Za-z0-9]+$/.test(url.pathname);
  if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com' ||
      url.port || url.username || url.password || url.search || url.hash ||
      !/^\/[A-Za-z0-9_]+$/.test(url.pathname)) { return; }
  if (config.mode !== 'live' && !(config.mode === 'test' && local)) { return; }
  if (test !== (config.mode === 'test')) { return; }
  button.href = url.href;
  button.hidden = false;
  document.getElementById('mw-pay-unavailable').hidden = true;
  document.getElementById('mw-pay-test').hidden = !test;
}());
