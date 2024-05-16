// TODO: Remove this file as soon we start to get data from the API
import type { Peril, PriceIntent, ShopSession } from '@/services/graphql/generated'
import { CurrencyCode } from '@/services/graphql/generated'

export type TrialExtension = {
  id: string
  trialContract: typeof TRIAL_CONTRACT
  shopSession: ShopSession
  priceIntent: PriceIntent
  ssn: string
}

const TRIAL_CONTRACT = {
  id: '1234',

  premium: {
    amount: 299,
    currencyCode: CurrencyCode.Sek,
  },

  startDate: '2023-12-01',
  terminationDate: '2023-12-31',

  exposure: {
    displayNameFull: 'Volkswagen Polo · LPP 083',
  },

  variant: {
    displayName: 'Full insurance',

    displayItems: [
      {
        key: 'address',
        value: 'Hedvigsgatan 11',
        displayTitle: 'Address',
        displayValue: 'Hedvigsgatan 11',
      },
    ],
  },
}

const DEFAULT_OFFER = {
  id: '123456',
  exposure: {
    displayNameShort: 'LPP 083',
  },
  startDate: '2023-12-31',
  cost: {
    net: { amount: 579, currencyCode: CurrencyCode.Sek },
    gross: { amount: 579, currencyCode: CurrencyCode.Sek },
    discount: { amount: 0, currencyCode: CurrencyCode.Sek },
  },
  displayItems: [
    {
      key: 'address',
      value: 'Hedvigsgatan 11',
      displayTitle: 'Address',
      displayValue: 'Hedvigsgatan 11',
    },
  ],
  priceIntentData: {},
  product: {
    id: 'car-full',
    name: 'SE_CAR',
    displayNameFull: 'Car insurance',
    displayNameShort: 'Car',
    pageLink: '',
    pillowImage: {
      id: 'car-full-pillow',
      src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
    },
  },
  variant: {
    typeOfContract: 'SE_CAR_FULL',
    displayName: 'Full insurance',
    perils: [] as Array<Peril>,
    documents: [] as Array<any>,
  },
}

export const CAR_TRIAL_DATA_QUERY = {
  id: '123',

  trialContract: TRIAL_CONTRACT,

  shopSession: {
    id: '71723912',

    customer: {
      ssn: '199001011234',
    },

    cart: {
      id: '9990090',
      entries: [],
    },

    priceIntents: [
      {
        id: '12345',
        data: { mileage: 1500 },
        offers: [
          DEFAULT_OFFER,
          {
            id: '1234567',
            variant: {
              displayName: 'Half insurance',
              typeOfContract: 'SE_CAR_HALF',
              perils: [],
              documents: [],
            },
            product: {
              id: 'car-half',
              name: 'Car Half',
              displayNameFull: '',
              pageLink: '',
              pillowImage: {
                id: 'car-half-pillow',
                src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
              },
            },
            exposure: {
              displayNameShort: 'LPP 083',
            },
            cost: {
              net: { amount: 479, currencyCode: CurrencyCode.Sek },
              gross: { amount: 479, currencyCode: CurrencyCode.Sek },
              discount: { amount: 0, currencyCode: CurrencyCode.Sek },
            },
            priceIntentData: {},
            displayItems: [],
          },
          {
            id: '12345678',
            variant: {
              displayName: 'Traffic insurance',
              typeOfContract: 'SE_CAR_TRAFFIC',
              perils: [],
              documents: [],
            },
            product: {
              id: 'car-traffic',
              name: 'Car Traffic',
              displayNameFull: '',
              pageLink: '',
              pillowImage: {
                id: 'car-traffic-pillow',
                src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
              },
            },
            exposure: {
              displayNameShort: 'LPP 083',
            },
            cost: {
              net: { amount: 379, currencyCode: CurrencyCode.Sek },
              gross: { amount: 379, currencyCode: CurrencyCode.Sek },
              discount: { amount: 0, currencyCode: CurrencyCode.Sek },
            },
            priceIntentData: {},
            displayItems: [],
          },
        ],
        defaultOffer: {
          id: '123456',
          variant: {
            typeOfContract: 'SE_CAR_FULL',
          },
        },
      },
    ],
  },
}
