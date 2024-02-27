import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type PropsWithChildren } from 'react'
import type { ReviewsMetadata } from './memberReviews.types'

const companyReviewsMetadataAtom = atom<ReviewsMetadata | null>(null)

type Props = PropsWithChildren<{ companyReviewsMetadata: ReviewsMetadata | null }>

export const CompanyReviewsMetadataProvider = ({ children, companyReviewsMetadata }: Props) => {
  useHydrateAtoms([[companyReviewsMetadataAtom, companyReviewsMetadata]])
  return children
}

export const useCompanyReviewsMetadata = () => {
  return useAtomValue(companyReviewsMetadataAtom)
}
