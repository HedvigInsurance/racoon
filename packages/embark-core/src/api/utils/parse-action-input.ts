import { ActionInput, Store } from '../types'
import { PassageAction, PassageElement } from '@/shared/types'

import { parseNumberActionInput } from './parse-number-action-input'
import { parseSelectActionInput } from './parse-select-action-input'
import { parseTextActionInput } from './parse-text-action-input'
import { parseTextActionSetInput } from './parse-text-action-set-input'

type Params = {
  action: PassageAction
  input: ActionInput
}

export const parseActionInput = ({ action, input }: Params): Store => {
  switch (action.type) {
    case PassageElement.SelectAction:
      return parseSelectActionInput({ action, input })

    case PassageElement.TextAction:
      return parseTextActionInput({ action, input })

    case PassageElement.TextActionSet:
      return parseTextActionSetInput({ action, input })

    case PassageElement.NumberAction:
      return parseNumberActionInput({ action, input })
  }
}
