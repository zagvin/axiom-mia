import test from 'node:test';
import assert from 'node:assert/strict';
import { SecurityGuardian } from './guardian.mjs';
import { guardianMiddleware } from './middleware.mjs';

for (const role of ['physician', 'staff']) {
  for (const owner of [undefined, null, '', ' ', 'other']) {
    test(`${role} denies unresolved or different owner: ${JSON.stringify(owner)}`, async () => {
      const g = new SecurityGuardian({ audit: () => {} });
      assert.equal((await g.authorize({ actorId: 'doc', role, action: 'read_patient', resourceOwnerId: owner })).allowed, false);
    });
  }
}
for (const role of ['unknown', 'constructor', '__proto__']) {
  test(`unknown role denied: ${role}`, async () => {
    const g = new SecurityGuardian({ audit: () => {} });
    assert.equal((await g.authorize({ actorId: 'doc', role, action: 'read_patient', resourceOwnerId: 'doc' })).allowed, false);
  });
}
function run(guardian, overrides = {}) {
  const res = { statusCode: 200, end(body) { this.body = body; } };
  let continued = false;
  const mw = guardianMiddleware(guardian, {
    getIdentity: () => ({ actorId: 'doc', role: 'physician' }),
    resolveResourceOwner: () => 'doc', actionForRequest: () => 'read_patient', ...overrides
  });
  return mw({}, res, () => { continued = true; }).then(() => ({res, continued}));
}
for (const audit of [() => { throw Error('sink down'); }, async () => { throw Error('sink down'); }]) {
  for (const overrides of [{getIdentity: () => null}, {resolveResourceOwner: () => 'other'}, {getIdentity: () => { throw Error('identity down'); }}]) {
    test(`audit failure returns 503 without continuation (${audit.constructor.name}, ${Object.keys(overrides)})`, async () => {
      const {res, continued} = await run(new SecurityGuardian({audit}), overrides);
      assert.equal(res.statusCode, 503);
      assert.equal(res.body, 'Security check unavailable');
      assert.equal(continued, false);
    });
  }
}
test('asynchronous audit finishes before denial response', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let finished = false;
  const pending = run(new SecurityGuardian({audit: () => gate}), {getIdentity: () => null}).then(result => { finished = true; return result; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false);
  release();
  const {res, continued} = await pending;
  assert.equal(res.statusCode, 401);
  assert.equal(continued, false);
});
test('valid session does not authorize another owner', async () => {
  const {res, continued} = await run(new SecurityGuardian({audit: () => {}}), {resolveResourceOwner: () => 'other'});
  assert.equal(res.statusCode, 403);
  assert.equal(continued, false);
});
test('missing action denied', async () => {
  const {res, continued} = await run(new SecurityGuardian({audit: () => {}}), {actionForRequest: () => null});
  assert.equal(res.statusCode, 403);
  assert.equal(continued, false);
});
