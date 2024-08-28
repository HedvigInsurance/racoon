import { convertEnumToTitle } from '@hedvig-ui'

export const itemBrandDisplayName = (itemBrand: string): string => {
  if (itemBrand === 'APPLE_IPHONE') return 'iPhone'
  return convertEnumToTitle(itemBrand)
}
