import { ENTITY_TYPE, PRIMARY_KEY } from '@mswjs/data'
import {
  CountryCode,
  CurrencyCode,
  CartFragmentFragment,
  ShopSessionQuery,
} from '@/services/graphql/generated'
import { db } from '../db'

export const shopSessionFind = (sessionId: string) => {
  return db.shopSession.findFirst({ where: { id: { equals: sessionId } } })
}

export const shopSessionCreate = (countryCode: string) => {
  return db.shopSession.create({ cart: db.cart.create(), countryCode, currencyCode: 'SEK' })
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
      lines: [...(shopSession.cart?.lines ?? []), lineItem],
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
): ShopSessionQuery['shopSession'] => {
  const cart = shopSession.cart

  if (cart === undefined) throw new Error('Cart not found: ' + shopSession.id)

  return {
    id: shopSession.id,
    countryCode: shopSession.countryCode as CountryCode,
    currencyCode: shopSession.currencyCode as CurrencyCode,
    cart: dbCartToAPI(cart),
  }
}

export const dbCartToAPI = (cart: DbCart): CartFragmentFragment => {
  return {
    __typename: 'Cart',
    id: cart.id,
    lines: cart.lines.map((line) => ({
      __typename: 'CartLine',
      id: line.id,
      price: {
        __typename: 'Money',
        amount: line.priceAmount,
        currencyCode: line.currencyCode as CurrencyCode,
      },
      variant: {
        __typename: 'ProductVariant',
        id: line.variantId,
        title: line.variantTitle,
      },
    })),
  }
}

type DbCart = Omit<ReturnType<typeof db.cart.create>, typeof ENTITY_TYPE | typeof PRIMARY_KEY>
