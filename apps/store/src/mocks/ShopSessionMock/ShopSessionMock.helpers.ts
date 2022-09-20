import { ENTITY_TYPE, PRIMARY_KEY } from '@mswjs/data'
import {
  CountryCode,
  CurrencyCode,
  CartFragmentFragment,
  ShopSessionQuery,
  PaymentConnectionFlow,
} from '@/services/apollo/generated'
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

export const startDateUpdate = (shopSessionId: string, lineId: string, startDate: Date | null) => {
  const lineItem = db.lineItem.findFirst({ where: { id: { equals: lineId } } })
  if (!lineItem) throw new Error('Line item not found: ' + lineId)

  const updatedLineItem = db.lineItem.update({
    where: { id: { equals: lineId } },
    data: { startDate },
  })

  if (!updatedLineItem) throw new Error('Could not update start date for line item: ' + lineId)

  const shopSession = db.shopSession.findFirst({ where: { id: { equals: shopSessionId } } })
  const updatedCart = shopSession?.cart
  if (!updatedCart) throw new Error('Cart not found: ' + shopSessionId)

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
    checkout: {
      id: 'test',
      paymentConnectionFlow: PaymentConnectionFlow.BeforeSign,
      contactDetails: {},
    },
  }
}

export const dbCartToAPI = (cart: DbCart): CartFragmentFragment => {
  const totalCost = cart.lines.reduce((a, b) => a + b.priceAmount, 0)

  return {
    __typename: 'Cart',
    id: cart.id,
    cost: {
      total: { amount: totalCost.toString(), currencyCode: CurrencyCode.Sek },
      subtotal: { amount: totalCost.toString(), currencyCode: CurrencyCode.Sek },
    },
    entries: cart.lines.map((line) => ({
      __typename: 'PricedProductVariant',
      id: line.id,
      title: line.variantTitle,
      startDate: line.startDate?.toISOString().substring(0, 10) ?? null,
      price: {
        __typename: 'Money',
        amount: line.priceAmount.toString(),
        currencyCode: line.currencyCode as CurrencyCode,
      },
    })),
  }
}

type DbCart = Omit<ReturnType<typeof db.cart.create>, typeof ENTITY_TYPE | typeof PRIMARY_KEY>
