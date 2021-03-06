import { CmsProduct, MarketLabel } from './cms.types'

const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL

export const CmsService = {
  async getProductByMarketAndSlug(market: MarketLabel, slug: string) {
    const response = await fetch(`${CMS_BASE_URL}/products/${market}/${slug}`)
    const product: CmsProduct | null = await response.json()

    return product
  },
  async getProductsByMarket(market: MarketLabel, name?: string) {
    const url = new URL(`${CMS_BASE_URL}/products/${market}`)
    if (name) {
      url.searchParams.append('name', name)
    }

    const response = await fetch(url.toString())
    const products: Array<CmsProduct> = await response.json()

    return products
  },
}
