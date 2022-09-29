import { isSupportedLocale } from '@/utils/isSupportedLocale'

describe('isSupportedLocale', () => {
  it.each([
    ['en', false],
    ['default', false],
    ['en-SE', true],
    ['en-DK', true],
    ['sv-SE', true],
    ['SV-se', false],
    ['sv', false],
    ['', false],
    [undefined, false],
  ])('asserts %p expecting %p', (locale, expected) => {
    expect(isSupportedLocale(locale)).toBe(expected)
  })
})
