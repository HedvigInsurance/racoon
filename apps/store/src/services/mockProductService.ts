import { MarketLabel } from '@/lib/l10n/types'

type Peril = {
  title: string
  body: string
}

export type Product = {
  market: MarketLabel
  name: string
  displayName: string
  perils: Peril[]
}

const PRODUCTS: Product[] = [
  {
    name: 'SE_HOME',
    displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)
    market: MarketLabel.SE,
    perils: [
      {
        title: 'Some home peril',
        body: 'Lorem ipsum dolor sit amet',
      },
    ],
  },
  {
    name: 'SE_CAR',
    displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
    market: MarketLabel.SE,
    perils: [
      {
        title: 'Some car peril',
        body: 'Lorem ipsum dolor sit amet',
      },
    ],
  },
  {
    name: 'SE_ACCIDENT',
    displayName: 'Accident insurance', // TODO: should be a translation key (or translated from BE)
    market: MarketLabel.SE,
    perils: [
      {
        title: 'Some accident peril',
        body: 'Lorem ipsum dolor sit amet',
      },
    ],
  },
]

export const getProductByMarketAndName = (market: MarketLabel, name: string) => {
  return PRODUCTS.find((product) => product.market === market && product.name === name) ?? null
}
