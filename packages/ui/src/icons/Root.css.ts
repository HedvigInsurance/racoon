import { style, createVar } from '@vanilla-extract/css'

export const iconSize = createVar()
export const iconColor = createVar()
export const iconRoot = style({
  vars: {
    [iconSize]: '1rem',
    [iconColor]: 'currentColor',
  },
  width: iconSize,
  height: iconSize,
  fill: iconColor,
})
