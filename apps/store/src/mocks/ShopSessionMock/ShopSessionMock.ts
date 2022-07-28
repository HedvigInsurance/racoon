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

const { SHOP_SESSION_FIND_OR_CREATE, CART_LINES_ADD, CART_LINES_REMOVE } = getConstants()

const api = graphql.link(graphqlConstants().GRAPHQL_ENDPOINT)

export const mockShopSessionHandlers = [
  api.query(SHOP_SESSION_FIND_OR_CREATE, (req, res, ctx) => {
    const countryCode = req.variables.countryCode

    const existingShopSession = shopSessionFind(req.variables.shopSessionId)
    const shopSession =
      existingShopSession && existingShopSession.cart?.countryCode === countryCode
        ? existingShopSession
        : shopSessionCreate(req.variables.countyCode)

    return res(
      ctx.data({
        shopSessionFindOrCreate: dbShopSessionToAPI(shopSession),
      }),
    )
  }),

  api.mutation(CART_LINES_ADD, (req, res, ctx) => {
    const cart = cartLinesAdd(req.variables.shopSessionId, req.variables.lineId)

    return res(
      ctx.data({
        cart: {
          linesAdd: { cart: cart ? dbCartToAPI(cart) : null },
        },
      }),
    )
  }),

  api.mutation(CART_LINES_REMOVE, (req, res, ctx) => {
    const cart = cartLinesRemove(req.variables.shopSessionId, req.variables.lineId)

    return res(
      ctx.data({
        cart: {
          linesRemove: { cart: cart ? dbCartToAPI(cart) : null },
        },
      }),
    )
  }),
]
