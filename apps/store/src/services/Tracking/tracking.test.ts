import { expect, test } from '@jest/globals'
import { normalizeEmail, normalizeGmail, normalizeUserValue } from './Tracking'

// See specification at https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
test('should normalize email', () => {
  const email = ' John_Smith.Doe@hedvig.com'
  const expected = 'john_smith.doe@hedvig.com'
  expect(normalizeEmail(email)).toEqual(expected)
})

test('should normalize gmail by removing dots before domain', () => {
  const email = 'john.doe@gmail.com'
  const expected = 'johndoe@gmail.com'
  expect(normalizeGmail(email)).toEqual(expected)
})

test('should normalize user value', () => {
  const name = 'Valéry! '
  const expected = 'valéry'
  expect(normalizeUserValue(name)).toEqual(expected)
})
