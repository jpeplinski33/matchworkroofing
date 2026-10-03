#!/usr/bin/env python3
"""Verify a Stripe Payment Link with its owning account before wiring the site.

Reads STRIPE_SECRET_KEY from the environment; never writes the key. This tool is
read-only against Stripe. It changes only the two local public config files.
"""
import argparse
import json
import os
from pathlib import Path
import re
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen


def validate(link, line_items, mode):
    if not link.get('active') or link.get('livemode') != (mode == 'live'):
        raise ValueError('Link must be active and match the selected mode.')
    if link.get('payment_method_types') != ['us_bank_account']:
        raise ValueError('The payment link must accept only ACH (us_bank_account).')
    if link.get('currency') != 'usd':
        raise ValueError('The payment link must use USD.')
    if link.get('invoice_creation', {}).get('enabled'):
        raise ValueError('Paid post-payment invoice creation must remain off.')
    if link.get('automatic_tax', {}).get('enabled') or link.get('allow_promotion_codes'):
        raise ValueError('Do not change the entered invoice amount with tax or discounts.')
    if link.get('application_fee_amount') or link.get('application_fee_percent'):
        raise ValueError('No platform application fee is allowed.')
    fields = link.get('custom_fields', [])
    if not any(f.get('key') == 'invoicenumber' and f.get('type') == 'text'
               and f.get('optional') is False for f in fields):
        raise ValueError('A required invoice-number text field is missing.')
    items = line_items.get('data', [])
    if line_items.get('has_more') or len(items) != 1 or items[0].get('quantity') != 1:
        raise ValueError('Expected one variable-amount line item, quantity 1.')
    price = items[0].get('price', {})
    if (not price.get('custom_unit_amount') or price.get('currency') != 'usd'
            or price.get('type') != 'one_time'):
        raise ValueError('Expected a one-time customer-entered USD amount.')
    url = link.get('url', '')
    parsed = urlsplit(url)
    if (parsed.scheme != 'https' or parsed.netloc != 'buy.stripe.com'
            or parsed.query or parsed.fragment
            or not re.fullmatch(r'/[A-Za-z0-9_]+', parsed.path)):
        raise ValueError('Unexpected hosted Stripe URL.')
    if parsed.path.startswith('/test_') != (mode == 'test'):
        raise ValueError('URL mode mismatch.')
    return {'url': url, 'mode': mode}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--link', required=True, help='plink_ identifier')
    parser.add_argument('--account', required=True, help='Verified direct MATCHWORK acct_ identifier')
    parser.add_argument('--mode', choices=['test', 'live'], default='test')
    args = parser.parse_args()
    if not re.fullmatch(r'plink_[A-Za-z0-9]+', args.link):
        parser.error('Invalid payment link identifier')
    key = os.environ.get('STRIPE_SECRET_KEY', '')
    if not key.startswith(('sk_' + args.mode + '_', 'rk_' + args.mode + '_')):
        parser.error('A matching STRIPE_SECRET_KEY environment variable is required')

    def get(path):
        request = Request('https://api.stripe.com/v1/' + path,
                          headers={'Authorization': 'Bearer ' + key})
        with urlopen(request, timeout=30) as response:
            return json.load(response)

    account = get('account')
    if account.get('id') != args.account or args.account == 'acct_1UMOBmKaJHVNy25i':
        raise ValueError('Wrong account. Do not use the rejected Jobber connected account.')
    if args.mode == 'live' and not (account.get('charges_enabled') and
            account.get('payouts_enabled') and
            account.get('capabilities', {}).get('us_bank_account_ach_payments') == 'active'):
        raise ValueError('Direct account is not ready for live ACH and payouts.')
    link = get('payment_links/' + args.link)
    items = get('payment_links/' + args.link + '/line_items?' + urlencode({'limit': 2}))
    config = validate(link, items, args.mode)
    root = Path(__file__).resolve().parents[1]
    content = '// Verified hosted Stripe link. Public configuration; no secrets.\n'
    content += 'window.MATCHWORK_PAYMENT = ' + json.dumps(config) + ';\n'
    for base in ['site-src/docs', 'docs']:
        (root / base / 'assets/payment-config.js').write_text(content)
    print('Verified account and ACH-only link; local configuration updated. Not published.')


if __name__ == '__main__':
    main()
