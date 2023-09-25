// TODO: Remove this file as soon we start to get data from the API
import { CurrencyCode, Peril, ShopSessionAuthenticationStatus } from '@/services/apollo/generated'

const DEFAULT_OFFER = {
  id: '123456',
  variant: {
    displayName: 'Full insurance',
    typeOfContract: 'SE_CAR_FULL',
    perils: [] as Array<Peril>,
    documents: [] as Array<any>,

    // Deprecated
    product: {
      id: 'car-full',
      displayNameFull: 'Car insurance',
      displayNameShort: 'Car',
      name: 'Car Full',
      pageLink: '',
      pillowImage: {
        id: 'car-full-pillow',
        src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
      },
    },
  },
  product: {
    id: 'car-full',
    displayNameFull: 'Car insurance',
    displayNameShort: 'Car',
    name: 'Car Full',
    pageLink: '',
    pillowImage: {
      id: 'car-full-pillow',
      src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
    },
  },
  startDate: '2023-12-31',
  cost: {
    net: { amount: 579, currencyCode: CurrencyCode.Sek },
    gross: { amount: 579, currencyCode: CurrencyCode.Sek },
    discount: { amount: 0, currencyCode: CurrencyCode.Sek },
  },
  priceIntentData: {},
  displayItems: [
    {
      displayTitle: 'Address',
      displayValue: 'Hedvigsgatan 11',
    },
  ] as Array<any>,
} as const

export const CAR_TRIAL_DATA_QUERY = {
  id: '123',

  trialContract: {
    id: '1234',

    premium: {
      amount: 299,
      currencyCode: CurrencyCode.Sek,
    },

    terminationDate: '2023-12-31',

    exposure: {
      displayNameFull: 'Volkswagen Polo · LPP 083',
    },

    currentAgreement: {
      displayName: 'Full insurance',

      displayItems: [
        {
          displayTitle: 'Address',
          displayValue: 'Hedvigsgatan 11',
        },
      ],
    },

    // Deprecated
    variant: {
      displayName: 'Full insurance',

      displayItems: [
        {
          displayTitle: 'Address',
          displayValue: 'Hedvigsgatan 11',
        },
      ],
    },
  },

  priceIntent: {
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

          // Deprecated
          product: {
            id: 'car-half',
            name: 'Half insurance',
            displayNameFull: '',
            pageLink: '',
            pillowImage: {
              id: 'car-half-pillow',
              src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
            },
          },
        },
        product: {
          id: 'car-half',
          name: 'Half insurance',
          displayNameFull: '',
          pageLink: '',
          pillowImage: {
            id: 'car-half-pillow',
            src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
          },
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

          // Deprecated
          product: {
            id: 'car-traffic',
            name: 'Traffic insurance',
            displayNameFull: '',
            pageLink: '',
            pillowImage: {
              id: 'car-traffic-pillow',
              src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
            },
          },
        },
        product: {
          id: 'car-traffic',
          name: 'Traffic insurance',
          displayNameFull: '',
          pageLink: '',
          pillowImage: {
            id: 'car-traffic-pillow',
            src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
          },
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
    defaultOffer: DEFAULT_OFFER as typeof DEFAULT_OFFER | undefined,
  },

  shopSession: {
    id: '71723912',

    customer: {
      ssn: '199001011234',
      authenticationStatus: ShopSessionAuthenticationStatus.None,
    },

    cart: {
      entries: [],
    },
  },
}

export type CarTrialData = typeof CAR_TRIAL_DATA_QUERY
