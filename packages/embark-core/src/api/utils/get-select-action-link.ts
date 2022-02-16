import { SelectAction } from '@/shared/types'
import { Store } from '../types'
import invariant from 'tiny-invariant'

type Params = {
  action: SelectAction
  store: Store
}

export const getSelectActionLink = ({ action, store }: Params) => {
  const selectedOption = action.options.find((option) => option.value === store[option.key])
  invariant(selectedOption !== undefined, 'Could not find selected option')
  return selectedOption.link.to
}
