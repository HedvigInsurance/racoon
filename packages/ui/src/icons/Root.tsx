'use client'
// NOTE: 'use client' prevents the following
// "Warning: Only plain objects can be passed to Client Components from Server Components. Classes or other objects with methods are not supported"
// We're passing down style object with assignInlineVars
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clsx } from 'clsx'
import { forwardRef, type ComponentProps } from 'react'
import { iconRoot, iconSize, iconColor, rotateIcon } from './Root.css'

export type IconRootProps = ComponentProps<'svg'> & {
  color?: string
  size?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const IconRoot = forwardRef<SVGSVGElement, IconRootProps>(
  ({ className, size, color, direction, ...props }, ref) => (
    <svg
      ref={ref}
      className={clsx(iconRoot, direction && rotateIcon[direction], className)}
      style={assignInlineVars({
        [iconSize]: size,
        [iconColor]: color,
      })}
      {...props}
    />
  ),
)
IconRoot.displayName = 'IconRoot'
