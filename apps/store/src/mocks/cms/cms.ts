import { rest } from 'msw'
import {
  SWEDEN_APARTMENT_FORM,
  SWEDEN_CAR_FORM,
} from '@/components/PriceCalculator/PriceCalculator.constants'
import { Cms } from '@/services/cms'
import { CmsProduct, MarketLabel } from '@/services/cms/types'
import { ProductNames } from '@/services/mockProductService'

const CMS_BASE_URL = process.env.NEXT_PUBLIC_STORYBLOK_URL

const CMS_PRODUCTS: Record<MarketLabel, CmsProduct[]> = {
  SE: [
    {
      market: MarketLabel.SE,
      displayName: 'Home insurance villa', // TODO: should be a translation key (or translated from BE)
      slug: 'home',
      pageTitle: 'Home insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
      product: ProductNames.SE_HOME,
      form: SWEDEN_APARTMENT_FORM,
    },
    {
      market: MarketLabel.SE,
      displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
      slug: 'car',
      pageTitle: 'Car insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
      product: ProductNames.SE_CAR,
      form: SWEDEN_CAR_FORM,
    },
    {
      market: MarketLabel.SE,
      displayName: 'Home and accident insurance', // TODO: should be a translation key (or translated from BE)
      slug: 'home-accident',
      pageTitle: 'Home & accident insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
      product: ProductNames.SE_ESSENTIAL_BUNDLE,
      form: SWEDEN_APARTMENT_FORM,
    },
  ],
  NO: [],
  DK: [],
}

export const mockCmsHandlers = [
  rest.get<
    {},
    { market: string; slug: string },
    Awaited<ReturnType<typeof Cms.getProductByMarketAndSlug>>
  >(`${CMS_BASE_URL}/products/:market/:slug`, (req, res, ctx) => {
    const { market, slug } = req.params

    if (market && slug) {
      const product = CMS_PRODUCTS[market as MarketLabel].find((product) => product.slug === slug)

      if (product) {
        return res(ctx.json(product))
      }
    }

    return res(ctx.json(null))
  }),
  rest.get<{}, { market: string }, Awaited<ReturnType<typeof Cms.getProductsByMarket>>>(
    `${CMS_BASE_URL}/products/:market`,
    (req, res, ctx) => {
      const { market } = req.params
      const name = req.url.searchParams.get('name')

      let products = CMS_PRODUCTS[market as MarketLabel]
      if (name) {
        products = products.filter(({ product }) => name === product.toString())
      }

      return res(ctx.json(products))
    },
  ),
]
