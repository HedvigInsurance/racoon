import { Button } from 'ui'
import type { ClientTextActionSet } from 'embark-core'
import { TextAction } from './text-action'

export const TextActionSet = ({ actions }: ClientTextActionSet) => {
  return (
    <>
      {actions.map(({ key, ...action }, index) => (
        <TextAction
          key={key}
          name={key}
          singleAction={false}
          autoFocus={index === 0}
          required={true}
          {...action}
        />
      ))}

      <Button>Continue</Button>
    </>
  )
}
