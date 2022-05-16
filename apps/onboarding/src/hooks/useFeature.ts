import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n'
import { Features, Feature } from '@/services/features'

export { Feature } from '@/services/features'

export const useFeature = (features: Array<Feature> = []) => {
  const { marketLabel } = useCurrentLocale()

  const status = useMemo(
    () => features.map((feature) => Features.getFeature(feature, marketLabel)),
    [features, marketLabel],
  )

  return status
}
