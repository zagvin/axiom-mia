# MIA developer beta — preparation only

**Recruitment is not open. No installable beta has been released.**

Goal: a free, limited evaluation with 3–5 Apple Silicon Mac developers, using fictional information exclusively. This is not a clinical pilot, medical device validation, production security certification, or lifetime-access offer.

## Current scope
The public repository contains an isolated security prototype and an opt-in integration patch. It does not contain the complete MIA application. Passing its tests does not mean MIA is ready to install.

The first cohort will check installation, first model download, English/Mandarin speech, restart, and recovery. Target hardware for the current full-model candidate is Apple Silicon, 64 GB RAM, macOS 14 or later. Final disk-space and device requirements must be verified on the actual release.

## Before inviting testers
- Reconcile source and record exact release hashes.
- Build on an Apple Silicon Mac; verify bundled native dependencies.
- Test a clean account/device, microphone permissions, restart/login, and interrupted download recovery.
- Resolve signing/notarization and distribution instructions.
- Supply a reproducible release manifest and known issues.
- Review all distributed files for secrets, personal data, and redistribution rights.
- Keep existing MIA installations and their data untouched.

Do not publish the recovered full source merely to recruit testers. Free evaluation and source licensing are separate decisions; preserve existing licenses and make no new licensing grant in this preparation.

## Proposed operating process
1. Open recruitment only when a specific downloadable candidate passes the gate.
2. Accept 3–5 volunteers via the tester-interest issue form. Do not request public email addresses.
3. Assign anonymous tester IDs, record device class and candidate version.
4. Track defects: new → reproduced → fixed → awaiting retest → verified/closed.
5. Prioritize P0 data exposure/loss; P1 cannot install/start/recover; P2 incorrect workflow; P3 cosmetic. Pause distribution for P0 findings or unreviewed release integrity problems.
6. Tie fixes to source revision, test evidence, and tester retest. No unsupported promises of instant response.

No automated monitoring or outreach is currently configured.
