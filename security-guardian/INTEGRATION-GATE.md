# MIA integration gate — November 4, 2026

## Current integration result

The next API integration step is implemented as mia-integration.patch against
the recovered October 22 MIA 0.2.1 source. See MIA-INTEGRATION.md for the exact
source hash, reproduction commands, contract and limitations.

The patched actual visit GET handler now supports opt-in, synthetic-only
integration through guardRoute with verified local PIN sessions, explicit
persisted visit ownership and encrypted durable access/completion auditing.
Logout and PIN recovery revoke sessions. No ownership is inferred from login.
The full backend and Mac packaging remain outside this repository.

## Verified locally

- Guardian Node tests: 42 passed, 0 failed.
- Patched MIA Vitest: 38 passed, 1 failed. This includes 15 new security tests.
  The speech-upgrade test still fails the explicit Apple Silicon Mac platform
  guard on Linux. It is not a pass.
- Next.js build, lint and type checks: passed.
- Eight real HTTP checks passed, including actual server restart, durable-audit
  write outage, recovery and logout revocation after restart.
- Deterministic speech lifecycle checks: passed.
- Fresh-source patch application and byte comparison: passed.
- Desktop/mobile screenshots: blocked because Chromium download failed.

These replace the earlier synthetic-identity-only three-probe milestone for the
new patch. They are local results, not GitHub CI, Mac acceptance, or UI acceptance.

## Remaining gate

- Integration is disabled by default and limited to one API GET route. The other
  API routes and server-rendered pages remain outside this authorization boundary.
- Add a complete login/scope UI and migrate all data access paths before treating
  the application as access-controlled. Verify the complete Mandarin workflow.
- Establish supported backend/packaging version control and a reproducible Mac
  build. The patch is reviewable here; the full application is not published here.
- Resolve single-process vault limitations, synchronous disk-stall behavior,
  cancellable audit I/O, failure alerting and audit retention/recovery policy.
- Run Mac installation, actual speech/microphone, updates/recovery, broader
  end-to-end and visual checks, and physician acceptance.

The new adapter awaits authorization/access auditing, denies callback/audit
failures, and has a default two-second asynchronous-check deadline. That timer
cannot interrupt synchronous filesystem work or cancel arbitrary side effects.
Use the new route adapter, not the legacy middleware which lacks deadlines and
success auditing. record(), loginResult(), authorize() and inspectUntrustedText()
return promises and must be awaited.

Metadata filtering is not sensitive-value scrubbing; prompt heuristics do not
enforce tool permissions. Preserve PIN signing, lockouts, encrypted vault and
privacy-gated feedback. Keep PR draft/unmerged, branch deployment suppressed,
synthetic-only. Real-patient use, production readiness and compliance claims
remain out of scope.
