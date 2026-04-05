import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility — WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Wait until NavBar and at least one section heading have rendered
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  test('no WCAG 2.1 AA violations on light mode page load', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('no WCAG 2.1 AA violations in dark mode', async ({ page }) => {
    const btn = page.getByRole('button', { name: /toggle dark mode/i })
    await expect(btn).toBeVisible()
    await btn.click()
    // Wait for dark class to be applied
    await expect(page.locator('div.dark')).toBeAttached()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('project selector is keyboard accessible', async ({ page }) => {
    const select = page.getByRole('combobox', { name: /select project/i })
    await expect(select).toBeVisible()
    await select.focus()
    await expect(select).toBeFocused()
  })

  test('dark mode button is keyboard accessible', async ({ page }) => {
    const btn = page.getByRole('button', { name: /toggle dark mode/i })
    await expect(btn).toBeVisible()
    await btn.focus()
    await expect(btn).toBeFocused()
  })

  test('all headings are properly nested', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .withRules(['heading-order'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
