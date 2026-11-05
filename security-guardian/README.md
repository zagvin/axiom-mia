# MIA Security Guardian — isolated foundation

This is a **non-deployed foundation**, not a complete security product and not a HIPAA compliance certification.

## Included
- Role/action authorization example (not yet integrated with a real identity provider)
- Login attempt throttling (in-memory only; production requires a shared durable store and network-edge controls)
- Basic prompt-injection signal detection (heuristic only; never rely on regex as an AI security boundary)
- Structured security events with limited metadata; caller must supply a protected audit sink
- Deterministic event hashing (not tamper-proof storage)

Run: `node --test security-guardian/guardian.test.mjs`

## Required before real-patient deployment
1. Locate and audit actual MIA backend and data flows.
2. Integrate verified identity, MFA, sessions, least-privilege policy, tenant isolation, and server-side enforcement.
3. Add encryption/key management, secret scanning, signed releases, dependency scanning, and vulnerability management.
4. Add persistent centralized rate limiting, monitored audit storage, incident response, alerting, and tested backups.
5. Threat-model every AI tool, retrieval source, and agent action; require explicit authorization for high-impact operations.
6. Run integration, adversarial, recovery, and independent penetration tests.
7. Complete HIPAA Security Rule risk analysis and applicable vendor/BAA reviews.
8. Keep real-patient mode disabled until verified.

**Do not connect this prototype directly to PHI or treat it as production protection.**
