import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './ShopSessionMock.constants'
import { shopSessionCreate, shopSessionFind } from './ShopSessionMock.helpers'

const { SHOP_SESSION, SHOP_SESSION_CREATE } = getConstants()

const api = graphql.link(graphqlConstants().GRAPHQL_ENDPOINT)

export const mockShopSessionHandlers = [
  api.query(SHOP_SESSION, (req, res, ctx) => {
    return res(ctx.data({ shopSession: shopSessionFind(req.variables.sessionId) }))
  }),

  api.mutation(SHOP_SESSION_CREATE, (_, res, ctx) => {
    return res(ctx.data({ shopSession: { create: { shopSession: shopSessionCreate() } } }))
  }),
]
