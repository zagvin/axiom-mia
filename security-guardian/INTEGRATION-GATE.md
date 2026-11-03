# Integration gate after ownership and audit fixes

This remains an isolated, non-deployed foundation. No real-patient use, production readiness, or compliance claim is supported.

## Changed contract
- record(), loginResult(), authorize(), and inspectUntrustedText() now return promises. Every caller must await them. checkLogin() remains synchronous.
- Authorization requires a nonblank actor ID, a known role/action, and a nonblank resourceOwnerId exactly matching actorId. Physicians no longer bypass ownership.
- This deliberately restrictive example is NOT a clinical care-team or tenant policy. The real backend must supply an audited resource-access model; never supply the actor ID as the owner merely to pass the check.
- The middleware awaits audit writes. Synchronous throws and rejected promises during denial are contained and return 503 without calling next().
- Sink health monitoring, timeouts, durable storage, and successful-action auditing are still missing. A never-settling sink can stall a request; successful authorization does not currently check sink health.
- Metadata allowlisting does not scrub sensitive values. Prompt heuristics do not enforce tool permissions.

## Verification
On November 3, 2026, Node 24.22.1:
- npm test: 29 passed, 0 failed (7 existing tests adapted to the asynchronous API, 22 added regression tests).
- npm run check: passed.
- Tests use synthetic fixtures and response doubles, not a running MIA backend or Mac installer.
- No UI changed; screenshot comparison is not applicable to this isolated module change.

## Next gate
Obtain the actual MIA backend, identity/session integration, resource/tenant model, and audit-store contract. Then integrate one actual route and test authorized, unauthorized, unresolved-resource, restart, and audit-outage behavior before expanding scope. Mac installer, Mandarin application UI, speech setup, updates/System Status, report privacy consent/scrubbing, and end-to-end acceptance remain unverified.

The branch-specific vercel.json setting disables automatic Vercel deployments for feature/security-guardian. No deployment is requested by this change.
