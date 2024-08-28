import { test, expect } from '@playwright/test'

test('Loading claims list', async ({ page }) => {
  await page.goto('/claims/list')
  await expect(
    page.getByRole('heading', { name: 'Claims', exact: true }),
  ).toBeVisible()

  await expect(page.getByText('Total Claims: 34')).toBeVisible()
})

test('Navigating claims list table', async ({ page }) => {
  await page.goto('/claims/list')

  const firstClaimRow = page.getByRole('row').nth(1)

  // Loading correct date for the first page
  await expect(firstClaimRow.getByText('Mariia Panasetskaia')).toBeVisible()

  // Navigate to 2nd page
  await page.getByTestId('table-navigation-link-2').click()
  await expect(page).toHaveURL('/claims/list/2')
  await expect(firstClaimRow.getByText('Linus Timothy Falk')).toBeVisible()

  // Go back
  await page.getByTestId('table-navigation-link-1').click()
  await expect(page).toHaveURL('/claims/list/1')
  await expect(firstClaimRow.getByText('Mariia Panasetskaia')).toBeVisible()

  // Navigate to last page
  await page.getByTestId('table-navigation-link-last').click()
  await expect(page).toHaveURL('/claims/list/2')
  await expect(firstClaimRow.getByText('Linus Timothy Falk')).toBeVisible()

  // Navigate to first page
  await page.getByTestId('table-navigation-link-first').click()
  await expect(page).toHaveURL('/claims/list/1')
  await expect(firstClaimRow.getByText('Mariia Panasetskaia')).toBeVisible()
})
