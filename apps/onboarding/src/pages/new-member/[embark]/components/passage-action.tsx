import { ClientAction, PassageElement } from 'embark-core'

import { NumberAction } from './number-action'
import { SelectAction } from './select-action'
import { TextAction } from './text-action'
import { TextActionSet } from './text-action-set'

type Props = {
  action: ClientAction
}

export const PassageAction = ({ action }: Props) => {
  switch (action.type) {
    case PassageElement.SelectAction:
      return <SelectAction {...action} />

    case PassageElement.TextAction:
      return <TextAction {...action} />

    case PassageElement.TextActionSet:
      return <TextActionSet {...action} />

    case PassageElement.NumberAction:
      return <NumberAction {...action} />

    default:
      return null
  }
}
