import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './CartMock.constants'
import { cartFind, dbToAPI } from './CartMock.helpers'

const { CART } = getConstants()

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
]
