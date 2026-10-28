import test from 'node:test';
import assert from 'node:assert/strict';
import { SecurityGuardian } from './guardian.mjs';
import { guardianMiddleware } from './middleware.mjs';

function response() {
  return { statusCode: 200, end(message) { this.body = message; } };
}
test('denies unauthenticated requests', async () => {
  const g = new SecurityGuardian({ audit: () => {} });
  const mw = guardianMiddleware(g, { getIdentity: async () => null, actionForRequest: () => 'read_patient', resolveResourceOwner: () => null });
  const res = response();
  await mw({}, res, () => { throw Error('must not continue'); });
  assert.equal(res.statusCode, 401);
});
test('allows authenticated physician action', async () => {
  const g = new SecurityGuardian({ audit: () => {} });
  const mw = guardianMiddleware(g, { getIdentity: () => ({ actorId: 'doc', role: 'physician' }), actionForRequest: () => 'approve_note', resolveResourceOwner: () => null });
  let called = false;
  await mw({}, response(), () => { called = true; });
  assert.equal(called, true);
});
test('fails closed when policy integration throws', async () => {
  const g = new SecurityGuardian({ audit: () => {} });
  const mw = guardianMiddleware(g, { getIdentity: () => { throw Error('down'); }, actionForRequest: () => 'read_patient', resolveResourceOwner: () => null });
  const res = response();
  await mw({}, res, () => { throw Error('must not continue'); });
  assert.equal(res.statusCode, 503);
});
