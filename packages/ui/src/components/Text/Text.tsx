import clsx from 'clsx'
import type { ReactNode, CSSProperties } from 'react'
import type { FontSizeProps } from '../../theme'
import { type Sprinkles, sprinkles } from '../../theme/sprinkles.css'
import {
  balanceTextStyles,
  textBase,
  textFallbackColor,
  textSingleLine,
  textStrikethrough,
  textUppercase,
} from './Text.css'

type TextStyleProps = {
  align?: Sprinkles['textAlign']
  balance?: boolean
  className?: string
  style?: CSSProperties
  color?: Sprinkles['color']
  singleLine?: boolean
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
  balance,
  color,
  singleLine,
  size = 'md',
  strikethrough,
  uppercase,
  className,
}: TextStyleProps) => {
  return clsx(
    textBase,
    // Fix for vanilla-extract bug where base styles color override the color prop
    color ? undefined : textFallbackColor,
    sprinkles({ color, textAlign: align, fontSize: size }),
    singleLine && textSingleLine,
    strikethrough && textStrikethrough,
    uppercase && textUppercase,
    balance && balanceTextStyles,
    className,
  )
}

export const Text = ({
  as,
  balance,
  align,
  color,
  children,
  singleLine,
  size,
  strikethrough,
  uppercase,
  className,
  ...rest
}: TextProps) => {
  const Component = as ?? 'p'
  return (
    <Component
      className={getTextStyles({
        align,
        color,
        singleLine,
        size,
        strikethrough,
        uppercase,
        balance,
        className,
      })}
      {...rest}
    >
      {children}
    </Component>
  )
}
