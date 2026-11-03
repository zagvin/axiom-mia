# MIA integration gate — November 3, 2026

## Verified source and baseline
The October 22 MIA-pilot-updated-source.zip contains MIA 0.2.1 Next.js backend routes, Mac packaging scripts, encrypted storage, PIN signing with persisted lockouts, speech/update code, and privacy-gated feedback. It was inspected outside this repository and has not been published here.
- npm ci --ignore-scripts --no-audit --no-fund: succeeded.
- Vitest baseline: 23 passed, 1 failed. The speech-upgrade test fails the explicit Apple Silicon Mac platform guard on Linux. It remains an outstanding Mac check, not a passing test.
- Next.js build, lint and type checks: passed.
- Deterministic speech lifecycle checks: passed.
These results do not establish Mac-device or physician acceptance.

## Route adapter
route-handler.mjs exports guardRoute for Node-runtime Next.js App Router Web Request/Response handlers, including promised context.params.
The host must inject verified server-side identity, real resource ownership, and a fixed action. Client claims are not authentication. Ownership matching remains a restrictive example, not a care-team or tenant policy. Never substitute the current actor as owner merely to pass authorization.
Security checks have a default two-second deadline (configurable 1–30000 ms). Missing identity returns 401; disallowed access returns 403; callback/audit errors and deadlines return 503. The business handler executes only after authorization and acknowledged access audit. Error responses are no-store and omit raw errors.
Resolvers receive an AbortSignal. Deadline expiry prevents late continuation but cannot forcibly cancel arbitrary callback side effects. Use read-only resolvers and cancellable durable audit writes. An access audit records permission, not completed business work; operation completion auditing is still required.
Business-handler exceptions propagate to the application's error handling.

## Verification of this change
- Guardian Node suite: 42 passed, 0 failed.
- Syntax checks: passed.
- Actual MIA /api/visits/[id] GET handler invoked through adapter: 3 checks passed with synthetic identity, ownership, audit collector and isolated synthetic storage (allowed, unauthenticated, foreign owner).
- This is direct handler integration testing, not HTTP end-to-end testing or real session authentication.
- No UI or application routes changed; visual regression is not applicable to this isolated adapter addition.

## Reproduce the external MIA probe
Place security-guardian beside a separate MIA-pilot source directory. Copy bridge.test.ts.example to MIA-pilot/lib/__tests__/guardian-bridge.test.ts. From MIA-pilot run:
    node node_modules/vitest/vitest.mjs run lib/__tests__/guardian-bridge.test.ts --cache=false
Use only the synthetic storage setup supplied by that project's tests. The fixture is never an application route. Remove the copied fixture after the test; do not package it.

## Remaining gate
The adapter is not enabled in MIA. First implement verified local sessions and explicit resource scope in the actual backend, retaining existing PIN signing and vault safeguards. Supply a durable audit contract and monitor failures. Then enable one route and test real login, expiry, logout, denied access, restart, and audit outage.
The legacy middleware adapter still lacks deadlines/success auditing; use the new route adapter for this planned Next.js integration.
record(), loginResult(), authorize(), inspectUntrustedText() return promises and must be awaited.
Metadata filtering is not sensitive-value scrubbing; prompt heuristics do not enforce tool permissions.
Mac install, actual speech/microphone, full Mandarin workflow, updates/recovery and physician acceptance remain required. Synthetic-only restrictions remain in place.
PR remains draft and unmerged. Branch-specific Vercel deployment suppression remains configured. Real-patient use, production readiness and compliance claims remain out of scope.
