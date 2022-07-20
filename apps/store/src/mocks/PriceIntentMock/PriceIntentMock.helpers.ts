import { factory, manyOf, nullable, primaryKey } from '@mswjs/data'

export const db = factory({
  shopSession: {
    id: primaryKey(() => uuidv4()),
  },

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

export const shopSessionFind = (sessionId: string) => {
  return db.shopSession.findFirst({ where: { id: { equals: sessionId } } })
}

export const shopSessionCreate = () => {
  return db.shopSession.create()
}

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

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
