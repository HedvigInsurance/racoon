import { PassageAction, PassageElement } from '@/shared/types'

import { Store } from '../types'
import { getSelectActionLink } from './get-select-action-link'

type Params = {
  action: PassageAction
  store: Store
}

export const getActionLink = ({ action, store }: Params) => {
  switch (action.type) {
    case PassageElement.SelectAction:
      return getSelectActionLink({ action, store })

    case PassageElement.TextAction:
    case PassageElement.TextActionSet:
    case PassageElement.NumberAction:
    case PassageElement.GraphQLAPI:
      return action.link.to
  }
}
