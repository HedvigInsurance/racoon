import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clsx } from 'clsx'
import type { PropsWithChildren, CSSProperties } from 'react'
import { getColor, type UIColors } from '../../theme'
import { badge, badgeBgColor } from './Badge.css'

type BadgeColors = Pick<
  UIColors,
  | 'blueFill1'
  | 'blueFill2'
  | 'blueFill3'
  | 'green50'
  | 'gray200'
  | 'translucent1'
  | 'signalAmberHighlight'
  | 'signalGreenFill'
  | 'pinkFill1'
  | 'pinkFill3'
>

export type BadgeProps = {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'
  className?: string
  color?: keyof BadgeColors
  size?: 'tiny' | 'xsmall' | 'small' | 'big' | 'responsive'
  style?: CSSProperties
}

export function Badge({
  as = 'div',
  className,
  color = 'blueFill1',
  size = 'small',
  style,
  children,
}: PropsWithChildren<BadgeProps>) {
  const Component = as

  return (
    <Component
      className={clsx(badge({ size }), className)}
      style={{
        ...assignInlineVars({
          [badgeBgColor]: getColor(color),
        }),
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
