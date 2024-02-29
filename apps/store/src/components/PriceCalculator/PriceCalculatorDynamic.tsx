import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/Skeleton'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import { sectionSkeleton } from './PriceCalculatorDynamic.css'

export const PriceCalculatorDynamic = dynamic({
  loader: async () => {
    const { PriceCalculator } = await import('./PriceCalculator')
    return PriceCalculator
  },
  loading: () => (
    <SpaceFlex direction="vertical" space={0.5}>
      <Skeleton className={sectionSkeleton} />
      <Skeleton className={sectionSkeleton} />
      <Skeleton className={sectionSkeleton} />
    </SpaceFlex>
  ),
})
