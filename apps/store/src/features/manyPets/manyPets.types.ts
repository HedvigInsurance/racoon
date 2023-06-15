import { ISbStoryData, SbBlokData } from '@storyblok/react'
import { ReusableBlockReferenceProps } from '@/blocks/ReusableBlockReference'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { ExpectedBlockType, SEOData } from '@/services/storyblok/storyblok'

export type TierLevel = 'BASIC' | 'STANDARD' | 'PREMIUM'

export type ComparisonTableTemplate = Record<
  string,
  string | boolean | ((offerData: ProductOfferFragment) => string | boolean | null)
>

export type ParsedComparisonTableTemplate = Record<string, string | boolean>

export type ComparisonTableTemplateByTierLevelMap = Record<TierLevel, ComparisonTableTemplate>

export type ComparisonTableData = Array<[attribute: string, value: string | boolean]>

export type DataGetter = (offer: ProductOfferFragment) => string | boolean | null

export type ManyPetsMigrationStory = ISbStoryData<
  {
    announcement?: ExpectedBlockType<ReusableBlockReferenceProps>
    preOfferContent?: Array<SbBlokData>
    postOfferContent: Array<SbBlokData>
  } & SEOData
>
