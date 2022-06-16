import { MarketLabel } from '@/lib/l10n/types'

export type Product = {
  market: MarketLabel
  name: string
  slug: string
  pageTitle: string
}

const PRODUCTS: Product[] = [
  {
    name: 'SE_HOME',
    market: MarketLabel.SE,
    slug: 'home',
    pageTitle: 'Home insurance | Hedvig', // TODO: should be a translation key
  },
]

export const getProductsByMarket = (market: MarketLabel): Product[] => {
  return PRODUCTS.filter((product) => product.market === market)
}

export const getProductByMarketAndSlug = (market: MarketLabel, slug: string): Product | null => {
  return PRODUCTS.find((product) => product.market === market && product.slug === slug) ?? null
}
