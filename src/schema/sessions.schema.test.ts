/**
 * Schema round-trip tests.
 *
 * Guards §7.4.1 (frozen tool IDs) and the Phase 2 CI requirement that
 * `sessions.json` always parses. If a future edit corrupts the manifest
 * or renames a tool ID, this test will fail before the bad data ever
 * reaches a running app.
 */
import { describe, expect, it } from 'vitest'
import manifest from '../session/sessions.json' with { type: 'json' }
import {
  parseSessionManifest,
  sessionManifestSchema,
  toolIdSchema,
} from './sessions.schema'
import { TOOL_IDS } from '../types'

describe('sessions.schema', () => {
  it('parses the committed sessions.json', () => {
    // parseSessionManifest throws on failure; wrapping in expect so the
    // failure message includes the ZodError.
    expect(() => parseSessionManifest(manifest)).not.toThrow()
  })

  it('rejects a manifest with an unknown tool id', () => {
    const bad = {
      version: '0.0.0',
      printedWorkbookVersion: 'pre-release',
      sessions: [
        {
          id: 1,
          week: 1,
          title: 'test',
          duration: '60',
          standards: [],
          materials: [],
          instructorTip: '',
          phases: [
            {
              kind: 'warmup',
              title: 'test',
              minutes: 5,
              problems: [
                {
                  id: 's1-p1',
                  prompt: 'test',
                  tools: [{ tool: 'nonexistent', state: {} }],
                },
              ],
            },
          ],
        },
      ],
    }
    expect(() => sessionManifestSchema.parse(bad)).toThrow()
  })

  it('rejects a problem id that does not match the sN-pM pattern', () => {
    const result = toolIdSchema.safeParse('counters')
    expect(result.success).toBe(true)

    // Just make sure the regex fires on something clearly wrong.
    const ok = sessionManifestSchema.safeParse({
      version: '0.0.0',
      printedWorkbookVersion: 'pre-release',
      sessions: [
        {
          id: 1,
          week: 1,
          title: 't',
          duration: '60',
          standards: [],
          materials: [],
          instructorTip: '',
          phases: [
            {
              kind: 'warmup',
              title: 't',
              minutes: 5,
              problems: [{ id: 'totally wrong id', prompt: 'p' }],
            },
          ],
        },
      ],
    })
    expect(ok.success).toBe(false)
  })

  it('has exactly 11 frozen tool IDs', () => {
    // §7.4.1 — adding a tool bumps this. Renaming or removing one
    // should fail this test AND the printed-ids lockfile check in CI.
    expect(TOOL_IDS).toHaveLength(11)
    expect(TOOL_IDS).toEqual([
      'counters',
      'numberline',
      'fractionBars',
      'snapCubes',
      'algebraTiles',
      'coordinatePlane',
      'ratioTable',
      'geoboard',
      'netFolder',
      'dice',
      'ruler',
    ])
  })
})
