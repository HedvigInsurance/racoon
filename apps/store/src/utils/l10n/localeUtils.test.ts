import { isIsoLocale, isRoutingLocale } from './localeUtils'

describe('isIsoLocale', () => {
  it.each([
    ['en', false],
    ['en-SE', true],
    ['sv-SE', true],
    ['SV-se', false],
    [undefined, false],
  ])('asserts %p expecting %p', (locale, expected) => {
    expect(isIsoLocale(locale)).toBe(expected)
  })
})

describe('isRoutingLocale', () => {
  it.each([
    ['se', true],
    ['se-en', true],
    ['en-SE', false],
    ['sv-dk', false],
    ['default', false],
    [undefined, false],
  ])('asserts %p expecting %p', (locale, expected) => {
    expect(isRoutingLocale(locale)).toBe(expected)
  })
})
