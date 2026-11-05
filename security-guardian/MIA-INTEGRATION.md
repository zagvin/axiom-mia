# Local synthetic MIA integration — November 4, 2026

This patch implements the next integration step against the recovered October 22
MIA 0.2.1 backend. It is an opt-in API integration, not a physician-ready build.
The original full backend and Mac packaging remain outside this public repository.
The patch contains all changed/new source and tests, including pinned copies of
Guardian and guardRoute from PR head 26f7b29.

## Reproduce

Use a disposable copy of MIA-pilot-updated-source.zip (SHA-256
aa47884120a5fcc364037a8e51ae90d9ca2ba08e2ef1f1b7e16233afcfd19f0d).
Extract it into a separate directory. From the extracted MIA-pilot directory:

```sh
git apply --check /absolute/path/to/security-guardian/mia-integration.patch
git apply /absolute/path/to/security-guardian/mia-integration.patch
npm ci --ignore-scripts --no-audit --no-fund
node node_modules/vitest/vitest.mjs run --cache=false
npm run build
node scripts/check-local-access.mjs
node scripts/check-speech-lifecycle.cjs
```

The full Vitest command currently exits nonzero on Linux: the Apple Silicon
speech-upgrade platform check is still a failure, never a pass or skipped success.
The targeted new suite is lib/__tests__/local-access.test.ts.
The HTTP script starts its own loopback server on port 3137 with a fresh temporary
synthetic vault, restarts it, and removes the vault afterwards. It waits for its
own child server to become ready and fails if the port is occupied. Do not point
it at an existing installation.

## Implemented contract

- MIA_GUARDIAN_ACCEPTANCE=1 opts in. Default behavior is unchanged; the new session
  endpoint returns 404 unless enabled. Never use this flag as a production mode.
- POST /api/session with action=login verifies the existing physician PIN using
  the existing persisted scrypt/lockout logic. Client actor/role claims are ignored.
- A server-generated random actor ID is retained in the encrypted vault. Login
  returns an opaque random 256-bit HttpOnly, SameSite=Strict, Path=/ cookie.
  Only token digests are stored. Sessions expire after 30 minutes; at most five
  unexpired sessions remain. Cookies are for loopback HTTP, not remote access.
- Session mutations require a loopback Host and exact matching Origin. Next's
  localhost normalization is allowed only between loopback hosts on the same port.
- Existing visits have no inferred owner. action=assign-synthetic-visits requires
  a valid session, fresh PIN verification, and an explicit visitIds list.
  Missing/non-synthetic visits and foreign-owned visits are denied. No public
  API permits claiming another actor's data or assigning arbitrary actor IDs.
- The actual visit GET route uses guardRoute in this mode. Unauthenticated
  requests return 401; absent/foreign scope and non-synthetic data return 403.
  Identity and ownership are rechecked before returning a synthetic snapshot.
- Session creation/revocation, explicit scope assignment, authorization, and
  visit-read completion are persisted inside the existing encrypted vault using
  atomic replacement, file fsync and directory fsync. Audit failures withhold the
  response. Fixed diagnostic messages avoid exposing paths, tokens or visit data.
  Completion means the server prepared the read, not that the client received it.
- Logout persists revocation; PIN recovery clears every active session.
  Sessions and scope persist across an ordinary application restart.

## Validation actually executed

- Guardian: 42/42 tests passed.
- MIA: 38 passed, 1 failed (23 baseline passes plus 15 new security tests).
- Next build, lint and TypeScript checks passed.
- Eight real HTTP checks passed: unauthenticated denial; cross-origin denial;
  valid PIN with unassigned scope denied; explicit scope and successful read;
  actual server restart; durable-audit write outage; storage recovery; logout
  remaining revoked across another server restart.
- Deterministic speech lifecycle checks passed.
- Patch application and patched-file byte comparison checked on fresh extraction.
- Desktop/mobile visual checks blocked: Chromium was unavailable and its download
  failed. No UI source was changed; visual acceptance is not claimed.

## Remaining boundaries

This protects ONLY the opted-in visit GET API. Existing list, export, write,
server-rendered pages and other endpoints have NOT been migrated and must not be
treated as protected by it. No login or scope-assignment UI was added. Broader
authorization, care-team/tenant policy, a complete Mandarin login workflow and
physician acceptance remain separate work.

The vault remains a single-process synchronous store. Synchronous filesystem
operations cannot be interrupted by the adapter's event-loop timer; there is no
hard wall-clock bound on disk stalls. Multi-process coordination, cancellable
audit storage, external failure alerting, audit rotation/retention, tamper
resistance and recovery semantics still need design and testing. The local
encrypted audit is not an external immutable audit service.

Mac installation, actual microphone/speech, the Mac-only failing test,
updates/recovery, full end-to-end UI/visual tests and physician acceptance remain
required. Keep synthetic-only, draft, unmerged and undeployed. No real-patient,
production-readiness or compliance claims.
