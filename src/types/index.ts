/**
 * Math Toolbox — shared types.
 *
 * This file defines the types that are NOT part of the sessions.json
 * manifest (journal entries, tool module interface, frozen tool IDs).
 *
 * The manifest types (Session, Phase, Problem, ToolPreset, ...) live in
 * `src/schema/sessions.schema.ts` and are derived from the Zod schema
 * via `z.infer`, so there is exactly one source of truth for each shape.
 *
 * See §7.3 and §7.4.1 of the architecture doc.
 */

/* --------------------------------------------------------------------------
 * Tool IDs — frozen public API (see §7.4.1 stability contract).
 *
 * Once a printed workbook ships with QR codes referencing these IDs,
 * they are frozen FOREVER. Renaming any of them bricks every printed
 * book that links to it. Only ADD new IDs; never rename or remove.
 *
 * The 11 tools are the post-v2 lineup (Measurement Sandbox was cut;
 * Session 3 is covered by numberline + ratioTable).
 * -------------------------------------------------------------------------- */
export const TOOL_IDS = [
  'counters', // T1 — Two-Color Counter Mat
  'numberline', // T2 — Interactive Number Line
  'fractionBars', // T3 — Fraction Bar Lab
  'snapCubes', // T4 — Snap Cube Workbench (Konva 2.5D)
  'algebraTiles', // T5 — Algebra Tile Board + Balance Scale
  'coordinatePlane', // T6 — Coordinate Plane
  'ratioTable', // T7 — Ratio Table + Tape Diagram
  'geoboard', // T8 — Geoboard
  'netFolder', // T9 — Net Folder
  'dice', // T10 — Dice & Spinner
  'ruler', // T11 — Ruler & Protractor
] as const

export type ToolId = (typeof TOOL_IDS)[number]

/* --------------------------------------------------------------------------
 * Tool module interface — §7.3 "Tool State".
 *
 * Every tool exports a single object conforming to ToolModule<S>. The
 * session runner and journal use this uniform shape to render any tool
 * without knowing its specifics. `reducer` must be pure so the store
 * and the ARIA description generator can share it (see §7.6).
 * -------------------------------------------------------------------------- */
export interface ToolAction {
  type: string
  // Tool-specific payloads; each tool narrows this in its own module.
  // Kept `unknown` here so the cross-cutting infrastructure stays
  // typecheck-clean without depending on every tool's internals.
  [key: string]: unknown
}

export interface ToolModule<S> {
  id: ToolId
  name: string
  initialState: S
  reducer: (state: S, action: ToolAction) => S
  /** Short, debounced, screen-reader-friendly summary (see §7.6). */
  describeAria: (state: S) => string
  Component: React.FC<{ state: S; dispatch: (a: ToolAction) => void }>
}

/* --------------------------------------------------------------------------
 * Journal entry — §7.3.
 *
 * Persisted in Dexie. Uses the overwrite-per-problem conflict model
 * from §6.3: a (sessionId, problemId) pair has at most one entry.
 * -------------------------------------------------------------------------- */
export interface JournalEntry {
  /** UUID; stable across overwrites of the same (sessionId, problemId). */
  id: string
  createdAt: number
  /** Session number 1-12, if this entry came from the session runner. */
  sessionId?: number
  /** Problem key from sessions.json, e.g. "s1-p4". */
  problemId?: string
  tool: ToolId
  /** Tool-specific serialized state. Opaque to the journal. */
  state: unknown
  /** PNG snapshot of the tool canvas (see §6.3). */
  screenshotBlob: Blob
  note?: string
}

/* Re-export manifest types from the schema module for convenience. */
export type {
  Session,
  SessionManifest,
  Phase,
  Problem,
  ToolPreset,
} from '../schema/sessions.schema'
