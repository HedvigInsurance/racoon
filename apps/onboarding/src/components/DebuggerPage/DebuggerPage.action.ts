import { Fields } from 'formidable'
import { set as _set } from 'lodash-es'
import { PageLink } from '@/lib/PageLink'
import { Market } from '@/lib/types'
import { graphqlSdk } from '@/services/graphql/sdk'
import { FORMS_PER_MARKET, PageInput } from './DebuggerPage.constants'
import { isMarket, QuoteBundleError } from './DebuggerPage.helpers'

const PLACEHOLDER_LOCALE = 'en'

const MARKET_TO_URL = {
  [Market.Sweden]: 'se-en',
  [Market.Norway]: 'no-en',
  [Market.Denmark]: 'dk-en',
}

export const handleDebuggerForm = async (formData: Fields) => {
  const { [PageInput.Market]: market, [PageInput.Bundle]: bundle, ...restFormData } = formData

  if (typeof bundle !== 'string') throw new Error(`Invalid bundle: ${bundle}`)
  if (!isMarket(market)) throw new Error(`Invalid market: ${market}`)

  const quoteCart = await graphqlSdk.CreateQuoteCart({ market, locale: PLACEHOLDER_LOCALE })
  const quoteCartId = quoteCart.onboardingQuoteCart_create.id

  const form = FORMS_PER_MARKET[market][bundle]
  if (form === undefined) throw new Error('Form not found')
  const { staticData } = form

  const payload = {}
  Object.entries(restFormData).forEach(([key, value]) => {
    if (!key) return
    _set(payload, key, value === '' ? null : value)
  })

  const quotes = staticData.map((data) => {
    const quote = JSON.parse(JSON.stringify(payload))

    Object.entries(data).forEach(([key, value]) => {
      _set(quote, key, value)
    })

    return quote
  })

  const result = await graphqlSdk.AddQuoteBundle({ quoteCartId, quotes })

  if (result.quoteCart_createQuoteBundle.__typename === 'QuoteBundleError') {
    throw new QuoteBundleError(
      result.quoteCart_createQuoteBundle.type,
      result.quoteCart_createQuoteBundle.message,
    )
  }

  return PageLink.old_offer({ locale: MARKET_TO_URL[market], quoteCartId })
}
