import type { Passage, PassageAction, PassageRedirect } from '@/shared/types'

import { DOMParser } from '@xmldom/xmldom'
import { JSONPassage } from './types'
import { PassageElement } from '@/shared/types'
import { parseGraphQLAPI } from './utils/parse-graphql-api'
import { parseMessage } from './utils/parse-message'
import { parseNumberAction } from './utils/parse-number-action'
import { parseQuoteCartRedirect } from './utils/parse-quote-cart-offer-redirect'
import { parseRedirect } from './utils/parse-redirect'
import { parseResponse } from './utils/parse-response'
import { parseSelectAction } from './utils/parse-select-action'
import { parseTextAction } from './utils/parse-text-action'
import { parseTextActionSet } from './utils/parse-text-action-set'

const _XML_PARSER = new DOMParser()

const parseXML = (xml: string) => {
  const dom = _XML_PARSER.parseFromString(`<div>${xml}</div>`, 'text/xml')
  return dom.documentElement
}

type ActionParser = { element: PassageElement; parser: (element: Element) => PassageAction }

const actionParsers: Array<ActionParser> = [
  {
    element: PassageElement.SelectAction,
    parser: parseSelectAction,
  },
  {
    element: PassageElement.TextAction,
    parser: parseTextAction,
  },
  {
    element: PassageElement.TextActionSet,
    parser: parseTextActionSet,
  },
  {
    element: PassageElement.NumberAction,
    parser: parseNumberAction,
  },
  {
    element: PassageElement.GraphQLAPI,
    parser: parseGraphQLAPI,
  },
]

type RedirectParser = { element: PassageElement; parser: (element: Element) => PassageRedirect }
const redirectParsers: Array<RedirectParser> = [
  {
    element: PassageElement.Redirect,
    parser: parseRedirect,
  },
  {
    element: PassageElement.QuoteCartOfferRedirect,
    parser: parseQuoteCartRedirect,
  },
]

export const parsePassage = (passage: JSONPassage): Passage => {
  const rootElement = parseXML(passage.text)

  const rawMessages = rootElement.getElementsByTagName(PassageElement.Message)
  const messages = Array.from(rawMessages).map(parseMessage)

  const rawResponses = rootElement.getElementsByTagName(PassageElement.Response)
  const responses = Array.from(rawResponses).map(parseResponse)

  let action: PassageAction | undefined = undefined

  const redirects: Array<PassageRedirect> = []
  for (const { element, parser } of redirectParsers) {
    const redirectElements = rootElement.getElementsByTagName(element)
    Array.from(redirectElements)
      .map(parser)
      .forEach((redirect) => redirects.push(redirect))
  }

  for (const { element, parser } of actionParsers) {
    const actionElement = rootElement.getElementsByTagName(element)[0]
    if (actionElement) {
      action = parser(actionElement)
    }
  }

  return {
    name: passage.name,
    messages,
    responses,
    action,
    redirects,
  }
}
