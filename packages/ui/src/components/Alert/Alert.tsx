import clsx from 'clsx'
import type { ComponentProps, ElementType } from 'react'
import type { IconRootProps } from '../../icons'
import type { ButtonProps } from '../Button/Button'
import { Button } from '../Button/Button'
import { Text } from '../Text/Text'
import {
  rootStyles,
  iconStyles,
  bodyStyles,
  actionsContainerStyles,
  actionStyles,
  messageStyles,
} from './Alert.css'

type RootProps = {
  variant?: 'info' | 'warning' | 'error' | 'success'
} & ComponentProps<'div'>
function Root({ children, className, variant, ...props }: RootProps) {
  return (
    <div className={clsx(rootStyles({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

type IconProps = {
  icon: ElementType<IconRootProps>
}

function Icon({ icon }: IconProps) {
  const IconComponent = icon
  return <IconComponent size="1rem" className={iconStyles} />
}

type BodyProps = ComponentProps<'div'>

function Body({ children, className, ...props }: BodyProps) {
  return (
    <div className={clsx(bodyStyles, className)} {...props}>
      {children}
    </div>
  )
}

type MessageProps = ComponentProps<typeof Text>

function Message({ children, className, ...props }: MessageProps) {
  return (
    <Text className={clsx(messageStyles, className)} size="sm" {...props}>
      {children}
    </Text>
  )
}

type ActionsProps = ComponentProps<'div'>

function Actions({ children, className, ...props }: ActionsProps) {
  return (
    <div className={clsx(actionsContainerStyles, className)} {...props}>
      {children}
    </div>
  )
}

type ActionProps = ButtonProps<'button'>

function Action({ children, className, ...props }: ActionProps) {
  return (
    <Button
      size="medium"
      variant="secondary-alt"
      className={clsx(actionStyles, className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export const Alert = {
  Root,
  Icon,
  Body,
  Message,
  Actions,
  Action,
}
