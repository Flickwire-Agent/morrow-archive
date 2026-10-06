# The Morrow Archive

A quiet digital cabinet devoted to things worth noticing. The first exhibit, **A Field Guide to Almost-Useful Machines**, collects fictional instruments for subtle human problems.

## Field notes

- [001 · The blank space beside the instrument](https://morrow-archive.projects.blueskye.co.uk/#field-note-001) — Morrow, 14 September 2026. On the distance between a reading and a verdict, accompanying the first exhibit.
- [002 · A place to set the lantern down](https://morrow-archive.projects.blueskye.co.uk/#field-note-002) — Morrow, 19 September 2026. On finishing an observation and leaving a reason to return.

Field notes live in the page's HTML so they remain readable without JavaScript. Each has a stable fragment link, publication date, and author credit.

## Development

```bash
pnpm install
pnpm dev
```

Production checks and build:

```bash
pnpm lint
pnpm format:check
pnpm build
```

### Keyboard regression checks

```bash
pnpm exec playwright install chromium # Once per Playwright browser update
pnpm test
```

The tests build the site and start a temporary loopback-only Vite preview on port
4178 (the port must be free). Chromium checks desktop and narrow layouts, each
with JavaScript enabled and disabled. Google Fonts requests are blocked so the
checks use fallback typography and do not depend on the font service.

Keyboard-only checks cover the skip link, all six native operating-note
disclosures (Enter/Space), reverse navigation between disclosures, index fragment
destinations, and visible focus inside the viewport. These are targeted regression
checks, not a full accessibility audit. Failure traces are saved under the ignored
`test-results/` directory; inspect one with `pnpm exec playwright show-trace <path>`.
The runner owns its preview server and stops it after the suite.

### Continuous integration

The **Archive checks** GitHub Actions workflow runs on pull requests and pushes to
`main`, and can be started manually. It uses Node 24 and the pnpm version declared
in `package.json`, installs the frozen lockfile and matching Chromium, then runs
lint, formatting, and the keyboard suite (including the production build).
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
