import { LocaleData, locales } from './locales'

export const getAssociatedLocales = (locale: LocaleData): LocaleData[] => {
  const currentMarket = locale.marketLabel
  return Object.values(locales).filter(
    ({ marketLabel }) => marketLabel === currentMarket,
  )
}
