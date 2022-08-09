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
} from './ShopSessionMock.helpers'

const { SHOP_SESSION_CREATE, SHOP_SESSION, CART_LINES_ADD, CART_LINES_REMOVE } = getConstants()

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

    return res(
      ctx.data({
        shopSession: shopSession ? dbShopSessionToAPI(shopSession) : null,
      }),
    )
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
]
