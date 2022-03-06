import { ClientAction, ClientPassage, Store } from './types'
import { Passage, PassageElement, PassageRedirect } from '@/shared/types'

import { convertPassageAction } from './utils/convert-passage-action'
import { convertQuoteCartRedirect } from './utils/convert-quote-cart-redirect'

type Params = { passage: Passage; store: Store; redirect?: PassageRedirect }

export const convertPassage = ({ passage, store, redirect }: Params): ClientPassage => {
  let action: ClientAction | undefined = undefined

  if (redirect && redirect.type === PassageElement.QuoteCartOfferRedirect) {
    action = convertQuoteCartRedirect({ redirect, store })
  } else if (passage.action) {
    action = convertPassageAction(passage.action)
  }

  return {
    name: passage.name,
    messages: passage.messages.map(({ label }) => label),
    responses: passage.responses.map(({ label }) => label),
    action,
  }
}
