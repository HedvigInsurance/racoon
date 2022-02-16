import { ActionInput, Store } from '../types'

import { NumberAction } from '@/shared/types'
import invariant from 'tiny-invariant'

type Params = {
  action: NumberAction
  input: ActionInput
}

export const parseNumberActionInput = ({ action, input }: Params): Store => {
  invariant(typeof input.data.value === 'string')
  const value = parseFloat(input.data.value)
  invariant(!isNaN(value), 'Could not parse number value: ' + input.data.value)

  return {
    [action.key]: value,
  }
}
