# CLAUDE.md — AXIOM AI / MIA Doctor Website

Guidance for Claude Code when working in this folder.

## What this is

Static single-page website for **MIA**, AXIOM AI's HIPAA-compliant AI receptionist for medical practices. Live at **axiomvoice.org/mia**. Plain HTML/CSS/JS — no build step, no framework, no dependencies. Everything lives in `index.html` plus the asset files beside it.

## Deployment

Netlify, project **spectacular-sorbet**. Deploy = drag this entire folder onto the Deploys tab in the Netlify dashboard. The contact form uses **Netlify Forms** (submissions appear in the dashboard Forms tab) — do not remove the form's Netlify attributes or it stops delivering.

## Files

- `index.html` — the entire site: markup, styles, and scripts in one file. Keep it that way; do not split into separate CSS/JS files.
- `AXIOM-LP4.mp4` — intro video (splash → video → MIA reveal → site). Built from Paul's own frames; never regenerate or re-render it without explicit instruction.
- `MIA-CALL.mp3` — sample call recording, played by the "▶ Hear MIA" button (`#hearMia` / `#miaAudio`).
- `MIA-LOGO.png`, `AXIOM-LOGO.png`, `AXIOM-A.png`, `AXIOM-WORDMARK.png` — brand art. To swap an asset, replace the file using the same filename.

## Page structure (section ids, in order)

`#splash` → `#intro` (video, with `#skip`) → `#miaReveal` → `#nav` → `#hero` (MIA logo top half, capabilities list bottom half) → `#stats` (24/7 · 81% AMA · 100+ languages · $1M policy) → `#capabilities` (eight cards) → `#ops` ("MIA Runs the Office" + daily report monitor) → `#why` → `#lang` (Chinese dialect edge) → security/compliance → `#faq` → `#cta` → `#axiom-carousel` (Four Pillars carousel from the old site) → `#contact` → footer.

## Contact info (must stay correct)

- Paul Zwick, Founder — paul@axiomvoice.org — (917) 398-6697 (tap-to-call in contact card and "Call AXIOM" button)
- All Book a Demo buttons point to paul@axiomvoice.org, never a Gmail address.

## Rules

1. **Ask before redesigning.** Paul has strong, specific visual opinions. Fix exactly what he points at — nothing else.
2. Keep the existing fonts and colors unless told otherwise.
3. Brand voice: see `~/projects/AXIOM-BRAND-RULES.md` and the `axiom-brand-voice` skill. Premium, straight-talking, no hype words, no fluff. Lead with "buy back your time" (admin burden), not just missed calls.
4. Working copies and source assets live one level up in `~/projects/`. This folder is the deploy package — whatever changes here is what ships.
5. Verify changes render correctly before declaring done (open `index.html` in a browser or headless renderer).
