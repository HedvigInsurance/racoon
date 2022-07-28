import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './CartMock.constants'
import { cartFind, cartLinesAdd, cartLinesRemove, dbToAPI } from './CartMock.helpers'

const { CART, CART_LINES_ADD, CART_LINES_REMOVE } = getConstants()

const api = graphql.link(graphqlConstants().GRAPHQL_ENDPOINT)

export const mockCartHandlers = [
  api.query(CART, (req, res, ctx) => {
    const cart = cartFind(req.variables.shopSessionId)
    return res(
      ctx.data({
        shopSession: {
          cart: cart ? dbToAPI(cart) : null,
        },
      }),
    )
  }),

  api.mutation(CART_LINES_ADD, (req, res, ctx) => {
    const cart = cartLinesAdd(req.variables.shopSessionId, req.variables.lineId)

    return res(
      ctx.data({
        cart: {
          linesAdd: { cart: cart ? dbToAPI(cart) : null },
        },
      }),
    )
  }),

  api.mutation(CART_LINES_REMOVE, (req, res, ctx) => {
    const cart = cartLinesRemove(req.variables.shopSessionId, req.variables.lineId)

    return res(
      ctx.data({
        cart: {
          linesRemove: { cart: cart ? dbToAPI(cart) : null },
        },
      }),
    )
  }),
]
