import { ActionInput, Store } from '../types'

import { TextActionSet } from '@/shared/types'
import invariant from 'tiny-invariant'

type Params = {
  action: TextActionSet
  input: ActionInput
}

export const parseTextActionSetInput = ({ action, input }: Params): Store => {
  return action.actions.reduce<Store>((acc, action) => {
    const value = input.data[action.key]
    invariant(typeof value === 'string')
    acc[action.key] = value
    return acc
  }, {})
}
