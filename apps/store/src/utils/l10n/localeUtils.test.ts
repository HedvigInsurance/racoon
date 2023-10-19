import { describe, it, expect } from '@jest/globals'
import { getUrlLocale, isIsoLocale, isRoutingLocale } from './localeUtils'

describe('isIsoLocale', () => {
  it.each([
    ['en', false],
    ['en-SE', true],
    ['sv-SE', true],
    ['SV-se', false],
    [undefined, false],
  ])('asserts %p expecting %p', (locale: string | undefined, expected: boolean) => {
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
  ])('asserts %p expecting %p', (locale: string | undefined, expected: boolean) => {
    expect(isRoutingLocale(locale)).toBe(expected)
  })
})

describe('getUrlLocale', () => {
  it('returns routing locale from Norwegian URL', () => {
    expect(getUrlLocale('/no')).toBe('no')
    expect(getUrlLocale('/no/')).toBe('no')
    expect(getUrlLocale('/no/checkout')).toBe('no')
    expect(getUrlLocale('/no/checkout/')).toBe('no')
    expect(getUrlLocale('/no/checkout/confirm')).toBe('no')
    expect(getUrlLocale('/no/checkout/confirm/')).toBe('no')
  })

  it('returns routing locale from Swedish URL', () => {
    expect(getUrlLocale('/se')).toBe('se')
    expect(getUrlLocale('/se/')).toBe('se')
    expect(getUrlLocale('/se/checkout')).toBe('se')
  })

  it('returns Swedish routing locale by default', () => {
    expect(getUrlLocale('/')).toBe('se')
    expect(getUrlLocale('/checkout')).toBe('se')
    expect(getUrlLocale('/checkout/')).toBe('se')
    expect(getUrlLocale('')).toBe('se')
    expect(getUrlLocale('/en/cart')).toBe('se')
  })
})
