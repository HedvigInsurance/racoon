import { db } from '../db'

export const shopSessionFind = (sessionId: string) => {
  return db.shopSession.findFirst({ where: { id: { equals: sessionId } } })
}

export const shopSessionCreate = () => {
  return db.shopSession.create({ cart: db.cart.create() })
}
