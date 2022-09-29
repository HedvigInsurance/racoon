export { CountryCode } from '@/services/apollo/generated'

/** An enum representing explicitly endorsed Locales supported by our system. */
export const Locale = {
  SvSe: 'sv-SE',
  EnSe: 'en-SE',
  NbNo: 'nb-NO',
  EnNo: 'en-NO',
  DaDk: 'da-DK',
  EnDk: 'en-DK',
} as const

export type IsoLocale = typeof Locale[keyof typeof Locale]
// Would be different in the future - 'se' for Sweden+Swedish, for example
export type RoutingLocale = Lowercase<IsoLocale>
export type NextLocale = RoutingLocale | 'default'
// TODO: Make all locale-taking functions accept this:
export type UiLocale = IsoLocale | RoutingLocale

export enum Language {
  Sv = 'sv',
  En = 'en',
  No = 'no',
  Da = 'da',
}

export enum CountryLabel {
  SE = 'SE',
  NO = 'NO',
  DK = 'DK',
}
