import { expect, test } from '@jest/globals'
import { normalizeEmail, normalizeUserValue } from './Tracking'

// See specification at https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
test('should normalize email', () => {
  const email = ' John_Smith@gmail.com'
  const expected = 'john_smith@gmail.com'
  expect(normalizeEmail(email)).toEqual(expected)
})

test('should normalize user value', () => {
  const name = 'Valéry! '
  const expected = 'valéry'
  expect(normalizeUserValue(name)).toEqual(expected)
})
