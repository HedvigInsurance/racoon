import type { Passage, PassageAction } from '@/shared/types'

import { DOMParser } from '@xmldom/xmldom'
import { JSONPassage } from './types'
import { PassageElement } from '@/shared/types'
import { parseMessage } from './utils/parse-message'
import { parseNumberAction } from './utils/parse-number-action'
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
]

export const parsePassage = (passage: JSONPassage): Passage => {
  const rootElement = parseXML(passage.text)

  const rawMessages = rootElement.getElementsByTagName(PassageElement.Message)
  const messages = Array.from(rawMessages).map(parseMessage)

  const rawResponses = rootElement.getElementsByTagName(PassageElement.Response)
  const responses = Array.from(rawResponses).map(parseResponse)

  let action: PassageAction | undefined = undefined

  const rawRedirects = rootElement.getElementsByTagName(PassageElement.Redirect)
  const redirects = Array.from(rawRedirects).map(parseRedirect)

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
