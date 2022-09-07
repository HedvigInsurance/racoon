import { ShieldIcon } from '@/components/Perils/ShieldIcon'
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
            icon: <ShieldIcon size="22px" />,
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
    displayName: 'Car insurance',
    market: MarketLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_CAR,
        displayName: 'Car insurance',
        perils: [
          {
            id: 'waterLeaks',
            icon: <ShieldIcon size="22px" />,
            name: 'Water leaks',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
            covered: [
              'Lorem ipsum dolor sit amet',
              'Sed fermentum tempus',
              'Morbi at egestas tortor',
              'Quisque venenatis lacus dolor',
            ],
            notCovered: ['Morbi vitae elit sapien', 'Duis sed viverra nibh'],
          },
          {
            id: 'fire',
            icon: <ShieldIcon size="22px" />,
            name: 'Fire',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
            covered: ['Lorem ipsum dolor sit amet', 'Sed fermentum tempus'],
            notCovered: [
              'Morbi at egestas tortor',
              'Morbi vitae elit sapien',
              'Duis sed viverra nibh',
              'Quisque venenatis lacus dolor',
            ],
          },
          {
            id: 'storms',
            icon: <ShieldIcon size="22px" />,
            name: 'Storms',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
            covered: [
              'Lorem ipsum dolor sit amet',
              'Sed fermentum tempus',
              'Quisque venenatis lacus dolor',
            ],
            notCovered: ['Morbi vitae elit sapien'],
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
            icon: <ShieldIcon size="22px" />,
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
            icon: <ShieldIcon size="22px" />,
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
