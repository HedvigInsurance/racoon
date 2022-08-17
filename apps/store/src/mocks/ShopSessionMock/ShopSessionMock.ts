import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './ShopSessionMock.constants'
import {
  cartLinesAdd,
  cartLinesRemove,
  dbCartToAPI,
  dbShopSessionToAPI,
  shopSessionCreate,
  shopSessionFind,
  startDateUpdate,
} from './ShopSessionMock.helpers'

const { SHOP_SESSION_CREATE, SHOP_SESSION, CART_LINES_ADD, CART_LINES_REMOVE, START_DATE_UPDATE } =
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

  api.mutation(CART_LINES_ADD, (req, res, ctx) => {
    const cart = cartLinesAdd(req.variables.shopSessionId, req.variables.lineId)

    return res(
      ctx.data({
        shopSession: {
          cart: {
            linesAdd: { cart: cart ? dbCartToAPI(cart) : null },
          },
        },
      }),
    )
  }),

  api.mutation(CART_LINES_REMOVE, (req, res, ctx) => {
    const cart = cartLinesRemove(req.variables.shopSessionId, req.variables.lineId)

    return res(
      ctx.data({
        shopSession: {
          cart: {
            linesRemove: { cart: cart ? dbCartToAPI(cart) : null },
          },
        },
      }),
    )
  }),

  api.mutation(START_DATE_UPDATE, (req, res, ctx) => {
    const startDate = new Date(req.variables.startDate)
    const cart = startDateUpdate(req.variables.shopSessionId, req.variables.lineId, startDate)

    return res(
      ctx.data({
        shopSession: {
          cart: {
            startDateUpdate: { cart: cart ? dbCartToAPI(cart) : null },
          },
        },
      }),
    )
  }),
]
