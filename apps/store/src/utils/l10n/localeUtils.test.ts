import { describe, it, expect } from '@jest/globals'
import { isIsoLocale, isRoutingLocale } from './localeUtils'

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
