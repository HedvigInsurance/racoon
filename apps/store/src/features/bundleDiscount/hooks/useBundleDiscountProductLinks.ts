import { useTranslation } from 'next-i18next'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import type { StoryblokImageAsset } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type ProductLink = {
  url: string
  title: string
  subtitle: string
  pillowImage: StoryblokImageAsset
  priceCalculatorURL?: string | null
}

// TODO: Move to graphql API if we do non-experimental implementation
const bundleProductGroups = [
  {
    headlineProductId: 'Product:SE_APARTMENT_RENT',
    productIds: new Set([
      'Product:SE_APARTMENT_RENT',
      'Product:SE_APARTMENT_BRF',
      'Product:SE_APARTMENT_STUDENT',
      'Product:SE_HOUSE',
    ]),
    title: {
      se: 'Hemförsäkring',
      'se-en': 'Home insurance',
    },
    subtitle: {
      se: 'Drulle ingår',
      'se-en': 'With all-risk',
    },
  },
  {
    headlineProductId: 'Product:SE_CAR',
    productIds: new Set(['Product:SE_CAR']),
    title: {
      se: 'Bilförsäkring',
      'se-en': 'Car insurance',
    },
    subtitle: {
      se: 'För din bil',
      'se-en': 'Easy to use',
    },
  },
  {
    headlineProductId: 'Product:SE_PET_DOG',
    productIds: new Set(['Product:SE_PET_CAT', 'Product:SE_PET_DOG']),
    title: {
      se: 'Djurförsäkring',
      'se-en': 'Pet insurance',
    },
    subtitle: {
      se: 'Hund och katt',
      'se-en': 'Dog or cat',
    },
  },
]

export const useBundleDiscountProductLinks = (): Array<ProductLink> => {
  const {
    i18n: { language },
  } = useTranslation()
  const { shopSession } = useShopSession()
  const productMetadata = useProductMetadata()
  if (shopSession == null || productMetadata == null) return []
  if (language !== 'se' && language !== 'se-en') {
    console.warn(`Unexpected language: ${language}`)
    return []
  }
  const productMetadataById = Object.fromEntries(productMetadata.map((item) => [item.id, item]))
  const cartProductIds = shopSession.cart.entries.map((entry) => entry.product.id)
  const productLinks = bundleProductGroups
    .filter((group) => !cartProductIds.some((productId) => group.productIds.has(productId)))
    .map((group) => {
      const headlineProduct = productMetadataById[group.headlineProductId]
      return {
        priceCalculatorURL: headlineProduct.priceCalculatorPageLink,
        url: headlineProduct.categoryPageLink || headlineProduct.pageLink,
        title: group.title[language],
        subtitle: group.subtitle[language],
        pillowImage: headlineProduct.pillowImage,
      } as const
    })

  return productLinks
}
