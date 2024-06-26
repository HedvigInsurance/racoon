import { style, createVar } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: tokens.space.xxs,
})

export const columnSpan = createVar()

export const gridItem = style({
  gridColumn: `span ${columnSpan}`,
})
