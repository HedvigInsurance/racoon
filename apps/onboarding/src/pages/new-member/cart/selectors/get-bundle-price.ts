import { getSelectedBundleVariant } from './get-selected-bundle-variant'

export const getBundlePrice = (data: ReturnType<typeof getSelectedBundleVariant>) => {
  const monthlyPrice = data.bundle.bundleCost.monthlyNet
  if (!monthlyPrice) throw new Error('No monthly price on bundle')

  return {
    ...monthlyPrice,
    amount: parseFloat(monthlyPrice.amount),
  }
}
