import dotenv from 'dotenv'
import { test as setup } from '@playwright/test'

dotenv.config()

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/')
  await page.getByRole('button', { name: 'Log in with Okta' }).click()

  await page.getByLabel('Username').fill(process.env.TEST_USERNAME!)
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/')

  // End of authentication steps.

  await page.context().storageState({ path: authFile })
})
