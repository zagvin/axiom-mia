# Developer candidate checkpoint — November 13, 2026

Local evaluation combined the recovered MIA 0.2.1 snapshot, security integration patch from `f6c42ef12637906d90ad3beb629048c779830f2e`, and test/packaging/launcher/download-recovery fixes. The full candidate remains outside this public repository and is not an installer.

Observed locally: 44 application tests passed; production build, lint and type checks passed; eight real loopback HTTP security checks passed; speech lifecycle checks passed. Standalone Guardian suite: 42 passed. Launcher filesystem tests: 19 passed. Packaging tests: two Python methods with eight simulated cases passed. These are local results, not GitHub CI or native Mac acceptance.

The opt-in security integration covers one synthetic visit GET route only. Other routes/pages are not fully covered. No real patient data, remote server exposure, clinical use, or compliance claim is supported.

Remaining gates: full authorization review; actual Mac package, native dependencies and clean-device setup; signing/notarization; microphone/speaker; reboot/login; recovery; redistribution review; independent developer retests. No public binary or full source release accompanies this PR.
