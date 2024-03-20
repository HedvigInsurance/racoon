'use client'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms, atomFamily } from 'jotai/utils'
import { type PropsWithChildren } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import type { ReviewsMetadata } from './memberReviews.types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productReviewsMetadataAtomFamily = atomFamily((productName: string) =>
  atom<ReviewsMetadata | null>(null),
)

type Props = PropsWithChildren<{ productReviewsMetadata: ReviewsMetadata | null }>

export const ProductReviewsMetadataProvider = ({ children, productReviewsMetadata }: Props) => {
  const productData = useProductData()
  useHydrateAtoms([[productReviewsMetadataAtomFamily(productData.name), productReviewsMetadata]])
  return children
}

export const useProuctReviewsMetadata = () => {
  const productData = useProductData()
  return useAtomValue(productReviewsMetadataAtomFamily(productData.name))
}
