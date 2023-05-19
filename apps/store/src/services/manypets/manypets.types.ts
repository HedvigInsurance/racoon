import { ProductOffer } from '@/services/apollo/generated'

export type TierLevel = 'BASIC' | 'STANDARD' | 'PREMIUM'

export type ComparisonTableTemplate = Record<
  string,
  string | boolean | ((offerData: ProductOffer) => string | boolean | null)
>

export type ParsedComparisonTableTemplate = Record<string, string | boolean>

export type ComparisonTableTemplateByTierLevelMap = Record<TierLevel, ComparisonTableTemplate>

export type ComparisonTableData = Array<[attribute: string, value: string | boolean]>

export type DataGetter = (offer: ProductOffer) => string | boolean | null
