import { style, createVar, styleVariants } from '@vanilla-extract/css'

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

export const rotateIcon = styleVariants({
  left: { transform: 'rotate(90deg)' },
  right: { transform: 'rotate(-90deg)' },
  up: { transform: 'scaleY(-1)' },
  down: { transform: 'scaleY(1)' },
})
