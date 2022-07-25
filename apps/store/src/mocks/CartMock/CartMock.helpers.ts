import { CartFragmentFragment, CountryCode, CurrencyCode } from '@/services/graphql/generated'
import { db } from '../db'

export const cartFind = (shopSessionId: string) => {
  return db.cart.findFirst({ where: { id: { equals: shopSessionId } } })
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

export const dbToAPI = (cart: ReturnType<typeof db.cart.create>): CartFragmentFragment => {
  return {
    id: cart.id,
    buyerIdentity: { countryCode: cart.countryCode as CountryCode },
    lines: cart.lines.map((line) => ({
      id: line.id,
      price: { amount: line.priceAmount, currencyCode: line.currencyCode as CurrencyCode },
      variant: { id: line.variantId, title: line.variantTitle },
    })),
  }
}
