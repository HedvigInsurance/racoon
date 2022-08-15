import { isLocale } from './isLocale'

describe('isLocale', () => {
  it.each([
    ['en', false],
    ['en-se', true],
    ['en-dk', true],
    ['sv-se', true],
    ['sv', false],
    ['', false],
    [undefined, false],
  ])('asserts %p expecting %p', (locale, expected) => {
    expect(isLocale(locale)).toBe(expected)
  })
})
