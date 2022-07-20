import { graphql } from 'msw'
import { getConstants } from './PriceIntentMock.constants'
import {
  priceIntentConfirm,
  priceIntentCreate,
  priceIntentDataUpdate,
  priceIntentFind,
  priceIntentToAPI,
  shopSessionCreate,
  shopSessionFind,
} from './PriceIntentMock.helpers'

const {
  GRAPHQL_ENDPOINT,
  SHOP_SESSION,
  SHOP_SESSION_CREATE,
  PRICE_INTENT,
  PRICE_INTENT_CREATE,
  PRICE_INTENT_DATA_UPDATE,
  PRICE_INTENT_CONFIRM,
} = getConstants()

const api = graphql.link(GRAPHQL_ENDPOINT)

export const mockPriceIntentHandlers = [
  api.query(SHOP_SESSION, (req, res, ctx) => {
    return res(ctx.data({ shopSession: shopSessionFind(req.variables.sessionId) }))
  }),

  api.mutation(SHOP_SESSION_CREATE, (_, res, ctx) => {
    return res(ctx.data({ shopSession: { create: { shopSession: shopSessionCreate() } } }))
  }),

  api.query(PRICE_INTENT, (req, res, ctx) => {
    const priceIntent = priceIntentFind(req.variables.priceIntentId)
    return res(ctx.data({ priceIntent: priceIntent ? priceIntentToAPI(priceIntent) : null }))
  }),

  api.mutation(PRICE_INTENT_CREATE, (_, res, ctx) => {
    const priceIntent = priceIntentCreate()
    return res(
      ctx.data({ priceIntent: { create: { priceIntent: priceIntentToAPI(priceIntent) } } }),
    )
  }),

  api.mutation(PRICE_INTENT_DATA_UPDATE, (req, res, ctx) => {
    const priceIntent = priceIntentDataUpdate(req.variables.priceIntentId, req.variables.data)
    return res(
      ctx.data({
        priceIntent: {
          dataUpdate: { priceIntent: priceIntent ? priceIntentToAPI(priceIntent) : null },
        },
      }),
    )
  }),

  api.mutation(PRICE_INTENT_CONFIRM, (req, res, ctx) => {
    const priceIntent = priceIntentConfirm(req.variables.priceIntentId)
    return res(
      ctx.data({
        priceIntent: {
          confirm: { priceIntent: priceIntent ? priceIntentToAPI(priceIntent) : null },
        },
      }),
    )
  }),
]
