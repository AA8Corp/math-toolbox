import { expect, test } from '@playwright/test'

/**
 * Phase 0 smoke test.
 *
 * Loads the home page and asserts the app shell is visible. Later
 * phases will add per-tool smoke tests and visual-regression snapshots
 * per the §7.6 contract.
 */
test.describe('app shell', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')

    // The placeholder home page renders a single top-level heading;
    // we check both that it is present and that the document title is
    // set to something that looks like our app.
    await expect(page).toHaveTitle(/math\s*toolbox/i)
    await expect(
      page.getByRole('heading', { level: 1, name: /math toolbox/i }),
    ).toBeVisible()
  })
})
