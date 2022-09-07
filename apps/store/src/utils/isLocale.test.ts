import { isLocale } from './isLocale'

describe('isLocale', () => {
  it.each([
    ['en', false],
    ['en-SE', true],
    ['en-DK', true],
    ['sv-SE', true],
    ['sv', false],
    ['', false],
    [undefined, false],
  ])('asserts %p expecting %p', (locale, expected) => {
    expect(isLocale(locale)).toBe(expected)
  })
})
