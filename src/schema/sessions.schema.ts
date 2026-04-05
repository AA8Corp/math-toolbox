/**
 * Zod schema for `sessions.json` — the single source of truth for
 * workbook content (§7.3).
 *
 * The schema is defined in Zod first; the TypeScript types are derived
 * via `z.infer`. This guarantees that runtime validation and compile-
 * time types can never drift apart.
 *
 * The schema is used in three places:
 *   1. At app load time (src/session/sessionStore.ts), to refuse to
 *      render a corrupted manifest with a friendly error screen instead
 *      of a white screen (see §7.6, §10).
 *   2. In CI, as a build-time check against a committed copy of
 *      sessions.json.
 *   3. In unit tests, as a round-trip check that the current
 *      sessions.json still parses.
 *
 * See §7.4.1 for the frozen-ID contract. The tool IDs here come from
 * TOOL_IDS in ../types/index.ts so adding a new tool is a one-line
 * change and renaming one fails CI immediately.
 */
import { z } from 'zod'
import { TOOL_IDS } from '../types'

/* --------------------------------------------------------------------------
 * Leaf schemas
 * -------------------------------------------------------------------------- */

/** Frozen tool ID enum (see §7.4.1). */
export const toolIdSchema = z.enum(TOOL_IDS)

/**
 * A single pre-loaded tool state attached to a problem. The `state`
 * field is tool-specific and opaque to the schema — individual tools
 * validate it when they mount. We only check that it is an object.
 */
export const toolPresetSchema = z.object({
  tool: toolIdSchema,
  /**
   * Tool-specific initial state. Each tool's own reducer validates the
   * shape when it loads; the manifest schema only guarantees the value
   * exists and is a plain object.
   */
  state: z.record(z.string(), z.unknown()),
  label: z.string().optional(),
})

export const problemSchema = z.object({
  /** Stable ID, e.g. "s1-p4". Becomes public API if printed in a workbook. */
  id: z
    .string()
    .regex(
      /^s\d+-p\d+[a-z]?$/,
      'Problem id must look like "s1-p4" (optional trailing letter).',
    ),
  prompt: z.string().min(1),
  tools: z.array(toolPresetSchema).optional(),
  /** Markdown; only shown in instructor mode (§6.4). */
  answerKey: z.string().optional(),
})

export const phaseKindSchema = z.enum([
  'warmup',
  'instruction',
  'exploration',
  'mathtalk',
  'exit',
])

export const phaseSchema = z.object({
  kind: phaseKindSchema,
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  problems: z.array(problemSchema),
})

export const sessionSchema = z.object({
  /** 1-12 — the 12 sessions in the printed workbook. */
  id: z.number().int().min(1).max(12),
  week: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  title: z.string().min(1),
  /** Free-form range string, e.g. "60-90" (minutes). */
  duration: z.string().min(1),
  /** NC math standards, e.g. ["NC.6.RP.1", "NC.6.RP.2"]. */
  standards: z.array(z.string()),
  materials: z.array(z.string()),
  instructorTip: z.string(),
  phases: z.array(phaseSchema),
})

/* --------------------------------------------------------------------------
 * Root manifest schema
 * -------------------------------------------------------------------------- */

export const sessionManifestSchema = z.object({
  /**
   * Content version, independent of the app version and the URL schema
   * version. Bumped whenever sessions or problems are edited.
   */
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'version must be semver-like, e.g. "0.1.0".'),
  /**
   * Which printed workbook edition this manifest corresponds to (§7.4.1
   * item 3). Used so the app can show edition-specific content when a
   * deep link arrives from an older printed book.
   */
  printedWorkbookVersion: z.string().min(1),
  sessions: z.array(sessionSchema),
})

/* --------------------------------------------------------------------------
 * Inferred TypeScript types
 * -------------------------------------------------------------------------- */

export type ToolPreset = z.infer<typeof toolPresetSchema>
export type Problem = z.infer<typeof problemSchema>
export type Phase = z.infer<typeof phaseSchema>
export type Session = z.infer<typeof sessionSchema>
export type SessionManifest = z.infer<typeof sessionManifestSchema>

/**
 * Parse-or-throw helper used by the session store at load time.
 * The caller is expected to catch the ZodError and show a friendly
 * error screen (§7.6). Do NOT swallow the error silently.
 */
export function parseSessionManifest(raw: unknown): SessionManifest {
  return sessionManifestSchema.parse(raw)
}
