# Math Toolbox

Offline-first interactive math manipulatives for 6th grade — a digital
companion to the AA8 _Critical Thinking for Upper Elementary_ workbook,
so a student can complete every session in the book without ever
buying a physical manipulative.

- **Target user:** 6th-grade student working the AA8 workbook, with an
  instructor or parent reviewing the journal.
- **Scope (v1):** 11 tools, 12 sessions, works offline, keyboard- and
  screen-reader-accessible, installs as a PWA.
- **Architecture doc:** see `Math_Toolbox_Architecture.md` in the
  parent project folder — it is the source of truth for scope,
  contracts, and phase exit criteria.

## Status

**Phase 0 — Scaffold.** The app boots, renders a placeholder home page,
installs as a PWA, and has the full tooling chain wired up (typecheck,
lint, format, unit, e2e, build). No tools are implemented yet; Phase 1a
begins with the Two-Color Counter Mat.

## Quick start

```bash
git clone https://github.com/AA8Corp/math-toolbox.git
cd math-toolbox
npm install
npx playwright install chromium   # one-time, ~290 MB
npm run dev                       # http://localhost:5173
```

## npm scripts

| Script                 | What it does                                                      |
| ---------------------- | ----------------------------------------------------------------- |
| `npm run dev`          | Vite dev server with HMR on :5173.                                |
| `npm run build`        | Typecheck + production build to `dist/`.                          |
| `npm run preview`      | Serve the production build locally.                               |
| `npm run typecheck`    | `tsc -b --noEmit` across all tsconfig projects.                   |
| `npm run lint`         | ESLint.                                                           |
| `npm run lint:fix`     | ESLint with `--fix`.                                              |
| `npm run format`       | Prettier, write mode.                                             |
| `npm run format:check` | Prettier, check mode (used in CI).                                |
| `npm run test`         | Vitest, one-shot.                                                 |
| `npm run test:watch`   | Vitest, watch mode.                                               |
| `npm run test:ui`      | Vitest UI.                                                        |
| `npm run e2e`          | Playwright, one-shot (starts dev server).                         |
| `npm run e2e:ui`       | Playwright UI.                                                    |
| `npm run verify`       | Full local smoke: typecheck + lint + format:check + unit + build. |

## Project layout

Mirrors §7.2 of the architecture doc (some directories arrive in
later phases):

```
math-toolbox/
├─ e2e/                     # Playwright specs
├─ public/                  # Static assets, PWA icons
├─ src/
│  ├─ main.tsx              # React entry
│  ├─ App.tsx               # Placeholder home page (Phase 0)
│  ├─ index.css             # Tailwind v4 + @theme tokens
│  ├─ routes/               # Phase 2+
│  ├─ tools/                # Phase 1+ (one folder per tool)
│  ├─ session/
│  │  ├─ sessions.json      # Single source of truth for workbook content
│  │  └─ printed-ids.json   # Frozen-ID lockfile (§7.4.1)
│  ├─ journal/              # Phase 2 (Dexie-backed journal)
│  ├─ common/               # Shared components, hooks, a11y helpers
│  ├─ schema/
│  │  └─ sessions.schema.ts # Zod schema, TypeScript types derived from it
│  ├─ types/
│  │  └─ index.ts           # TOOL_IDS constant, ToolModule, JournalEntry
│  └─ test/                 # Vitest setup
├─ index.html
├─ playwright.config.ts
├─ vite.config.ts
└─ tsconfig{,.app,.node,.e2e}.json
```

## Tech stack

React 19 · TypeScript 5.9 · Vite 7 · Tailwind v4 · Zustand · Dexie ·
react-konva · React Router 7 · Zod · vite-plugin-pwa · Vitest ·
Playwright · ESLint · Prettier.

Palette: _Violet Graph Paper_ — violet `#7C3AED`, cyan `#06B6D4`, lime
`#84CC16`, zinc neutrals.

## Tool ID stability contract

See architecture doc §7.4.1. Once a workbook edition ships with QR
codes referencing a tool ID or preset key, **that ID is frozen
forever**. The eleven frozen tool IDs are listed in
`src/types/index.ts` as `TOOL_IDS`; a Vitest test asserts the list and
length, and `src/session/printed-ids.json` is the lockfile CI uses to
block any rename of something already in print.

## Security / npm audit

`npm audit` currently reports **4 high severity** advisories in
`serialize-javascript`, reached transitively through
`vite-plugin-pwa → workbox-build → @rollup/plugin-terser`. These apply
to code that serializes _untrusted_ input; in our build pipeline, the
only input is our own compiled output. They are build-time-only and
have no runtime exposure. `npm audit fix --force` would downgrade
`vite-plugin-pwa` to an ancient version incompatible with Vite 7, so
the right action is to **accept and re-audit at each phase exit**. If
you see this list drop to zero without action here, open an issue —
that likely means workbox shipped the upstream fix and we can remove
this note.

## License

MIT — see [LICENSE](./LICENSE). Copyright © 2026 AA8 Corporation.
