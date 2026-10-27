# The Morrow Archive

A quiet digital cabinet devoted to things worth noticing. The first exhibit, **A Field Guide to Almost-Useful Machines**, collects fictional instruments for subtle human problems.

## Field notes

- [001 · The blank space beside the instrument](https://morrow-archive.projects.blueskye.co.uk/#field-note-001) — Morrow, 14 September 2026. On the distance between a reading and a verdict, accompanying the first exhibit.
- [002 · A place to set the lantern down](https://morrow-archive.projects.blueskye.co.uk/#field-note-002) — Morrow, 19 September 2026. On finishing an observation and leaving a reason to return.
- [003 · The bell that counts the messenger](https://morrow-archive.projects.blueskye.co.uk/#field-note-003) — Morrow, 11 October 2026. On completed journeys, missing observations, and keeping yesterday's date visible.

Field notes live in the page's HTML so they remain readable without JavaScript. Each has a stable fragment link, publication date, and author credit.

## Paper edition

Use the browser's Print / Save as PDF command for a light, compact edition with
instrument diagrams and a fresh page for each field note. Print styles stop
animations and expand operating notes using `::details-content`, without changing
which disclosures are open on screen or requiring JavaScript. In older browsers
without that pseudo-element, open the six operating notes before printing.
The layout has been checked in Chromium on A4 and US Letter with background
graphics disabled and Google Fonts blocked.

## Development

```bash
pnpm install
pnpm dev
```

Checks and an isolated production-mode build:

```bash
pnpm lint
pnpm format:check
pnpm build:test
```

### Publication on Lantern House

Caddy serves this checkout's `dist/` directory directly. **`pnpm build` writes
to the live site** on this machine; use `pnpm build:test` or `pnpm test` when
verifying changes. Both use the ignored `.playwright-dist/` output directory.

To publish intentionally, run the checks below, review and commit the changes,
and push them before running `pnpm build` from the clean, synchronized `main`
checkout. Verify the public page afterward. No service restart is needed.
The direct build into `dist/` is not an atomic deployment.

### Browser regression checks

```bash
pnpm exec playwright install chromium # Once per Playwright browser update
pnpm test
```

The tests build the site into `.playwright-dist/` and preview that same directory
through a temporary loopback-only Vite server on port 4178 (the port must be free).
They do not write to the published `dist/` directory. Chromium checks desktop and narrow layouts, each
with JavaScript enabled and disabled. Google Fonts requests are blocked so the
checks use fallback typography and do not depend on the font service.

Keyboard-only checks cover the skip link, all six native operating-note
disclosures (Enter/Space), reverse navigation between disclosures, index fragment
destinations, and visible focus inside the viewport. These are targeted regression
checks, not a full accessibility audit. Failure traces are saved under the ignored
`test-results/` directory; inspect one with `pnpm exec playwright show-trace <path>`.
The runner owns its preview server and stops it after the suite.

Archive navigation stays visible in a wrapping second header row on narrow screens.
Keyboard checks exercise all four shortcuts at 320px, 390px, 850px, 851px, and 1440px,
including both sides of the mobile breakpoint, with and without scripts.

Resilience checks also cover blocked script requests with independently loaded
styles and working native notes, reduced-motion preferences (including SVG and
pseudo-element animations), and fresh arrivals at all six instrument fragments
without entrance fades. These run in the same desktop/narrow and scripts/no-scripts
matrix. They verify rendering behavior, not a subjective assessment of motion comfort.

### Continuous integration

The **Archive checks** GitHub Actions workflow runs on pull requests and pushes to
`main`, and can be started manually. It uses Node 24 and the pnpm version declared
in `package.json`, installs the frozen lockfile and matching Chromium, then runs
lint, formatting, and the browser suites (including the production build).
Failed runs retain `test-results/` as a downloadable artifact for seven days.
Runs have a 15-minute limit; a newer run on the same ref cancels the older one.

## Design principles

- Content should reward attention rather than demand it.
- Motion should orient, not distract, and respect reduced-motion preferences.
- The archive remains readable without scripts; interaction adds atmosphere and navigation.
- Styles load independently of scripts. Instruments are visible by default; scroll observation only adds a finite entrance animation, disabled for deep links and reduced motion.
- No memory is retained about a visitor.

## License

All rights reserved.
