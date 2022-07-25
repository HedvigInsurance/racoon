import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './PriceIntentMock.constants'
import {
  priceIntentConfirm,
  priceIntentCreate,
  priceIntentDataUpdate,
  priceIntentFind,
  priceIntentToAPI,
} from './PriceIntentMock.helpers'

const { PRICE_INTENT, PRICE_INTENT_CREATE, PRICE_INTENT_DATA_UPDATE, PRICE_INTENT_CONFIRM } =
  getConstants()

const api = graphql.link(graphqlConstants().GRAPHQL_ENDPOINT)

export const mockPriceIntentHandlers = [
  api.query(PRICE_INTENT, (req, res, ctx) => {
    const priceIntent = priceIntentFind(req.variables.priceIntentId)
    return res(
      ctx.data({
        shopSession: {
          priceIntent: priceIntent ? priceIntentToAPI(priceIntent) : null,
        },
      }),
    )
  }),

  api.mutation(PRICE_INTENT_CREATE, (_, res, ctx) => {
    const priceIntent = priceIntentCreate()
    return res(
      ctx.data({
        priceIntent: { create: priceIntentToAPI(priceIntent) },
      }),
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
