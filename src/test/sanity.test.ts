/**
 * Vitest sanity test — confirms the unit test harness is wired up.
 *
 * Deliberately trivial. The real tests will live alongside the code
 * they cover (e.g. `src/tools/counter-mat/counterMat.store.test.ts`).
 * This file stays in place so CI fails loudly if the harness ever
 * stops loading at all.
 */
import { describe, expect, it } from 'vitest'

describe('test harness sanity', () => {
  it('runs vitest', () => {
    expect(2 + 2).toBe(4)
  })

  it('has jsdom document', () => {
    const el = document.createElement('div')
    el.textContent = 'hello'
    expect(el.textContent).toBe('hello')
  })
})
