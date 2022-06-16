type Market = 'se' | 'no' | 'dk'

export type Product = {
  market: Market
  name: string
  slug: string
  pageTitle: string
}

const PRODUCTS: Product[] = [
  {
    name: 'SE_HOME',
    market: 'se',
    slug: 'home',
    pageTitle: 'Home insurance | Hedvig', // TODO: should be a translation key
  },
]

export const getProductsByMarket = (market: Market): Product[] => {
  return PRODUCTS.filter((product) => product.market === market)
}

export const getProductByMarketAndSlug = (market: Market, slug: string): Product | null => {
  return PRODUCTS.find((product) => product.market === market && product.slug === slug) ?? null
}
