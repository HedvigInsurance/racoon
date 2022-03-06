import { Button } from 'ui'
import type { ClientTextActionSet } from 'embark-core'
import { TextAction } from './text-action'

export const TextActionSet = ({ actions }: ClientTextActionSet) => {
  return (
    <>
      {actions.map(({ key, ...action }) => (
        <TextAction key={key} name={key} singleAction={false} {...action} />
      ))}

      <Button>Continue</Button>
    </>
  )
}
