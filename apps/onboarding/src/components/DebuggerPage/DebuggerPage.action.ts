import { Fields } from 'formidable'
import { set as _set } from 'lodash-es'
import { PageLink } from '@/lib/page-link'
import { graphqlSdk } from '@/services/graphql/sdk'
import { FORMS_PER_MARKET, PageInput } from './DebuggerPage.constants'
import { isMarket } from './DebuggerPage.helpers'

export const handleDebuggerForm = async (quoteCartId: string, formData: Fields) => {
  const { [PageInput.Market]: market, [PageInput.Bundle]: bundle } = formData

  if (typeof bundle !== 'string') throw new Error(`Invalid bundle: ${bundle}`)
  if (!isMarket(market)) throw new Error(`Invalid market: ${market}`)

  const form = FORMS_PER_MARKET[market][bundle]
  if (form === undefined) throw new Error('Form not found')
  const { staticData } = form

  const payload = { data: {} }
  Object.entries(formData).forEach(([key, value]) => {
    _set(payload, key, value || null)
  })

  const quotes = staticData.map((staticData) => {
    const quote = { ...payload }

    Object.entries(staticData).forEach(([key, value]) => {
      _set(payload, key, value || null)
    })

    return quote
  })

  const result = await graphqlSdk.AddQuoteBundle({ quoteCartId, quotes })

  if (result.quoteCart_createQuoteBundle.__typename === 'QuoteBundleError') {
    throw new Error(result.quoteCart_createQuoteBundle.message)
  }

  return PageLink.old_offer({ locale: 'se', quoteCartId })
}
