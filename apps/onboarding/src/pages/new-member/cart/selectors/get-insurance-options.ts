import { QuoteCartQuery } from '@/services/apollo/types'
import { InsuranceSelectorOption } from '../components/insurance-selector'
import { QuoteBundleVariant } from './get-selected-bundle-variant'

export const getInsuranceOptions = (
  data: QuoteCartQuery,
  selectedVariant: QuoteBundleVariant,
): Array<InsuranceSelectorOption> => {
  const bundle = data.quoteCart.bundle
  if (!bundle) throw new Error('Bundle is undefined')

  return bundle.possibleVariations.map((variation) => ({
    id: variation.id,
    displayName: variation.bundle.displayName,
    price: {
      amount: Number(variation.bundle.bundleCost.monthlyNet.amount),
      currency: variation.bundle.bundleCost.monthlyNet.currency,
    },
    selected: variation.id === selectedVariant.id,
    ...(variation.tag ? { description: variation.tag } : {}),
  }))
}
