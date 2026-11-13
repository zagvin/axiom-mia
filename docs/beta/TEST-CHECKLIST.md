# Developer test checklist

For a future designated candidate, not the current website or security module alone.
Use a disposable macOS account and fictional information. Do not connect practice systems or real patient records. Do not replace an existing MIA installation.

Record candidate identifier, chip, RAM, macOS version, available disk, language, expected result, actual result, and pass/fail/blocked.

| Check | Expected result |
|---|---|
| Clean installation | Clear install flow; no terminal required for end user |
| Unsupported device | Clear refusal before large downloads |
| First setup | Approved components provisioned; progress and errors understandable |
| Interrupt/resume download | Safe retry; corrupted completed file replaced after failed verification |
| Microphone denied, then enabled | Clear recovery without deleting data |
| English/Mandarin synthetic speech | Record recognition and playback results separately |
| Restart app | Fictional practice settings retained |
| Reboot/sign in | Intended startup behavior and retained settings |
| Offline launch/update | Clear unavailable state; saved work preserved |
| Existing installation | No silent overwrite or data reset |
| Feedback | Warning, explicit acknowledgement, manual review, no automatic sensitive upload |

Do not post raw logs, recordings, vault files, screenshots containing private information, tokens, or patient details. Report only minimal fictional reproduction steps. For suspected exposure, stop testing and notify the maintainer without publishing sensitive details; use a verified private channel if one is available.
