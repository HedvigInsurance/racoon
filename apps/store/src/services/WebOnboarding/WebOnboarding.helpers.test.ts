import { RoutingLocale } from '@/utils/l10n/types'
import { convertRoutingLocale } from './WebOnboarding.helpers'

describe('convertRoutingLocale', () => {
  it.each<[RoutingLocale, string]>([
    ['se', 'se'],
    ['en-se', 'se-en'],
    ['dk', 'dk'],
    ['en-no', 'no-en'],
    ['da-dk', 'dk'],
  ])('asserts %p expecting %p', (locale, expected) => {
    expect(convertRoutingLocale(locale)).toBe(expected)
  })
})
