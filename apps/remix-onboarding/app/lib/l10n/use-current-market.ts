import { markets } from './markets'
import { useCurrentLocale } from './use-current-locale'

export const useCurrentMarket = () => {
  const locale = useCurrentLocale()
  return markets[locale.marketLabel]
}
