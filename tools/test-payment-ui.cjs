const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../site-src/docs/assets/payment.js'), 'utf8');
function run(config, hostname) {
  const nodes = {
    'mw-stripe-pay': {hidden: true},
    'mw-pay-unavailable': {hidden: false},
    'mw-pay-test': {hidden: true}
  };
  vm.runInNewContext(code, {URL, window: {MATCHWORK_PAYMENT: config, location: {hostname}},
    document: {getElementById: id => nodes[id]}});
  return nodes;
}
const test = {url: 'https://buy.stripe.com/test_fixture', mode: 'test'};
const live = {url: 'https://buy.stripe.com/livefixture', mode: 'live'};
for (const [config, host] of [
  [{}, 'localhost'], [test, 'matchworkroofing.com'],
  [{...test, mode:'live'}, 'localhost'], [{...live, mode:'test'}, 'localhost'],
  [{...live, url:'javascript:alert(1)'}, 'localhost'],
  [{...live, url:'https://buy.stripe.com.evil.invalid/livefixture'}, 'localhost'],
  [{...live, url:'https://evil@buy.stripe.com/livefixture'}, 'localhost']
]) {
  const result = run(config, host);
  assert.equal(result['mw-stripe-pay'].hidden, true);
  assert.equal(result['mw-stripe-pay'].href, undefined);
  assert.equal(result['mw-pay-unavailable'].hidden, false);
}
for (const [config, host] of [[test,'127.0.0.1'],[live,'matchworkroofing.com']]) {
  const result = run(config, host);
  assert.equal(result['mw-stripe-pay'].hidden, false);
  assert.equal(result['mw-stripe-pay'].href, config.url);
  assert.equal(result['mw-pay-unavailable'].hidden, true);
  assert.equal(result['mw-pay-test'].hidden, config.mode !== 'test');
}
console.log('Payment UI: 9 configuration and URL safety cases passed. No Stripe requests.');
