import { ClientAction, PassageElement } from 'embark-core'
import { GraphQLAction } from './GraphQLAction'
import { NumberAction } from './NumberAction'
import { SelectAction } from './SelectAction'
import { TextAction } from './TextAction'
import { TextActionSet } from './TextActionSet'

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

    case PassageElement.GraphQLAPI:
      return <GraphQLAction />

    default:
      return null
  }
}
