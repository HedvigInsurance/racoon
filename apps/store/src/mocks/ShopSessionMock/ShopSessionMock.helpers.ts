import { factory, primaryKey } from '@mswjs/data'
import { uuidv4 } from '../helpers'

export const db = factory({
  shopSession: {
    id: primaryKey(() => uuidv4()),
  },
})

export const shopSessionFind = (sessionId: string) => {
  return db.shopSession.findFirst({ where: { id: { equals: sessionId } } })
}

export const shopSessionCreate = () => {
  return db.shopSession.create()
}
