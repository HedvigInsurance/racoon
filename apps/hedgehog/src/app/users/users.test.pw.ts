import { test, expect } from '@playwright/test'

test('Renders users server side', async ({ page }) => {
  await page.goto('/users', { waitUntil: 'networkidle' })
  await expect(page.getByText('Willie')).toBeVisible()
})
