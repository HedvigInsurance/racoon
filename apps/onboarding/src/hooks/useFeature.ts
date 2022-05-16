import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n'
import { Features, Feature } from '@/services/features'

export { Feature } from '@/services/features'

export const useFeature = (features: Array<Feature> = []) => {
  const { marketLabel } = useCurrentLocale()

  const featureMap = useMemo(() => Features.getMarketBasedFlags(marketLabel), [marketLabel])
  const status = useMemo(
    () => features.map((feature) => featureMap[feature]),
    [features, featureMap],
  )

  return status
}
