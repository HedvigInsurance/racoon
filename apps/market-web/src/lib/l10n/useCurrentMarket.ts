import { MarketData, markets } from './markets'
import { useCurrentLocale } from './useCurrentLocale'

export const useCurrentMarket = ():MarketData => {
  const locale = useCurrentLocale()
  return markets[locale.marketLabel]
}
