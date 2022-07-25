import { factory, manyOf, nullable, primaryKey } from '@mswjs/data'
import { uuidv4 } from '../helpers'

const db = factory({
  priceIntentLine: {
    id: primaryKey(() => uuidv4()),
    priceAmount: () => Math.floor(Math.random() * (500 - 50) + 50),
    currencyCode: () => 'SEK',
    variantId: () => uuidv4(),
    variantTitle: () => 'Hedvig Home',
  },

  priceIntent: {
    id: primaryKey(() => uuidv4()),
    data: () => '{}',
    lines: nullable(manyOf('priceIntentLine')),
  },
})

export const priceIntentCreate = () => {
  return db.priceIntent.create()
}

export const priceIntentFind = (priceIntentId: string) => {
  return db.priceIntent.findFirst({ where: { id: { equals: priceIntentId } } })
}

export const priceIntentDataUpdate = (priceIntentId: string, data: Record<string, unknown>) => {
  const updatedPriceIntent = db.priceIntent.update({
    where: { id: { equals: priceIntentId } },
    data: {
      data: (prevData) => JSON.stringify({ ...JSON.parse(prevData), ...data }),
    },
  })

  return updatedPriceIntent
}

export const priceIntentConfirm = (priceIntentId: string) => {
  const newPriceIntentLineItem = db.priceIntentLine.create()

  const updatedPriceIntent = db.priceIntent.update({
    where: { id: { equals: priceIntentId } },
    data: {
      lines: [newPriceIntentLineItem],
    },
  })
  return updatedPriceIntent
}

export const priceIntentToAPI = (priceIntent: ReturnType<typeof db.priceIntent.create>) => {
  const lines = priceIntent.lines?.map((line) => ({
    id: line.id,
    price: { amount: line.priceAmount, currencyCode: line.currencyCode },
    variant: { id: line.variantId, title: line.variantTitle },
  }))

  return {
    id: priceIntent.id,
    data: JSON.parse(priceIntent.data),
    lines: lines ?? null,
  }
}
