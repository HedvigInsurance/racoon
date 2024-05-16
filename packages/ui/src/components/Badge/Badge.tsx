import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clsx } from 'clsx'
import { getColor, type UIColors } from '../../theme'
import { badge, badgeBgColorVar } from './Badge.css'

type BadgeColors = Pick<
  UIColors,
  | 'blueFill1'
  | 'blueFill2'
  | 'blueFill3'
  | 'green50'
  | 'signalAmberHighlight'
  | 'signalGreenFill'
  | 'pinkFill1'
>

export type BadgeProps = {
  children: React.ReactNode
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  className?: string
  color?: keyof BadgeColors
  size?: 'small' | 'big' | 'responsive'
}

export const Badge = ({ as, className, children, color, size = 'small', ...rest }: BadgeProps) => {
  const Component = as ?? 'div'

  return (
    <Component
      className={clsx(badge({ size }), className)}
      style={assignInlineVars({
        [badgeBgColorVar]: getColor(color ?? 'blueFill1'),
      })}
      {...rest}
    >
      {children}
    </Component>
  )
}
