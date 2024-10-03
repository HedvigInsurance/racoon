import clsx from 'clsx'
import { type PropsWithChildren } from 'react'
import { Card, CheckIcon, xStack } from 'ui'
import { checkItemWrapper, checkItemWrapperChecked } from './CheckItem.css'

type Props = {
  checked?: boolean
}

export function CheckListItem({ checked, children }: PropsWithChildren<Props>) {
  return (
    <Card.Root variant="secondary" size="md">
      <Card.Header className={xStack({ alignItems: 'center' })}>
        <Card.Media>
          <div className={clsx(checkItemWrapper, checked && checkItemWrapperChecked)}>
            <CheckIcon size="1rem" />
          </div>
        </Card.Media>
        <Card.Heading>
          <Card.Title>{children}</Card.Title>
        </Card.Heading>
      </Card.Header>
    </Card.Root>
  )
}
