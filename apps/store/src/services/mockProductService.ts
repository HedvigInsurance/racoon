import { CountryLabel } from '@/lib/l10n/types'

type Peril = {
  title: string
  body: string
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

type Insurance = {
  name: InsuranceNames
  displayName: string
  perils: Peril[]
}

export type Product = {
  market: CountryLabel
  name: ProductNames
  displayName: string
  insurances: Insurance[] // This is what we would get from PCMS today
}

const PRODUCTS: Product[] = [
  {
    name: ProductNames.SE_HOME,
    displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)
    market: CountryLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_HOME,
        displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)

        perils: [
          {
            title: 'Some home peril',
            body: 'Lorem ipsum dolor sit amet',
          },
        ],
      },
    ],
  },
  {
    name: ProductNames.SE_CAR,
    displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
    market: CountryLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_CAR,
        displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            title: 'Some car peril',
            body: 'Lorem ipsum dolor sit amet',
          },
        ],
      },
    ],
  },
  {
    name: ProductNames.SE_ESSENTIAL_BUNDLE,
    displayName: 'Essentials bundle', // TODO: should be a translation key (or translated from BE)
    market: CountryLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_HOME,
        displayName: 'Home insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            title: 'Some home peril',
            body: 'Lorem ipsum dolor sit amet',
          },
        ],
      },
      {
        name: InsuranceNames.SE_ACCIDENT,
        displayName: 'Accident insurance', // TODO: should be a translation key (or translated from BE)
        perils: [
          {
            title: 'Some accident peril',
            body: 'Lorem ipsum dolor sit amet',
          },
        ],
      },
    ],
  },
]

export const getProductByMarketAndName = (market: CountryLabel, name: ProductNames) => {
  return PRODUCTS.find((product) => product.market === market && product.name === name) ?? null
}
