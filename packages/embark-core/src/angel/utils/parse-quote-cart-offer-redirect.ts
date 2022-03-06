import {
  LogicalOperator,
  PassageElement,
  QuoteCartRedirect,
  WhenOperator,
  WhenStatement,
} from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseLogicalOperator } from './parse-logical-operator'
import { parseWhen } from './parse-when'

export const parseQuoteCartRedirect = (element: Element): QuoteCartRedirect => {
  const whenStatement = element.getAttribute(Attribute.When)
  const id = element.getAttribute(Attribute.QuoteCardId)
  const rawInsuranceTypes = element.getAttribute(Attribute.InsuranceTypes)

  invariant(id, `${PassageElement.QuoteCartOfferRedirect}: id attribute is required`)

  let conditions: Array<WhenStatement> = [{ operator: WhenOperator.PASS }]
  let operator = LogicalOperator.AND
  if (whenStatement) {
    operator = parseLogicalOperator(whenStatement)
    conditions = parseWhen(whenStatement, operator)
  }

  const insuranceTypes = rawInsuranceTypes
    ? rawInsuranceTypes.split(',').map((string) => string.trim())
    : []

  return {
    type: PassageElement.QuoteCartOfferRedirect,
    id,
    insuranceTypes,
    condition: { statements: conditions, operator },
  }
}
