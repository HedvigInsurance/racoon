import type { QuoteBundleVariant } from './get-selected-bundle-variant'

const isMultiQuote = (variant: QuoteBundleVariant) => {
  return variant.bundle.quotes.length > 1
}

const HOME_HOUSE_INSURANCE_TYPES = [
  'DANISH_HOME_CONTENT',
  'NORWEGIAN_HOME_CONTENT',
  'SWEDISH_APARTMENT',
  'SWEDISH_HOUSE',
]

export const getMainQuote = (variant: QuoteBundleVariant) => {
  if (isMultiQuote(variant)) {
    const mainQuoteInBundle = variant.bundle.quotes.find((quote) =>
      HOME_HOUSE_INSURANCE_TYPES.includes(quote.data.type),
    )

    if (!mainQuoteInBundle) {
      throw new Error(`Bundle ${JSON.stringify(variant)} is missing home/house quote".`)
    }

    return mainQuoteInBundle
  }

  return variant.bundle.quotes[0]
}

export type BundledQuote = ReturnType<typeof getMainQuote>
