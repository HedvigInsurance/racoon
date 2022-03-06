import { ComputedValue, NumberOperator } from '@/shared/types'

import { JSONComputedValue } from '../types'
import invariant from 'tiny-invariant'

const parseNumberOperator = (rawStatement: string): NumberOperator => {
  if (rawStatement.includes(NumberOperator.Add)) return NumberOperator.Add
  if (rawStatement.includes(NumberOperator.Subtract)) return NumberOperator.Subtract

  throw new Error(`Invalid number operator: ${rawStatement}`)
}

const parseComputedValue = (rawValue: JSONComputedValue): ComputedValue => {
  const operator = parseNumberOperator(rawValue.value)

  const [key, rawExpressionValue] = rawValue.value.split(operator).map((string) => string.trim())
  const value = parseInt(rawExpressionValue, 10)
  invariant(!isNaN(value), `Invalid computed value: ${rawValue.value}`)

  return {
    key: rawValue.key,
    expression: { key, operator, value },
  }
}

export const parseComputedValues = (rawValues: Array<JSONComputedValue>): Array<ComputedValue> => {
  return rawValues.map(parseComputedValue)
}
