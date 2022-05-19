import { Fields } from 'formidable'
import { set as _set } from 'lodash-es'
import { PageLink } from '@/lib/page-link'
import { Market } from '@/lib/types'
import { graphqlSdk } from '@/services/graphql/sdk'
import { FORMS_PER_MARKET, PageInput } from './DebuggerPage.constants'
import { isMarket } from './DebuggerPage.helpers'

const MARKET_TO_URL = {
  [Market.Sweden]: 'se',
  [Market.Norway]: 'no',
  [Market.Denmark]: 'dk',
}

export const handleDebuggerForm = async (formData: Fields) => {
  const { [PageInput.Market]: market, [PageInput.Bundle]: bundle, ...restFormData } = formData

  if (typeof bundle !== 'string') throw new Error(`Invalid bundle: ${bundle}`)
  if (!isMarket(market)) throw new Error(`Invalid market: ${market}`)

  const quoteCart = await graphqlSdk.CreateQuoteCart({ market, locale: 'sv' })
  const quoteCartId = quoteCart.onboardingQuoteCart_create.id
  console.log('quoteCartId', quoteCartId)

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

    console.log('quote start', quote)

    Object.entries(data).forEach(([key, value]) => {
      _set(quote, key, value)
    })

    console.log('quote end', quote)
    return quote
  })

  console.log('quotes', quotes)

  const result = await graphqlSdk.AddQuoteBundle({ quoteCartId, quotes })

  console.log('result', result)

  console.log(result.quoteCart_createQuoteBundle.__typename)
  if (result.quoteCart_createQuoteBundle.__typename === 'QuoteBundleError') {
    throw new Error(result.quoteCart_createQuoteBundle.message)
  }

  return PageLink.old_offer({ locale: MARKET_TO_URL[market], quoteCartId })
}
