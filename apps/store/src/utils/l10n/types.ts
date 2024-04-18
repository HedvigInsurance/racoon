export { CountryCode } from '@/services/graphql/generated'

/** An enum representing explicitly endorsed Locales supported by our system. */
export const Locale = {
  SvSe: 'sv-SE',
  EnSe: 'en-SE',
  NoNo: 'no-NO',
  EnNo: 'en-NO',
  DaDk: 'da-DK',
  EnDk: 'en-DK',
} as const

export type IsoLocale = (typeof Locale)[keyof typeof Locale]
export type RoutingLocale = Lowercase<CountryLabel> | 'se-en' | 'no-en' | 'dk-en'
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
