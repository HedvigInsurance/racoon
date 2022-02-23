import type { QuoteCartQuery } from '@/services/apollo/types'

export const getSelectedBundleVariant = (data: QuoteCartQuery, insuranceTypes: Array<string>) => {
  const bundle = data.quoteCart.bundle

  if (!bundle) throw new Error('No bundle on quote cart')

  const variant = bundle.possibleVariations.find((variant) => {
    const variantInsuranceTypes = variant.bundle.quotes.map((quote) => quote.data.type)
    return variantInsuranceTypes.sort().join() === insuranceTypes.concat().sort().join()
  })

  return variant ?? bundle.possibleVariations[0]
}

export type QuoteBundleVariant = ReturnType<typeof getSelectedBundleVariant>
