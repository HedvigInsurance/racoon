import { ActionInput, Store } from '../types'

import { TextAction } from '@/shared/types'
import invariant from 'tiny-invariant'

type Params = {
  action: TextAction
  input: ActionInput
}

export const parseTextActionInput = ({ action, input }: Params): Store => {
  invariant(typeof input.data.value === 'string')

  return {
    [action.key]: input.data.value,
  }
}
