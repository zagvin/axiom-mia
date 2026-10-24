# Integration and packaging

**Not a standalone protection system.** These instructions apply only after obtaining and auditing the real MIA backend.

1. Bundle this directory inside the MIA application release, using its normal package/build tooling.
2. Instantiate SecurityGuardian with a protected, durable, centrally monitored audit sink. If the sink fails, handle failures according to a documented clinical safety policy.
3. Add guardianMiddleware to every PHI-sensitive backend route. Identity must come from verified server-side sessions, never untrusted client claims.
4. Map each route to an explicit action and each resource to its tenant/owner. The sample role policy is not sufficient for production multi-tenant medical use.
5. Add shared durable login rate limiting, MFA, encryption/key management, monitoring and alerting, signed updates, backup recovery, and incident response.
6. Run `npm test` in this directory and the complete MIA end-to-end security suite. Run independent penetration testing.
7. Package into the single MIA installer only after verification. Do not enable real patient data before regulatory/security approval.

No installer or automatic background service is provided here because the actual MIA backend, target OS deployment layout, and installer are not available in this repository.
