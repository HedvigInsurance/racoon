import { PassageAction, PassageElement } from '@/shared/types'

import { ClientAction } from '../types'

export const convertPassageAction = (action: PassageAction): ClientAction => {
  switch (action.type) {
    case PassageElement.SelectAction:
      return {
        type: PassageElement.SelectAction,
        options: action.options.map((option) => {
          return {
            label: option.link.label,
            value: option.value,
          }
        }),
      }

    case PassageElement.TextAction:
      return action

    case PassageElement.TextActionSet:
      return {
        type: action.type,
        actions: action.actions,
      }

    case PassageElement.NumberAction:
      return action
  }
}
