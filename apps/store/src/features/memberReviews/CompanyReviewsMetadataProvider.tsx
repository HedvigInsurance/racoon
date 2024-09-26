'use client'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type PropsWithChildren } from 'react'
import { layoutJotaiStore } from '@/app/LayoutJotaiProvider'
import type { ReviewsMetadata } from './memberReviews.types'

const companyReviewsMetadataAtom = atom<ReviewsMetadata | null>(null)

type Props = PropsWithChildren<{ companyReviewsMetadata: ReviewsMetadata | null }>

export const CompanyReviewsMetadataProvider = ({ children, companyReviewsMetadata }: Props) => {
  useHydrateAtoms([[companyReviewsMetadataAtom, companyReviewsMetadata]], {
    store: layoutJotaiStore,
  })
  return children
}

export const useCompanyReviewsMetadata = () => {
  return useAtomValue(companyReviewsMetadataAtom)
}
