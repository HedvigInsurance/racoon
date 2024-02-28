'use client'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type PropsWithChildren } from 'react'
import type { ReviewsMetadata } from './memberReviews.types'

const productReviewsMetadataAtom = atom<ReviewsMetadata | null>(null)

type Props = PropsWithChildren<{ productReviewsMetadata: ReviewsMetadata | null }>

export const ProductReviewsMetadataProvider = ({ children, productReviewsMetadata }: Props) => {
  useHydrateAtoms([[productReviewsMetadataAtom, productReviewsMetadata]])
  return children
}

export const useProuctReviewsMetadata = () => {
  return useAtomValue(productReviewsMetadataAtom)
}
