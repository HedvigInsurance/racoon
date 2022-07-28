import { db } from '../db'

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
  return db.priceIntent.update({
    where: { id: { equals: priceIntentId } },
    data: {
      lines: [db.lineItem.create()],
    },
  })
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
