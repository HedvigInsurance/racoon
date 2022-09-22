export { CountryCode } from '@/services/apollo/generated'

/** An enum representing explicitly endorsed Locales supported by our system. */
export enum Locale {
  SvSe = 'sv-SE',
  EnSe = 'en-SE',
  NbNo = 'nb-NO',
  EnNo = 'en-NO',
  DaDk = 'da-DK',
  EnDk = 'en-DK',
}

export const LocaleObject = {
  SvSe: 'sv-SE',
  EnSe: 'en-SE',
  NbNo: 'nb-NO',
  EnNo: 'en-NO',
  DaDk: 'da-DK',
  EnDk: 'en-DK',
} as const

export type LocaleValue = typeof LocaleObject[keyof typeof LocaleObject]
export type RoutingLocale = Lowercase<Locale>

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
