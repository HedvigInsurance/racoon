import clsx from 'clsx'
import { ReactNode } from 'react'
import Balancer from 'react-wrap-balancer'
import { FontSizeProps } from '../../theme'
import {
  textBase,
  textSprinkles,
  textStrikethrough,
  textUppercase,
  type TextSprinkles,
} from './Text.css'

type TextStyleProps = {
  align?: TextSprinkles['textAlign']
  balance?: boolean
  className?: string
  color?: TextSprinkles['color']
  size?: FontSizeProps
  strikethrough?: boolean
  uppercase?: boolean
}

export type TextProps = {
  as?: 'p' | 'span' | 'div'
  children?: ReactNode
  title?: string
} & TextStyleProps

export const getTextStyles = ({
  align,
  color,
  size = 'md',
  strikethrough,
  uppercase,
  className,
}: TextStyleProps) => {
  return clsx(
    textBase,
    textSprinkles({ color: color, textAlign: align, fontSize: size }),
    strikethrough && textStrikethrough,
    uppercase && textUppercase,
    className,
  )
}

export const Text = ({
  as,
  balance,
  align,
  color,
  children,
  size,
  strikethrough,
  uppercase,
  className,
  ...rest
}: TextProps) => {
  const Component = as ?? 'p'
  return (
    <Component
      className={getTextStyles({ align, color, size, strikethrough, uppercase, className })}
      {...rest}
    >
      {!balance ? children : <Balancer>{children}</Balancer>}
    </Component>
  )
}
