import { ClaimInsurableLimitsFragment } from 'types/generated/graphql'
import { ArrayElementType } from 'utils/types'

export type InsurableLimitsCategory = ArrayElementType<
  ClaimInsurableLimitsFragment['categories']
>

export const splitInsurableLimitsCategories = (
  insurableLimits: ClaimInsurableLimitsFragment,
): [InsurableLimitsCategory, InsurableLimitsCategory[]] => {
  const categoriesSortedByName = insurableLimits.categories.toSorted((a, b) =>
    a.displayName < b.displayName ? -1 : 1,
  )
  const fixedDeductibleIndex = categoriesSortedByName.findIndex(
    (c) => c.id == 'FIXED_DEDUCTIBLE',
  )
  const fixedDeductibleCategory = categoriesSortedByName[fixedDeductibleIndex]
  categoriesSortedByName.splice(fixedDeductibleIndex, 1)
  return [fixedDeductibleCategory, categoriesSortedByName]
}
