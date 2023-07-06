import { ProductOfferFragment } from '@/services/apollo/generated'
import { TableDataTemplate } from './data/SE_PET_INSURANCE_COMPARISON_TABLE'
import {
  ComparisonTableTemplate,
  ParsedComparisonTableTemplate,
  ComparisonTableData,
  TierLevel,
} from './manyPets.types'

const parseComparisonTableTemplate: (
  tableTemplate: ComparisonTableTemplate,
  offer: ProductOfferFragment,
) => ParsedComparisonTableTemplate = (tableTemplate, offer) => {
  return Object.entries(tableTemplate).reduce<ParsedComparisonTableTemplate>(
    (result, [attribute, valueOrValueGetter]) => {
      const value =
        typeof valueOrValueGetter === 'function' ? valueOrValueGetter(offer) : valueOrValueGetter
      if (value === null) {
        return result
      }

      return { ...result, [attribute]: value }
    },
    {},
  )
}

export const getComparisonTableData: (offer: ProductOfferFragment) => ComparisonTableData = (
  offer,
) => {
  const tierLevel: TierLevel = offer.priceIntentData.subType
  const comparisonTableTemplate = TableDataTemplate[tierLevel]
  const parsedComparisonTableTemplate = parseComparisonTableTemplate(comparisonTableTemplate, offer)
  const comparisonTableData = Object.entries(parsedComparisonTableTemplate)

  return comparisonTableData
}
