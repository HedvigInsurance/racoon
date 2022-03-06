import { SelectAction } from '@/shared/types'
import { Store } from '../types'
import invariant from 'tiny-invariant'

type Params = {
  action: SelectAction
  store: Store
}

export const getSelectActionLink = ({ action, store }: Params) => {
  const selectedOption = action.options.find((option) => option.value === store[option.key])
  invariant(selectedOption !== undefined, () => {
    const options = action.options.map((option) => option.value).join(', ')
    return `Could not find selected option ${options} in store: ${JSON.stringify(store, null, 2)}`
  })
  return selectedOption.link.to
}
