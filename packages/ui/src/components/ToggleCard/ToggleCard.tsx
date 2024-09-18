import clsx from 'clsx'
import { type ReactNode, type ComponentProps } from 'react'
import { xStack } from '../../patterns'
import { Card } from '../Card/Card'
import { Switch } from '../Switch/Switch'
import { Text } from '../Text/Text'
import { toggleCardSwitchStyles } from './ToggleCard.css'

type RootProps = ComponentProps<typeof Card.Root>

const ToggleRoot = ({ children, ...props }: RootProps) => {
  return (
    <Card.Root variant="secondary" size="md" {...props}>
      {children}
    </Card.Root>
  )
}

type ToggleSwitchProps = ComponentProps<typeof Switch>
const ToggleSwitch = (props: ToggleSwitchProps) => {
  return (
    <Card.Aside>
      <Switch className={toggleCardSwitchStyles} {...props} />
    </Card.Aside>
  )
}

type ToggleLabelProps = ComponentProps<'label'> & {
  pre?: ReactNode
}
const ToggleLabel = ({ pre, children, className, ...props }: ToggleLabelProps) => {
  return (
    <label className={clsx(xStack({ gap: 'xxs', alignItems: 'center' }), className)} {...props}>
      {pre}
      <Text size="md" as="span">
        {children}
      </Text>
    </label>
  )
}

type ToggleDescriptionProps = ComponentProps<typeof Text>
const ToggleDescription = ({ children, ...props }: ToggleDescriptionProps) => {
  return (
    <Text size="xs" color="textTranslucentSecondary" {...props}>
      {children}
    </Text>
  )
}

export const ToggleCard = {
  Root: ToggleRoot,
  Switch: ToggleSwitch,
  Label: ToggleLabel,
  Description: ToggleDescription,
}
