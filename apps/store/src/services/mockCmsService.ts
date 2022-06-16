import { MarketLabel } from '@/lib/l10n/types'

export type CmsProduct = {
  market: MarketLabel
  displayName: string
  slug: string
  pageTitle: string
  product: string
}

const CMS_PRODUCTS: CmsProduct[] = [
  {
    market: MarketLabel.SE,
    displayName: 'Home insurance villa', // TODO: should be a translation key (or translated from BE)
    slug: 'home',
    pageTitle: 'Home insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: 'SE_HOME',
  },
]

export const getProductByMarketAndSlug = (market: MarketLabel, slug: string): CmsProduct | null => {
  return CMS_PRODUCTS.find((product) => product.market === market && product.slug === slug) ?? null
}

export const getProductsByMarket = (market: MarketLabel): CmsProduct[] => {
  return CMS_PRODUCTS.filter((product) => product.market === market)
}
