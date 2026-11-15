# Synthetic write coverage — November 15, 2026

Apply mia-integration.patch, then mia-read-coverage.patch, then this incremental mia-write-coverage.patch to the recovered 0.2.1 backend. It is not a full application or installer. It changes acceptance mode only (MIA_GUARDIAN_ACCEPTANCE=1).

Editing/speaker tags and document drafting require write_note permission; signing requires approve_note plus the existing signing PIN. All three routes require an exact local same-origin request, a valid session and explicit synthetic visit ownership. A shared wrapper checks identity/ownership before handling and again immediately before synchronous store writes. A model call may yield, but logout or ownership changes during generation prevent saving. Audit failure before commit prevents the mutation.

Audit semantics: visit_mutation_authorized records durable authorization intent BEFORE the store operation. It is not proof of successful mutation. Store writes and this intent are separate transactions. Failed/uncertain persistence can return an error after partial storage work; clients must inspect saved state before retrying. Only synchronous store functions are passed to the commit callback. Multi-process coordination and durable success auditing are not implemented.

Validation: 57 tests passed across 14 files, including six new write tests covering anonymous/unassigned/cross-origin/foreign/nonsynthetic denial, assigned drafting/edit/signing, wrong PIN and signed-edit rejection, logout/ownership changes during generation, and audit failure. Type checks passed. 16 running-server checks passed, including actual authorized draft/edit/sign and PDF/DOCX output, restart, audit outage/recovery and logout. The HTTP script seeds fictional fixtures with acceptance mode off in a disposable directory, stops the server, then enables protection before security assertions. No existing installation is used. Build validation is recorded in the PR.

Source recovery: restored the prior Library source checkpoint, applied published read patch, and restored original declaration/font assets. Native Mac behavior and audio/model binaries are not verified here. Full-suite counts include earlier local fixes not in this incremental patch.

Remaining unprotected areas include transcription, setup/practice, knowledge, speech/settings/updates and UI authentication. Complete authorization, signature-integrity review, native Mac acceptance and signed/notarized distribution remain blockers. No real patient data, remote exposure, deployment or production-readiness claim.
