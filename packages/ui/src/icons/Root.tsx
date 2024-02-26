import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clsx } from 'clsx'
import { ComponentPropsWithoutRef } from 'react'
import { iconRoot, iconSize, iconColor } from './Root.css'

export type IconRootProps = ComponentPropsWithoutRef<'svg'> & {
  color?: string
  size?: string
}

export const IconRoot = ({ className, size, color, ...props }: IconRootProps) => (
  <svg
    className={clsx(iconRoot, className)}
    style={assignInlineVars({
      [iconSize]: size,
      [iconColor]: color,
    })}
    {...props}
  />
)
