/**
 * Vitest global setup.
 *
 * Extends expect with jest-dom matchers (e.g. toBeInTheDocument) and
 * registers a cleanup so each test gets a fresh DOM.
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
