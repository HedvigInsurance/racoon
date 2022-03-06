import { ClientQuoteCartRedirect, Store } from '../types'

import { QuoteCartRedirect } from '@/shared/types'
import _get from 'lodash/get'
import invariant from 'tiny-invariant'

type Params = {
  redirect: QuoteCartRedirect
  store: Store
}

export const convertQuoteCartRedirect = ({ redirect, store }: Params): ClientQuoteCartRedirect => {
  const quoteCartId = _get(store, redirect.id)

  invariant(typeof quoteCartId === 'string', 'Could not find quote cart id')

  return {
    type: redirect.type,
    id: quoteCartId,
    insuranceTypes: redirect.insuranceTypes,
  }
}
