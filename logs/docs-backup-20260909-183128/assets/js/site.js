/* =============================================================================
   Matchwork Roofing — site behaviour (mock-v2)
   Vanilla JS, no dependencies, no inline script. Safe under CSP script-src 'self'.
   Loaded with `defer`, so the DOM is parsed before this runs.

   Three concerns, each independently guarded so a page that lacks the markup
   (e.g. 404) throws nothing:
     1. mobile nav panel      (.mw-nav-toggle / #site-nav)
     2. sticky call bar       ([data-call-bar])
     3. lead form             (#lead-form)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ util */

  var DESKTOP_MIN = 900; /* matches the CSS breakpoint: nav collapses < 900px */

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* Show/hide that survives class rules setting `display` on the element.
     [hidden] alone loses to any `display:` declaration with a class selector,
     so the inline style carries the weight and the attribute carries the
     semantics (assistive tech, :not([hidden]) selectors). */
  function setShown(el, shown) {
    if (!el) return;
    if (shown) {
      el.hidden = false;
      el.style.removeProperty('display');
    } else {
      el.hidden = true;
      el.style.display = 'none';
    }
  }

  /* Focus without letting the browser's own scroll dump the target behind the
     sticky header or the fixed call bar — centre it instead. */
  function focusQuietly(el) {
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch (err) {
      el.focus();
    }
    if (el.scrollIntoView) {
      el.scrollIntoView({
        block: 'center',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    }
  }

  /* ============================================================== 0. tracking */

  /* build.py stamps the page's trade on the site.js script tag as
     data-page-trade, so every event carries it without the page author having
     to remember to. dataLayer is GTM's queue: if GTM never loads (the shipped
     config has a placeholder container ID) these pushes are inert. */
  function pageTrade() {
    var el = document.querySelector('script[data-page-trade]');
    return (el && el.getAttribute('data-page-trade')) || 'none';
  }

  function mwTrack(event, params) {
    window.dataLayer = window.dataLayer || [];
    var payload = {};
    for (var key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) payload[key] = params[key];
    }
    payload.event = event;
    payload.trade = pageTrade();
    window.dataLayer.push(payload);
  }

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  /* UTM params survive a hop to another page (ad -> /roofing/ -> /contact/)
     through sessionStorage, and always land in hidden form fields. */
  function initUtm() {
    var search = window.location.search || '';
    if (search) {
      UTM_KEYS.forEach(function (key) {
        var match = new RegExp('[?&]' + key + '=([^&#]*)').exec(search);
        if (!match) return;
        var value = '';
        try { value = decodeURIComponent(match[1].replace(/\+/g, ' ')); }
        catch (err) { value = match[1]; }
        try { window.sessionStorage.setItem('mw_' + key, value.slice(0, 200)); }
        catch (err2) { /* private mode: this visit only */ }
      });
    }

    var stored = {};
    UTM_KEYS.forEach(function (key) {
      var value = null;
      try { value = window.sessionStorage.getItem('mw_' + key); } catch (err) { value = null; }
      if (value) stored[key] = value;
    });
    stored.landing_page = (window.location.pathname || '').slice(0, 200);

    $$('input[data-utm]').forEach(function (input) {
      var value = stored[input.getAttribute('data-utm')];
      if (value) input.value = value;
    });
  }

  function initCallTracking() {
    $$('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        mwTrack('click_to_call', {
          link_text: (link.textContent || '').trim().slice(0, 80),
          location: link.closest ? (link.closest('[data-call-bar]') ? 'call_bar' : 'page') : 'page'
        });
      });
    });
    /* Only rendered while SHOW_FINANCING is on; no-op otherwise. */
    $$('[data-financing-cta]').forEach(function (el) {
      el.addEventListener('click', function () { mwTrack('financing_cta_click', {}); });
    });
  }

  /* =========================================================== 1. mobile nav */

  function initNav() {
    var toggle = $('.mw-nav-toggle');
    var panel = document.getElementById('site-nav');
    if (!toggle || !panel) return;

    var iconOpen = $('.mw-nav-toggle__icon--open', toggle);
    var iconClose = $('.mw-nav-toggle__icon--close', toggle);
    var links = $$('.mw-nav__link, a', panel);
    var open = false;

    function paint() {
      panel.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      /* The CSS also swaps the glyphs off [aria-expanded]; keeping [hidden] in
         sync means the swap still works with the stylesheet missing. */
      if (iconOpen) iconOpen.hidden = open;
      if (iconClose) iconClose.hidden = !open;
      syncCallBar();
    }

    function setOpen(next) {
      if (open === next) return;
      open = next;
      paint();
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!open);
    });

    /* Tapping any link inside the panel navigates — drop the overlay first. */
    links.forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    /* Escape closes and hands focus back to the control that opened it. */
    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        setOpen(false);
        toggle.focus();
      }
    });

    /* Loose focus containment: the panel plus its toggle form the loop. */
    document.addEventListener('keydown', function (e) {
      if (!open || e.key !== 'Tab') return;
      var focusable = links.filter(function (el) {
        return el.offsetParent !== null || el.getClientRects().length > 0;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var active = document.activeElement;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        toggle.focus();
      } else if (!e.shiftKey && active === toggle) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        toggle.focus();
      } else if (e.shiftKey && active === toggle) {
        e.preventDefault();
        last.focus();
      }
    });

    /* Clicking the page outside the panel closes it. */
    document.addEventListener('click', function (e) {
      if (!open) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    /* Rotating to a width where the nav is a plain bar again resets state so
       the scroll lock can never survive into the desktop layout. */
    window.addEventListener('resize', function () {
      if (open && window.innerWidth >= DESKTOP_MIN) setOpen(false);
    });

    paint();
  }

  /* ========================================================= 2. sticky bar */

  var callBar = null;
  var callBarLink = null;

  function syncCallBar() {
    if (!callBar) return;

    /* The Call button only earns its place with a real tel: destination. */
    if (callBarLink) {
      var href = callBarLink.getAttribute('href') || '';
      callBarLink.hidden = href.slice(0, 4).toLowerCase() !== 'tel:';
    }

    /* CSS hides the bar under body.nav-open; mirror that for AT and tab order
       so the overlay never has focusable furniture behind it. */
    var buried = document.body.classList.contains('nav-open');
    if (buried) {
      callBar.setAttribute('aria-hidden', 'true');
    } else {
      callBar.removeAttribute('aria-hidden');
    }
    if ('inert' in callBar) callBar.inert = buried;
  }

  function initCallBar() {
    callBar = $('[data-call-bar]');
    if (!callBar) return;
    callBarLink = $('.mw-call-bar__call', callBar);
    syncCallBar();
  }

  /* ============================================================== 3. form */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function digitsOf(value) {
    return String(value == null ? '' : value).replace(/\D/g, '');
  }

  /* North American 10-digit display grouping: area code in parentheses,
     exchange and line number split by a hyphen. */
  function groupPhone(digits) {
    var d = digits.slice(0, 10);
    if (d.length > 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
    if (d.length > 3) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return d;
  }

  function autoFormatPhone(input) {
    var raw = input.value;
    var caret = typeof input.selectionStart === 'number' ? input.selectionStart : raw.length;
    var digitsBeforeCaret = digitsOf(raw.slice(0, caret)).length;
    var out = groupPhone(digitsOf(raw));
    if (out === raw) return;

    input.value = out;

    /* Put the caret back after the same digit the visitor was standing on. */
    var seen = 0;
    var pos = out.length;
    for (var i = 0; i < out.length; i++) {
      if (seen >= digitsBeforeCaret) { pos = i; break; }
      if (/\d/.test(out.charAt(i))) seen++;
      if (seen >= digitsBeforeCaret) { pos = i + 1; break; }
    }
    try { input.setSelectionRange(pos, pos); } catch (err) { /* type=tel only */ }
  }

  var FIELDS = [
    {
      key: 'name',
      required: 'Enter your full name.',
      test: function (v) { return v.length >= 2; },
      invalid: 'Enter your full name (at least 2 characters).'
    },
    {
      key: 'email',
      required: 'Enter your email address.',
      test: function (v) { return EMAIL_RE.test(v); },
      invalid: 'Enter a valid email address.'
    },
    {
      key: 'phone',
      required: 'Enter your phone number.',
      test: function (v) { return digitsOf(v).length === 10; },
      invalid: 'Enter a 10-digit phone number.'
    },
    {
      key: 'address',
      required: 'Enter your street address.',
      test: function (v) { return v.length >= 5; },
      invalid: 'Enter the full street address.'
    },
    {
      key: 'city',
      required: 'Choose your city.',
      test: function (v) { return v.length > 0; },
      invalid: 'Choose your city.'
    }
  ];

  function initForm() {
    var form = document.getElementById('lead-form');
    if (!form) return;

    var mode = (form.getAttribute('data-mode') || 'demo').toLowerCase() === 'live' ? 'live' : 'demo';
    var action = form.getAttribute('action') || '';
    var grid = $('.mw-form__grid', form);
    var actions = $('.mw-form__actions', form);
    var button = $('button[type="submit"]', form) || $('button', form);
    var idleLabel = button ? (button.getAttribute('data-label-idle') || button.innerHTML) : '';
    var busyLabel = button ? (button.getAttribute('data-label-busy') || 'Sending') : '';
    var honeypot = $('input[name="company"]', form);
    var status = $('[data-form-status]', form);
    var successPanel = status ? $('.mw-form-status__success', status) : null;
    var errorPanel = status ? $('.mw-form-status__error', status) : null;
    var submitted = false;
    var sending = false;

    var bound = FIELDS.map(function (spec) {
      return {
        spec: spec,
        input: $('[name="' + spec.key + '"]', form),
        wrap: null,
        error: document.getElementById('lead-' + spec.key + '-error')
      };
    }).filter(function (f) { return !!f.input; });

    bound.forEach(function (f) {
      f.wrap = f.input.closest ? f.input.closest('.mw-field') : null;
    });

    function messageFor(f) {
      var v = (f.input.value || '').trim();
      if (!v) return f.spec.required;
      return f.spec.test(v) ? '' : f.spec.invalid;
    }

    function paintField(f, message) {
      if (f.wrap) f.wrap.classList.toggle('is-invalid', !!message);
      if (message) {
        f.input.setAttribute('aria-invalid', 'true');
      } else {
        f.input.removeAttribute('aria-invalid');
      }
      if (f.error) f.error.textContent = message || '';
    }

    function validateAll() {
      var firstBad = null;
      bound.forEach(function (f) {
        var message = messageFor(f);
        paintField(f, message);
        if (message && !firstBad) firstBad = f;
      });
      return firstBad;
    }

    /* Live-format the phone and let a corrected field clear its own error. */
    bound.forEach(function (f) {
      if (f.spec.key === 'phone') {
        f.input.addEventListener('input', function () { autoFormatPhone(f.input); });
      }
      f.input.addEventListener('blur', function () {
        if (!submitted) return;
        paintField(f, messageFor(f));
      });
      f.input.addEventListener('input', function () {
        if (!submitted) return;
        if (!messageFor(f)) paintField(f, '');
      });
      f.input.addEventListener('change', function () {
        if (!submitted) return;
        paintField(f, messageFor(f));
      });
    });

    function setBusy(busy) {
      if (!button) return;
      button.disabled = busy;
      button.setAttribute('aria-busy', busy ? 'true' : 'false');
      button.innerHTML = busy ? busyLabel : idleLabel;
    }

    function showStatus(state) {
      if (!status) return null;
      status.setAttribute('data-state', state);
      setShown(status, true);
      setShown(successPanel, state === 'success');
      setShown(errorPanel, state === 'error');
      var panel = state === 'success' ? successPanel : errorPanel;
      var heading = panel ? $('.mw-form-status__heading', panel) : null;
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        focusQuietly(heading);
      }
      return heading;
    }

    function onSuccess() {
      sending = false;
      setShown(grid, false);
      setShown(actions, false);
      showStatus('success');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', form: 'lead-form', mode: mode });
      mwTrack('estimate_form_submit', { form: 'lead-form', mode: mode });
    }

    function onError() {
      sending = false;
      setBusy(false);
      showStatus('error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      submitted = true;

      /* Honeypot tripped: behave exactly like a send that worked, but send
         nothing and record nothing. */
      if (honeypot && honeypot.value.trim() !== '') {
        setShown(grid, false);
        setShown(actions, false);
        showStatus('success');
        return;
      }

      var firstBad = validateAll();
      if (firstBad) {
        focusQuietly(firstBad.input);
        return;
      }

      /* A retry after a failure starts from a clean panel. */
      if (status) {
        status.removeAttribute('data-state');
        setShown(status, false);
      }

      sending = true;
      setBusy(true);

      if (mode === 'live' && action) {
        var request;
        try {
          request = fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
        } catch (err) {
          onError();
          return;
        }
        request.then(function (res) {
          if (res && res.ok) onSuccess(); else onError();
        })['catch'](function () { onError(); });
        return;
      }

      /* Demo mode: no network. ?form=fail exercises the failure branch. */
      var shouldFail = window.location.search.indexOf('form=fail') !== -1;
      window.setTimeout(function () {
        if (shouldFail) onError(); else onSuccess();
      }, 400);
    });
  }

  /* ====================================================== 4. realtor form */

  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var FILE_MAX_BYTES = 10 * 1024 * 1024;      /* per file, stated in the hint */
  var FILE_TOTAL_BYTES = 25 * 1024 * 1024;     /* per submission */
  var FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  var FILE_EXT = /\.(pdf|jpe?g|png)$/i;

  var REALTOR_FIELDS = [
    { key: 'agent_name', errorId: 'rl-agent-name-error', required: 'Enter your name.',
      test: function (v) { return v.length >= 2; }, invalid: 'Enter your full name (at least 2 characters).' },
    { key: 'brokerage', errorId: 'rl-brokerage-error', required: 'Enter your brokerage and office.',
      test: function (v) { return v.length >= 2; }, invalid: 'Enter the brokerage and office.' },
    { key: 'mobile', errorId: 'rl-mobile-error', required: 'Enter your mobile number.', phone: true,
      test: function (v) { return digitsOf(v).length === 10; }, invalid: 'Enter a 10-digit mobile number.' },
    { key: 'email', errorId: 'rl-email-error', required: 'Enter your email address.',
      test: function (v) { return EMAIL_RE.test(v); }, invalid: 'Enter a valid email address.' },
    { key: 'property_address', errorId: 'rl-property-error', required: 'Enter the property address.',
      test: function (v) { return v.length >= 5; }, invalid: 'Enter the full property address.' },
    { key: 'role', errorId: 'rl-role-error', required: 'Choose your role on this deal.',
      test: function (v) { return v.length > 0; }, invalid: 'Choose your role on this deal.' },
    { key: 'remedy_deadline', errorId: 'rl-remedy-deadline-error', required: 'Enter the contingency or remedy deadline.',
      test: function (v) { return DATE_RE.test(v); }, invalid: 'Enter the deadline as a date.' },
    { key: 'closing_date', errorId: 'rl-closing-date-error', required: 'Enter the closing or list date.',
      test: function (v) { return DATE_RE.test(v); }, invalid: 'Enter the closing or list date.' },
    { key: 'lender_type', errorId: 'rl-lender-error', required: 'Choose the lender type, or Unknown.',
      test: function (v) { return v.length > 0; }, invalid: 'Choose the lender type, or Unknown.' }
  ];

  function initRealtorForm() {
    var form = document.getElementById('realtor-form');
    if (!form) return;

    var mode = (form.getAttribute('data-mode') || 'demo').toLowerCase() === 'live' ? 'live' : 'demo';
    var action = form.getAttribute('action') || '';
    var grid = $('.mw-form__grid', form);
    var actions = $('.mw-form__actions', form);
    var button = $('button[type="submit"]', form);
    var idleLabel = button ? (button.getAttribute('data-label-idle') || button.innerHTML) : '';
    var busyLabel = button ? (button.getAttribute('data-label-busy') || 'Sending') : '';
    var honeypot = $('input[name="company"]', form);
    var status = $('[data-form-status]', form);
    var successPanel = status ? $('.mw-form-status__success', status) : null;
    var errorPanel = status ? $('.mw-form-status__error', status) : null;
    var fileInput = $('input[name="report"]', form);
    var trades = $$('input[name="trades"]', form);
    var submitted = false;
    var sending = false;

    var bound = REALTOR_FIELDS.map(function (spec) {
      var input = $('[name="' + spec.key + '"]', form);
      if (!input) return null;
      return {
        spec: spec,
        input: input,
        wrap: input.closest ? input.closest('.mw-field') : null,
        error: document.getElementById(spec.errorId)
      };
    }).filter(Boolean);

    var tradesError = document.getElementById('rl-trades-error');
    var fileError = document.getElementById('rl-report-file-error');

    function messageFor(f) {
      var v = (f.input.value || '').trim();
      if (!v) return f.spec.required;
      return f.spec.test(v) ? '' : f.spec.invalid;
    }

    function paintField(f, message) {
      if (f.wrap) f.wrap.classList.toggle('is-invalid', !!message);
      if (message) f.input.setAttribute('aria-invalid', 'true');
      else f.input.removeAttribute('aria-invalid');
      if (f.error) f.error.textContent = message || '';
    }

    function tradesMessage() {
      return trades.some(function (box) { return box.checked; })
        ? '' : 'Tick at least one — "Not sure yet" is a fine answer.';
    }

    function fileMessage() {
      if (!fileInput) return 'Attach the inspection report or photos.';
      var files = fileInput.files ? Array.prototype.slice.call(fileInput.files) : [];
      if (!files.length) return 'Attach the inspection report or photos (PDF, JPG or PNG).';
      var total = 0;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        total += file.size || 0;
        var typeOk = !file.type || FILE_TYPES.indexOf(file.type) !== -1;
        if (!typeOk && !FILE_EXT.test(file.name || '')) {
          return '"' + file.name + '" is not a PDF, JPG or PNG.';
        }
        if (file.size > FILE_MAX_BYTES) {
          return '"' + file.name + '" is over the 10 MB limit — send that one by email instead.';
        }
      }
      if (total > FILE_TOTAL_BYTES) {
        return 'That is over 25 MB in total. Attach the report pages you need and email the rest.';
      }
      return '';
    }

    function paintGroup(el, input, message) {
      if (el) el.textContent = message || '';
      if (input) {
        if (message) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
    }

    function validateAll() {
      var firstBad = null;
      bound.forEach(function (f) {
        var message = messageFor(f);
        paintField(f, message);
        if (message && !firstBad) firstBad = f;
      });
      var tMessage = tradesMessage();
      paintGroup(tradesError, trades[0], tMessage);
      var fMessage = fileMessage();
      paintGroup(fileError, fileInput, fMessage);
      if (!firstBad && tMessage) firstBad = { input: trades[0] };
      if (!firstBad && fMessage) firstBad = { input: fileInput };
      return firstBad;
    }

    bound.forEach(function (f) {
      if (f.spec.phone) {
        f.input.addEventListener('input', function () { autoFormatPhone(f.input); });
      }
      f.input.addEventListener('blur', function () {
        if (submitted) paintField(f, messageFor(f));
      });
      f.input.addEventListener('change', function () {
        if (submitted) paintField(f, messageFor(f));
      });
    });

    trades.forEach(function (box) {
      box.addEventListener('change', function () {
        /* "Not sure yet" is an answer on its own; the rest are additive. */
        if (box.value === 'not-sure' && box.checked) {
          trades.forEach(function (other) {
            if (other !== box && other.value !== 'not-sure') other.checked = false;
          });
        } else if (box.checked) {
          trades.forEach(function (other) {
            if (other.value === 'not-sure') other.checked = false;
          });
        }
        if (submitted) paintGroup(tradesError, trades[0], tradesMessage());
      });
    });

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (submitted) paintGroup(fileError, fileInput, fileMessage());
      });
    }

    function setBusy(busy) {
      if (!button) return;
      button.disabled = busy;
      button.setAttribute('aria-busy', busy ? 'true' : 'false');
      button.innerHTML = busy ? busyLabel : idleLabel;
    }

    function showStatus(state) {
      if (!status) return null;
      status.setAttribute('data-state', state);
      setShown(status, true);
      setShown(successPanel, state === 'success');
      setShown(errorPanel, state === 'error');
      var panel = state === 'success' ? successPanel : errorPanel;
      var heading = panel ? $('.mw-form-status__heading', panel) : null;
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        focusQuietly(heading);
      }
      return heading;
    }

    function onSuccess() {
      sending = false;
      setShown(grid, false);
      setShown(actions, false);
      showStatus('success');

      var files = fileInput && fileInput.files ? Array.prototype.slice.call(fileInput.files) : [];
      var chosen = trades.filter(function (b) { return b.checked; })
        .map(function (b) { return b.value; });
      /* Fires on a real success only — never on the honeypot path below. */
      mwTrack('realtor_report_upload', {
        form: 'realtor-form',
        mode: mode,
        file_count: files.length,
        file_types: files.map(function (f) { return (f.name || '').split('.').pop().toLowerCase(); }).join(','),
        trades: chosen.join(',')
      });
      window.dataLayer.push({ event: 'generate_lead', form: 'realtor-form', mode: mode });
    }

    function onError() {
      sending = false;
      setBusy(false);
      showStatus('error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      submitted = true;

      if (honeypot && honeypot.value.trim() !== '') {
        setShown(grid, false);
        setShown(actions, false);
        showStatus('success');
        return;
      }

      var firstBad = validateAll();
      if (firstBad && firstBad.input) {
        focusQuietly(firstBad.input);
        return;
      }

      if (status) {
        status.removeAttribute('data-state');
        setShown(status, false);
      }

      sending = true;
      setBusy(true);

      if (mode === 'live' && action) {
        var request;
        try {
          request = fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
        } catch (err) {
          onError();
          return;
        }
        request.then(function (res) {
          if (res && res.ok) onSuccess(); else onError();
        })['catch'](function () { onError(); });
        return;
      }

      var shouldFail = window.location.search.indexOf('form=fail') !== -1;
      window.setTimeout(function () {
        if (shouldFail) onError(); else onSuccess();
      }, 400);
    });
  }

  /* ================================================================ start */

  function start() {
    initUtm();
    initCallBar();
    initNav();
    initForm();
    initRealtorForm();
    initCallTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
