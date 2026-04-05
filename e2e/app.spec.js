import { test, expect } from '@playwright/test'

test.describe('AI-SDLC Dashboard — behavioural', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Ensure NavBar has rendered before each test
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  // ── Page load ──────────────────────────────────────────────────────────────
  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/AI.SDLC/i)
  })

  test('navbar is visible with dashboard title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI SDLC Performance Dashboard')
  })

  test('project selector shows roi-calculator', async ({ page }) => {
    const select = page.getByRole('combobox', { name: /select project/i })
    await expect(select).toBeVisible()
    await expect(select).toHaveValue('roi-calculator')
  })

  test('dark mode toggle button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /toggle dark mode/i })).toBeVisible()
  })

  // ── Metrics load ───────────────────────────────────────────────────────────
  test('dashboard loads metrics and does not show error', async ({ page }) => {
    await expect(page.getByText(/Error:/i)).not.toBeVisible()
    await expect(page.getByText(/loading metrics/i)).not.toBeVisible()
  })

  test('Tier 1 section header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 1.*AI Input/i })).toBeVisible({ timeout: 10000 })
  })

  test('Tier 2 section header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 2.*Process/i })).toBeVisible({ timeout: 10000 })
  })

  test('Tier 3 section header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 3.*Output/i })).toBeVisible({ timeout: 10000 })
  })

  test('Tier 4 section header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 4.*Business/i })).toBeVisible({ timeout: 10000 })
  })

  test('SPACE Framework section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SPACE Framework/i })).toBeVisible({ timeout: 10000 })
  })

  test('Correlation Heatmap section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Correlation Heatmap/i })).toBeVisible({ timeout: 10000 })
  })

  test('Velocity / Quality section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Velocity.*Quality/i })).toBeVisible({ timeout: 10000 })
  })

  test('ROI Tracker section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ROI Tracker/i })).toBeVisible({ timeout: 10000 })
  })

  test('Retention Risk section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Retention Risk/i })).toBeVisible({ timeout: 10000 })
  })

  test('CI Quality Gates section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CI Quality Gates/i })).toBeVisible({ timeout: 10000 })
  })

  // ── Dark mode ──────────────────────────────────────────────────────────────
  test('dark mode toggle changes button label', async ({ page }) => {
    const btn = page.getByRole('button', { name: /toggle dark mode/i })
    await expect(btn).toBeVisible()
    await expect(btn).toHaveText('Dark')
    await btn.click()
    await expect(btn).toHaveText('Light')
  })

  test('dark mode toggle adds dark class to wrapper', async ({ page }) => {
    const btn = page.getByRole('button', { name: /toggle dark mode/i })
    await expect(btn).toBeVisible()
    await btn.click()
    await expect(page.locator('div.dark')).toBeAttached()
  })

  test('dark mode can be toggled back to light', async ({ page }) => {
    const btn = page.getByRole('button', { name: /toggle dark mode/i })
    await expect(btn).toBeVisible()
    await btn.click()
    await btn.click()
    await expect(btn).toHaveText('Dark')
  })

  // ── Tier panels ────────────────────────────────────────────────────────────
  test('Tier 1 shows AI Acceptance Rate card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 1/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('AI Acceptance Rate')).toBeVisible()
  })

  test('Tier 1 shows Boilerplate Reduction card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 1/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Boilerplate Reduction')).toBeVisible()
  })

  test('Tier 2 shows PR Cycle Time card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 2/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('PR Cycle Time').first()).toBeVisible()
  })

  test('Tier 3 shows AI Change Failure Rate card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 3/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('AI Change Failure Rate')).toBeVisible()
  })

  test('Tier 4 shows Token ROI card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tier 4/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Token ROI')).toBeVisible()
  })

  // ── SPACE panel ────────────────────────────────────────────────────────────
  test('SPACE panel shows Satisfaction dimension', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SPACE/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Satisfaction')).toBeVisible()
  })

  test('SPACE panel shows Activity dimension', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SPACE/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Activity')).toBeVisible()
  })

  // ── CI gates ───────────────────────────────────────────────────────────────
  test('CI gates shows Build gate', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CI Quality Gates/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Build')).toBeVisible()
  })

  test('CI gates shows Unit Tests gate', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CI Quality Gates/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Unit Tests')).toBeVisible()
  })

  test('CI gates shows Accessibility gate', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CI Quality Gates/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Accessibility')).toBeVisible()
  })

  test('CI gates shows at least one pass icon', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CI Quality Gates/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('✅').first()).toBeVisible()
  })

  // ── Retention risk ─────────────────────────────────────────────────────────
  test('retention risk banner is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Retention Risk/i })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.risk-banner')).toBeVisible()
  })

  test('retention risk table has three criteria rows', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Retention Risk/i })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.risk-criteria-table tbody tr')).toHaveCount(3)
  })

  // ── ROI tracker ────────────────────────────────────────────────────────────
  test('ROI tracker shows three sliders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ROI Tracker/i })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="range"]')).toHaveCount(3)
  })

  test('ROI tracker manual hours slider is interactive', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ROI Tracker/i })).toBeVisible({ timeout: 10000 })
    const slider = page.getByLabel(/manual hours saved/i)
    await slider.evaluate(el => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, '200')
      el.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await expect(page.getByText('200h')).toBeVisible()
  })

  // ── Heatmap / dual axis ────────────────────────────────────────────────────
  test('heatmap shows empty state or SVG', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Correlation Heatmap/i })).toBeVisible({ timeout: 10000 })
    const hasHeatmap = await page.locator('svg[role="img"]').isVisible().catch(() => false)
    const hasEmpty   = await page.getByText(/No heatmap data yet/i).isVisible().catch(() => false)
    expect(hasHeatmap || hasEmpty).toBe(true)
  })

  test('dual axis chart shows content or empty state', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Velocity.*Quality/i })).toBeVisible({ timeout: 10000 })
    const hasChart = await page.locator('.recharts-wrapper').first().isVisible().catch(() => false)
    const hasEmpty = await page.getByText(/No dual-axis data yet/i).isVisible().catch(() => false)
    expect(hasChart || hasEmpty).toBe(true)
  })
})
