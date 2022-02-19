import { LogicalOperator, Redirect, WhenStatement } from '@/shared/types'

import { Store } from '../types'
import { WhenOperator } from '../../shared/types'
import _get from 'lodash/get'
import invariant from 'tiny-invariant'

const parseValue = (value: string) => {
  if (value === 'true') return true
  if (value === 'false') return false

  const valueAsNumber = parseFloat(value)
  if (!isNaN(valueAsNumber)) return valueAsNumber

  return value
}

const evaluateCondition = (statement: WhenStatement, store: Store) => {
  if (statement.operator === WhenOperator.PASS) {
    return true
  }

  const { key, value, operator } = statement

  const parsedValue = parseValue(value)

  const storeValue = _get(store, key)

  if (operator === WhenOperator.EQUAL) {
    return storeValue === value || storeValue === parsedValue
  }

  invariant(
    typeof storeValue === 'number',
    `When KEY with ${operator} must be a number, got: ${storeValue} for key: ${key}`,
  )
  invariant(
    typeof parsedValue === 'number',
    `When VALUE with ${operator} must be a number, got: ${value} for key: ${key}`,
  )

  return operator === WhenOperator.GREATER_THAN
    ? storeValue > parsedValue
    : storeValue < parsedValue
}

export const getRedirectLink = (store: Store, redirects: Array<Redirect>) => {
  for (const redirect of redirects) {
    let isPassing: boolean

    if (redirect.logicalOperator === LogicalOperator.AND) {
      isPassing = redirect.conditions.every((statement) => evaluateCondition(statement, store))
    } else {
      invariant(redirect.logicalOperator === LogicalOperator.OR, 'Unknown logical operator')
      isPassing = redirect.conditions.some((statement) => evaluateCondition(statement, store))
    }

    if (isPassing) {
      return redirect.link.to
    }
  }
}
