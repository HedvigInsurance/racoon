import { LocaleLabel } from '@/lib/l10n/locales'
import { Market } from '@/lib/types'
import { INSURANCES_BY_MARKET } from './LandingPage.constants'
import { Insurances } from './LandingPage.types'

export const getMarketFromLocaleLabel = (localeLabel: LocaleLabel) => {
  switch (localeLabel) {
    case 'se':
    case 'se-en':
      return Market.Sweden
    case 'no':
    case 'no-en':
      return Market.Norway
    case 'dk':
    case 'dk-en':
      return Market.Denmark
  }
}

export const getMainCoverageInsurances = (insurances: Insurances) => {
  return insurances.filter(({ isAdditionalCoverage }) => !isAdditionalCoverage)
}

export const getAdditionalCoverageInsurances = (insurances: Insurances) => {
  return insurances.filter(({ isAdditionalCoverage }) => isAdditionalCoverage)
}

export const getInsurancesByLocaleLabel = (localeLabel: LocaleLabel) => {
  const market = getMarketFromLocaleLabel(localeLabel)
  const insurances = INSURANCES_BY_MARKET[market]

  return insurances
}

export const getFormInitialState = (insurances: Insurances) => {
  return insurances.reduce(
    (res, { fieldName, isPreselected }) => ({
      ...res,
      [fieldName]: isPreselected ?? false,
    }),
    {},
  )
}
