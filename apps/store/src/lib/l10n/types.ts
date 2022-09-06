export { CountryCode } from '@/services/apollo/generated'

/** An enum representing explicitly endorsed Locales supported by our system. */
export enum Locale {
  SvSe = 'sv-se',
  EnSe = 'en-se',
  NbNo = 'nb-no',
  EnNo = 'en-no',
  DaDk = 'da-dk',
  EnDk = 'en-dk',
}

export enum Language {
  Sv = 'sv',
  En = 'en',
  No = 'no',
  Da = 'da',
}

export enum Market {
  Sweden = 'SWEDEN',
  Norway = 'NORWAY',
  Denmark = 'DENMARK',
}

export enum MarketLabel {
  SE = 'SE',
  NO = 'NO',
  DK = 'DK',
}
