import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './ShopSessionMock.constants'
import {
  cartEntryAdd,
  cartEntryRemove,
  dbCartToAPI,
  dbShopSessionToAPI,
  shopSessionCreate,
  shopSessionFind,
  startDateUpdate,
} from './ShopSessionMock.helpers'

const { SHOP_SESSION_CREATE, SHOP_SESSION, CART_ENTRY_ADD, CART_ENTRY_REMOVE, START_DATE_UPDATE } =
  getConstants()

const api = graphql.link(graphqlConstants().GRAPHQL_ENDPOINT)

export const mockShopSessionHandlers = [
  api.mutation(SHOP_SESSION_CREATE, (req, res, ctx) => {
    const countryCode = req.variables.countryCode
    const shopSession = shopSessionCreate(countryCode)

    return res(
      ctx.data({
        shopSessionCreate: dbShopSessionToAPI(shopSession),
      }),
    )
  }),

  api.query(SHOP_SESSION, (req, res, ctx) => {
    const shopSession = shopSessionFind(req.variables.shopSessionId)

    if (shopSession === null) {
      return res(ctx.errors([{ message: 'Subgraph errors redacted', locations: [] }]))
    }

    return res(ctx.data({ shopSession: dbShopSessionToAPI(shopSession) }))
  }),

  api.mutation(CART_ENTRY_ADD, (req, res, ctx) => {
    const cart = cartEntryAdd(req.variables.shopSessionId, req.variables.pricedVariantId)

    return res(
      ctx.data({
        cartEntriesAdd: { cart: cart ? dbCartToAPI(cart) : null },
      }),
    )
  }),

  api.mutation(CART_ENTRY_REMOVE, (req, res, ctx) => {
    const cart = cartEntryRemove(req.variables.shopSessionId, req.variables.pricedVariantId)

    return res(
      ctx.data({
        cartEntriesRemove: { cart: cart ? dbCartToAPI(cart) : null },
      }),
    )
  }),

  api.mutation(START_DATE_UPDATE, (req, res, ctx) => {
    const startDate = new Date(req.variables.startDate)
    const cart = startDateUpdate(req.variables.shopSessionId, req.variables.lineId, startDate)

    return res(
      ctx.data({
        cartLineStartDateUpdate: { cart: cart ? dbCartToAPI(cart) : null },
      }),
    )
  }),
]
