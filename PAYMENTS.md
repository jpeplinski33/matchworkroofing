# MATCHWORK invoice payments — 2026-10-03

## Scope and authorization
Owner requests a Pay Your Invoice button and direct Stripe ACH. No live publish,
charge, financial account activation, or legal acceptance authorized. Jobber's
1% ACH route is rejected; do not finish that onboarding.

## Implementation
Worktree codex/pay-invoice-20261003 starts at 1d6aa32, verified against origin
on 2026-10-03. Preserve all existing content and the Highgrove OG image.
Add a prominent topbar button, mobile menu link, and branded /pay/ page.
Use a hosted Stripe Payment Link with customer-entered amount, required invoice
number, email, USD and ACH only. No bank data or secret keys in the website.
Keep the payment action unavailable until a real link is configured and verified.
No claim of settlement on returning from checkout; reconcile in Stripe manually.

## Evidence and unresolved checks
- https://docs.stripe.com/payment-links/create documents variable amounts and
  explicit payment_method_types; default maximum $10,000 needs attention for roofs.
- https://support.stripe.com/questions/how-do-you-create-a-payment-link-that-doesnt-allow-card-payments?locale=en-GB documents us_bank_account-only links.
- https://docs.stripe.com/payments/checkout/pay-what-you-want?payment-ui=stripe-hosted
  lists limitations but no ACH exclusion. Still require an actual sandbox API and
  hosted checkout test before claiming the combined configuration works.
- https://docs.stripe.com/payment-links/customize documents invoice-number fields.
- Google login jpeplinski.feazel@gmail.com reached Create account, not dashboard.
  No direct Stripe account created. Existing job packs have no Stripe credential.

## Validation and release
Run website verifier, source/publish byte comparison, payment configuration tests,
desktop/mobile browser checks, and actual Stripe sandbox flow when available.
Publish only after direct account activation, approved live link, and owner approval.
Token/cost telemetry: unavailable. Rollback: revert the payment implementation commit.

## Verified implementation — 08:42 UTC
- Isolated branch has utility-bar button + mobile menu link on all 37 header-bearing
  pages, branded /pay/ page, and fail-closed Stripe configuration.
- Website verifier: 38 pages, zero errors. Source/published trees byte-identical.
- Original inspection form and Highgrove OG metadata/asset unchanged.
- Python validator: 3 test groups pass (includes 11 rejection cases).
- JavaScript: 9 allowed/blocked URL and environment cases pass. No Stripe requests.
- Chrome desktop and mobile viewport reviewed; mobile menu payment link works and
  closes the menu. No horizontal overflow at observed mobile width433. Override reset.
- Local preview http://127.0.0.1:8627/pay/ (server started by this session).
- Existing packs contain no Stripe login. Focused on-demand 1Password lookup timed
  out; no password attempted or reset. No repeat authorization request.
- Stripe tab1893958202 at /register/oauth/secondary with Google email
  jpeplinski.feazel@gmail.com; account not created. Owner requested to complete that
  financial account step or identify existing direct Stripe login. No account assumed.
- ACH+variable amount is supported by the documented building blocks, but combined
  sandbox behavior remains UNVERIFIED until direct Stripe access is available.

## Exact checkout configuration after account access
Create a test product named MATCHWORK™ Invoice Payment, one-time USD Price with
custom_unit_amount enabled (minimum 100 cents; default $10,000 cap is provisional).
Create Payment Link with one line item, quantity1, payment_method_types exclusively
us_bank_account, required custom field key=invoicenumber/type=text/label=Invoice number,
customer_creation=always, invoice_creation.enabled=false, automatic_tax.enabled=false,
allow_promotion_codes=false. Keep confirmation language pending/processing, never paid.
Use Stripe-hosted verification and consent. Do not collect banking data in custom fields.
Test invoice number/email/amount, bank success, delayed/failed ACH, and >$10,000 cap.
Then owner final activation + payout-bank authorization, live-link verification with
configure-payment-link.py, and separate publication approval. Account ownership must
be direct MATCHWORK; prohibited Jobber Connect acct_1UMOBmKaJHVNy25i is blocked in tool.
No server/webhook is needed for this standalone link; reconcile settled payments in
Stripe before marking the corresponding Jobber invoice paid. No automatic Jobber sync.

## 2026-10-03 ~11:55 EDT — LIVE link wired (Claude session 8ce837b6)
Direct account acct_1UMTYWK98YL9sAug activated (charges + payouts enabled, ACH + card capabilities active).
Live link plink_1UMVCLK98YL9sAugHoirn8d3 → https://buy.stripe.com/dRm7sM6Jk34jgrX9OhbZe00 : us_bank_account only,
customer-entered USD amount $1–$10,000 (Stripe's cap without a support request), required Invoice number +
Property address fields, hosted confirmation message. Verified by tools/configure-payment-link.py --mode live.
Branch pay-invoice-live-2026-10-03 rebuilt on main 983671e (codex/pay-invoice-20261003 superseded). Owner said
"I want to embed this on my website asap" → published. Card payments: emailed Stripe invoice with the fee line.
