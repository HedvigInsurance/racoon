import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import { sectionSkeleton, skeletonWrapper } from './PriceCalculatorDynamic.css'

export const PriceCalculatorDynamic = dynamic(
  async () => {
    const { PriceCalculator } = await import('./PriceCalculator')
    return PriceCalculator
  },
  {
    loading: () => (
      // Element sizes hand-picked to match layout of the form
      <SpaceFlex direction="vertical" space={0.25} className={skeletonWrapper}>
        <Skeleton className={sectionSkeleton} style={{ height: '4.5rem' }} />
        <Skeleton className={sectionSkeleton} style={{ height: '3.5rem' }} />
        <Skeleton className={sectionSkeleton} />
        <Skeleton className={sectionSkeleton} />
      </SpaceFlex>
    ),
    ssr: false,
  },
)
