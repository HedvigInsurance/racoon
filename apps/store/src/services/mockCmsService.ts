import { MarketLabel } from '@/lib/l10n/types'
import { SE_APARTMENT_TEMPLATE } from './formTemplate/data/SE_APARTMENT'
import { SE_CAR_TEMPLATE } from './formTemplate/data/SE_CAR'
import { FormTemplate } from './formTemplate/FormTemplate.types'
import { ProductNames } from './mockProductService'

export type CmsProduct = {
  market: MarketLabel
  displayName: string
  slug: string
  pageTitle: string
  form: FormTemplate
  product: ProductNames
}

const CMS_PRODUCTS: CmsProduct[] = [
  {
    market: MarketLabel.SE,
    displayName: 'Home insurance villa', // TODO: should be a translation key (or translated from BE)
    slug: 'home',
    pageTitle: 'Home insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: ProductNames.SE_HOME,
    form: SE_APARTMENT_TEMPLATE,
  },
  {
    market: MarketLabel.SE,
    displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
    slug: 'car',
    pageTitle: 'Car insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: ProductNames.SE_CAR,
    form: SE_CAR_TEMPLATE,
  },
  {
    market: MarketLabel.SE,
    displayName: 'Home and accident insurance', // TODO: should be a translation key (or translated from BE)
    slug: 'home-accident',
    pageTitle: 'Home & accident insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: ProductNames.SE_ESSENTIAL_BUNDLE,
    form: SE_APARTMENT_TEMPLATE,
  },
]

export const getProductByMarketAndSlug = (market: MarketLabel, slug: string): CmsProduct | null => {
  return CMS_PRODUCTS.find((product) => product.market === market && product.slug === slug) ?? null
}

export const getProductsByMarket = (market: MarketLabel): CmsProduct[] => {
  return CMS_PRODUCTS.filter((product) => product.market === market)
}
