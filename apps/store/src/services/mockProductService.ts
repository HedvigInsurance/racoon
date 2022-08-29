import { MarketLabel } from '@/lib/l10n/types'

export type Peril = {
  id: string
  icon: React.ReactNode
  name: string
  description: string
  covered: Array<string>
  notCovered: Array<string>
}

export enum InsuranceNames {
  SE_HOME,
  SE_CAR,
  SE_ACCIDENT,
}

export enum ProductNames {
  SE_HOME,
  SE_CAR,
  SE_ESSENTIAL_BUNDLE,
}

export type Insurance = {
  name: InsuranceNames
  displayName: string
  perils: Peril[]
}

export type Product = {
  market: MarketLabel
  name: ProductNames
  displayName: string
  insurances: Insurance[] // This is what we would get from PCMS today
}

export const PRODUCTS: Product[] = [
  {
    name: ProductNames.SE_HOME,
    displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)
    market: MarketLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_HOME,
        displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            id: 'peril1',
            icon: 'Icon',
            name: 'Some home peril',
            description: 'Lorem ipsum dolor sit amet',
            covered: ['everything', 'anything'],
            notCovered: ['nothing', 'something'],
          },
        ],
      },
    ],
  },
  {
    name: ProductNames.SE_CAR,
    displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
    market: MarketLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_CAR,
        displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            id: 'carPeril1',
            icon: 'Icon',
            name: 'Some car peril',
            description: 'Lorem ipsum dolor sit amet',
            covered: ['everything', 'anything'],
            notCovered: ['nothing', 'something'],
          },
          {
            id: 'carPeril2',
            icon: 'Icon',
            name: 'Some car peril',
            description: 'Lorem ipsum dolor sit amet',
            covered: ['everything', 'anything'],
            notCovered: ['nothing', 'something'],
          },
          {
            id: 'carPeril3',
            icon: 'Icon',
            name: 'Some car peril',
            description: 'Lorem ipsum dolor sit amet',
            covered: ['everything', 'anything'],
            notCovered: ['nothing', 'something'],
          },
        ],
      },
    ],
  },
  {
    name: ProductNames.SE_ESSENTIAL_BUNDLE,
    displayName: 'Essentials bundle', // TODO: should be a translation key (or translated from BE)
    market: MarketLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_HOME,
        displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            id: 'peril2',
            icon: 'Icon',
            name: 'Some home peril',
            description: 'Lorem ipsum dolor sit amet',
            covered: ['everything', 'anything'],
            notCovered: ['nothing', 'something'],
          },
        ],
      },
      {
        name: InsuranceNames.SE_ACCIDENT,
        displayName: 'Accident insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            id: 'accidentPeril1',
            icon: 'Icon',
            name: 'Some accident peril',
            description: 'Lorem ipsum dolor sit amet',
            covered: ['everything', 'anything'],
            notCovered: ['nothing', 'something'],
          },
        ],
      },
    ],
  },
]

export const getProductByMarketAndName = (market: MarketLabel, name: ProductNames) => {
  return PRODUCTS.find((product) => product.market === market && product.name === name) ?? null
}
