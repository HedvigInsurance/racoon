'use client'
// NOTE: 'use client' prevents the following
// "Warning: Only plain objects can be passed to Client Components from Server Components. Classes or other objects with methods are not supported"
// We're passing down style object with assignInlineVars
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clsx } from 'clsx'
import { forwardRef, type ComponentProps } from 'react'
import { iconRoot, iconSize, iconColor } from './Root.css'

export type IconRootProps = ComponentProps<'svg'> & {
  color?: string
  size?: string
}

export const IconRoot = forwardRef<SVGSVGElement, IconRootProps>(
  ({ className, size, color, ...props }, ref) => (
    <svg
      ref={ref}
      className={clsx(iconRoot, className)}
      style={assignInlineVars({
        [iconSize]: size,
        [iconColor]: color,
      })}
      {...props}
    />
  ),
)
IconRoot.displayName = 'IconRoot'
