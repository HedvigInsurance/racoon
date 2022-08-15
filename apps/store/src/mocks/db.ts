import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data'

export const db = factory({
  shopSession: {
    id: primaryKey(() => uuidv4()),
    countryCode: String,
    currencyCode: String,
    cart: oneOf('cart'),
  },

  lineItem: {
    id: primaryKey(() => uuidv4()),
    priceAmount: () => Math.floor(Math.random() * (500 - 50) + 50),
    currencyCode: () => 'SEK',
    variantId: () => uuidv4(),
    variantTitle: () => 'Hedvig Home',
    startDate: nullable(() => new Date()),
  },

  priceIntent: {
    id: primaryKey(() => uuidv4()),
    data: () => '{}',
    lines: nullable(manyOf('lineItem')),
  },

  cart: {
    id: primaryKey(() => uuidv4()),
    lines: manyOf('lineItem'),
  },
})

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
