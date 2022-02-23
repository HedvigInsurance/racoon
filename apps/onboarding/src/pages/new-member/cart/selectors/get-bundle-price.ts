import type { QuoteBundleVariant } from './get-selected-bundle-variant'

export const getBundlePrice = (variant: QuoteBundleVariant) => {
  const monthlyPrice = variant.bundle.bundleCost.monthlyNet
  if (!monthlyPrice) throw new Error('No monthly price on bundle')

  return {
    ...monthlyPrice,
    amount: parseFloat(monthlyPrice.amount),
  }
}
