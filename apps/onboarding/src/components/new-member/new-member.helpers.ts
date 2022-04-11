import { LocaleLabel } from '@/lib/l10n/locales'
import { Market } from '@/lib/types'
import { Insurances } from './types'

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

export const getEmbarkInitialStore = (insurances: Insurances) => {
  return insurances.reduce(
    (res, { embarkStoreKey, isPreselected }) => ({
      ...res,
      [embarkStoreKey]: isPreselected ?? false,
    }),
    {},
  )
}
