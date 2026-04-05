/**
 * Math Toolbox — placeholder home page (Phase 0).
 *
 * This is the shippable Phase 0 exit-criterion surface: the app loads,
 * the PWA installs, and the route tree renders without errors. Real
 * tool tiles and the session runner arrive in Phase 1 and Phase 2.
 */
export function App() {
  return (
    <main className="bg-surface text-ink min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-8 px-6 py-16">
        <header className="flex flex-col gap-3">
          <span className="bg-brand-soft text-brand-ink inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Phase 0 · Scaffold
          </span>
          <h1 className="text-ink text-5xl font-semibold tracking-tight sm:text-6xl">
            Math Toolbox
          </h1>
          <p className="text-ink-muted max-w-xl text-lg">
            Offline-first interactive math manipulatives for 6th grade. A
            companion to the AA8 Critical Thinking workbook — no physical
            manipulatives required.
          </p>
        </header>

        <section
          aria-label="What's coming"
          className="bg-surface-muted w-full rounded-2xl border border-zinc-200 p-6 shadow-sm"
        >
          <h2 className="text-ink-muted text-sm font-semibold tracking-wide uppercase">
            Coming soon
          </h2>
          <ul className="text-ink mt-3 grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-brand inline-block size-2 rounded-full"
              />
              Two-Color Counter Mat
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-secondary inline-block size-2 rounded-full"
              />
              Interactive Number Line
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-accent inline-block size-2 rounded-full"
              />
              Fraction Bar Lab
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-ink-subtle inline-block size-2 rounded-full"
              />
              + 8 more tools
            </li>
          </ul>
        </section>

        <footer className="text-ink-subtle text-xs">
          Built with React, Tailwind, Konva, and Vite. © 2026 AA8 Corporation.
        </footer>
      </div>
    </main>
  )
}

export default App
