import { ActionInput, Store } from '../types'

import { SelectAction } from '@/shared/types'
import invariant from 'tiny-invariant'

type Params = {
  action: SelectAction
  input: ActionInput
}

export const parseSelectActionInput = ({ action, input }: Params): Store => {
  invariant(typeof input.data.value === 'string')

  const selectedOption = action.options.find((option) => option.value === input.data.value)
  invariant(selectedOption !== undefined, 'Could not find option with value: ' + input.data.value)

  return {
    [selectedOption.key]: selectedOption.value,
  }
}
