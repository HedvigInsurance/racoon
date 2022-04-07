import { LocaleLabel, locales, LOCALE_URL_PARAMS } from './locales'

export type LocaleUrlParam = typeof LOCALE_URL_PARAMS[number]

export type MarketInsurance = {
  name: string
  description: string
  img: string
  embarkStoreKey: string
  isPreselected?: boolean
  isAdditionalCoverage?: boolean
}

export type MarketData = {
  languages: Array<{ urlParam: LocaleUrlParam; displayName: string }>
  insurances?: Array<MarketInsurance>
}

export type MarketLabel = 'SE' | 'NO' | 'DK'

const homeContentsInsurance = {
  name: 'MAIN_COVERAGE_TITLE_HOME',
  description: 'MAIN_COVERAGE_DESC_HOME',
  img: '/racoon-assets/home.jpg',
}

const accidentInsurance = {
  name: 'MAIN_COVERAGE_TITLE_ACCIDENT',
  description: 'MAIN_COVERAGE_DESC_ACCIDENT',
  img: '/racoon-assets/accident.jpg',
}

const travelInsurance = {
  name: 'ADDITIONAL_COVERAGE_TITLE_TRAVEL',
  description: 'ADDITIONAL_COVERAGE_DESC_TRAVEL',
  img: '/racoon-assets/travel.jpg',
}

export const markets: Record<MarketLabel, MarketData> = {
  SE: {
    languages: [
      { urlParam: 'se', displayName: 'Sv' },
      { urlParam: 'se-en', displayName: 'En' },
    ],
  },
  NO: {
    languages: [
      { urlParam: 'no', displayName: 'No' },
      { urlParam: 'no-en', displayName: 'En' },
    ],
    insurances: [
      {
        ...homeContentsInsurance,
        isPreselected: true,
        embarkStoreKey: 'isHomeContents',
      },
      {
        ...travelInsurance,
        isAdditionalCoverage: true,
        embarkStoreKey: 'isTravel',
      },
      ...(process.env.FEATURE_ACCIDENT_NO
        ? [
            {
              ...accidentInsurance,
              isAdditionalCoverage: true,
              embarkStoreKey: 'isAccident',
            },
          ]
        : ([] as MarketInsurance[])),
    ],
  },
  DK: {
    languages: [
      { urlParam: 'dk', displayName: 'Da' },
      { urlParam: 'dk-en', displayName: 'En' },
    ],
  },
}

export const getMarketFromLocaleLabel = (locale: LocaleLabel) => {
  const currentLocale = locales[locale]
  return markets[currentLocale.marketLabel]
}
