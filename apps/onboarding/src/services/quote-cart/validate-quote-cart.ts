import type { Market } from '@/lib/types'
import { QuoteCartStatusDocument } from '@/services/apollo/types'
import type { QuoteCartStatusQuery, QuoteCartStatusQueryVariables } from '@/services/apollo/types'
import { GraphQLClient } from './types'

type GetQuoteCartParams = {
  client: GraphQLClient
  id: string
}

const getQuoteCart = async ({ client, id }: GetQuoteCartParams) => {
  const { data } = await client.query<QuoteCartStatusQuery, QuoteCartStatusQueryVariables>({
    query: QuoteCartStatusDocument,
    variables: { id },
  })
  return data.quoteCart
}

export type ValidateQuoteCartParams = GetQuoteCartParams & { market: Market }

export const validateQuoteCart = async ({ client, id, market }: ValidateQuoteCartParams) => {
  const quoteCart = await getQuoteCart({ client, id })
  return quoteCart.market === market && quoteCart.checkout === null
}
