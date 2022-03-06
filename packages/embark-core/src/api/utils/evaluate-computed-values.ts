import { ComputedValue, NumberOperator } from '@/shared/types'

import { Store } from '../types'
import invariant from 'tiny-invariant'

type EvaluateComputedValuesParams = {
  store: Store
  values: Array<ComputedValue>
}

const computeValue = (left: number, operator: NumberOperator, right: number): number => {
  switch (operator) {
    case NumberOperator.Add:
      return left + right
    case NumberOperator.Subtract:
      return left - right
  }
}

export const evaluateComputedValues = ({ store, values }: EvaluateComputedValuesParams): Store => {
  return values.reduce<Store>((prev, value) => {
    const storeValue = store[value.expression.key]

    if (storeValue === undefined) {
      console.warn(`Could not find value for computed value ${value.expression.key}`)
      return prev
    }

    invariant(
      typeof storeValue === 'number',
      `Invalid computed value: ${value.expression.key} -> ${storeValue}`,
    )
    const expressionValue = value.expression.value

    return {
      ...prev,
      [value.key]: computeValue(storeValue, value.expression.operator, expressionValue),
    }
  }, {})
}
