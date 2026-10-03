"""Guard against card-enabled links, wrong amounts, and accidental test publication."""
import copy
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('config', Path(__file__).with_name('configure-payment-link.py'))
config = importlib.util.module_from_spec(spec)
spec.loader.exec_module(config)


class PaymentConfigTests(unittest.TestCase):
    def setUp(self):
        self.link = {'active': True, 'livemode': False, 'currency': 'usd',
                     'payment_method_types': ['us_bank_account'],
                     'custom_fields': [{'key': 'invoicenumber', 'type': 'text', 'optional': False}],
                     'url': 'https://buy.stripe.com/test_fixture'}
        self.items = {'data': [{'quantity': 1, 'price': {'currency': 'usd',
                      'type': 'one_time', 'custom_unit_amount': {'minimum': 100}}}]}

    def test_valid_ach(self):
        self.assertEqual(config.validate(self.link, self.items, 'test')['mode'], 'test')

    def test_reject_unsafe_links(self):
        for field, value in [('payment_method_types', ['card', 'us_bank_account']),
                             ('livemode', True), ('active', False), ('currency', 'eur'),
                             ('invoice_creation', {'enabled': True}),
                             ('automatic_tax', {'enabled': True}),
                             ('application_fee_amount', 100), ('custom_fields', []),
                             ('allow_promotion_codes', True),
                             ('url', 'https://buy.stripe.com.evil.invalid/test_fixture'),
                             ('url', 'https://buy.stripe.com/livefixture')]:
            with self.subTest(field=field, value=value):
                link = copy.deepcopy(self.link); link[field] = value
                with self.assertRaises(ValueError): config.validate(link, self.items, 'test')

    def test_reject_fixed_price_or_multiple_items(self):
        for items in [{'data': []}, {'data': self.items['data'] * 2},
                      {'data': [{'quantity': 1, 'price': {'currency': 'usd', 'type': 'one_time'}}]}]:
            with self.assertRaises(ValueError): config.validate(self.link, items, 'test')


if __name__ == '__main__': unittest.main()
