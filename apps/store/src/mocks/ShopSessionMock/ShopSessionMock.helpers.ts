import { ENTITY_TYPE, PRIMARY_KEY } from '@mswjs/data'
import {
  ShopSessionFindOrCreateQuery,
  CountryCode,
  CurrencyCode,
  CartFragmentFragment,
} from '@/services/graphql/generated'
import { db } from '../db'

export const shopSessionFind = (sessionId: string) => {
  return db.shopSession.findFirst({ where: { id: { equals: sessionId } } })
}

export const shopSessionCreate = (countryCode: string) => {
  return db.shopSession.create({ cart: db.cart.create({ countryCode }) })
}

export const cartLinesAdd = (shopSessionId: string, lineId: string) => {
  const lineItem = db.lineItem.findFirst({ where: { id: { equals: lineId } } })
  const shopSession = db.shopSession.findFirst({ where: { id: { equals: shopSessionId } } })

  if (!lineItem) throw new Error('Line item not found: ' + lineId)
  if (!shopSession) throw new Error('Shop session not found: ' + shopSessionId)

  const cart = shopSession.cart
  if (!cart) throw new Error('Cart not found: ' + shopSessionId)

  const updatedCart = db.cart.update({
    where: { id: { equals: cart.id } },
    data: {
      lines: [lineItem],
    },
  })

  return updatedCart
}

export const cartLinesRemove = (shopSessionId: string, lineId: string) => {
  const lineItem = db.lineItem.findFirst({ where: { id: { equals: lineId } } })
  const shopSession = db.shopSession.findFirst({ where: { id: { equals: shopSessionId } } })

  if (!lineItem) throw new Error('Line item not found: ' + lineId)
  if (!shopSession) throw new Error('Shop session not found: ' + shopSessionId)

  const cart = shopSession.cart
  if (!cart) throw new Error('Cart not found: ' + shopSessionId)

  const updatedCart = db.cart.update({
    where: { id: { equals: cart.id } },
    data: {
      lines: cart.lines.filter((line) => line.id !== lineId),
    },
  })

  return updatedCart
}

export const dbShopSessionToAPI = (
  shopSession: ReturnType<typeof db.shopSession.create>,
): ShopSessionFindOrCreateQuery['shopSessionFindOrCreate'] => {
  const cart = shopSession.cart

  if (cart === undefined) throw new Error('Cart not found: ' + shopSession.id)

  return {
    id: shopSession.id,
    cart: dbCartToAPI(cart),
  }
}

export const dbCartToAPI = (cart: DbCart): CartFragmentFragment => {
  return {
    __typename: 'Cart',
    id: cart.id,
    buyerIdentity: { countryCode: cart.countryCode as CountryCode },
    lines: cart.lines.map((line) => ({
      id: line.id,
      price: { amount: line.priceAmount, currencyCode: line.currencyCode as CurrencyCode },
      variant: { id: line.variantId, title: line.variantTitle },
    })),
  }
}

type DbCart = Omit<ReturnType<typeof db.cart.create>, typeof ENTITY_TYPE | typeof PRIMARY_KEY>
