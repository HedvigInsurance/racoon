import { useCurrentLocale } from '@/lib/l10n'
import { Features, Feature } from '@/services/features'

export { Feature } from '@/services/features'

export const useFeature = (features: Array<Feature> = []) => {
  const { marketLabel } = useCurrentLocale()
  const featureMap = Features.getMarketBasedFlags(marketLabel)

  return features.map((feature) => featureMap[feature])
}
