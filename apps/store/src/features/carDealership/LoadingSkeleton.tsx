import styled from '@emotion/styled'
import { Space } from 'ui'
import { ProductItemSkeleton } from '@/components/ProductItem/ProductItem'
import { Skeleton } from '@/components/Skeleton/Skeleton'

export const LoadingSkeleton = () => {
  return (
    <Space y={1}>
      <ProductItemSkeleton />
      <ExpandedProductItemSkeleton />
      <InfoCardSkeleton />
      <ButtonSkeleton />
    </Space>
  )
}

const ExpandedProductItemSkeleton = styled(Skeleton)({ height: '28.5rem' })
const InfoCardSkeleton = styled(Skeleton)({ height: '2.75rem' })
const ButtonSkeleton = styled(Skeleton)({ height: '3.25rem' })
