import { style, createVar } from '@vanilla-extract/css'
import { responsiveStyles, tokens } from 'ui'
import { CONTENT_MAX_WIDTH } from './PurchaseFormV2.css'

// Offset for fixed formFooter
const GRID_PADDING_BOTTOM = '7rem'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: tokens.space.xxs,
  paddingBottom: GRID_PADDING_BOTTOM,

  ...responsiveStyles({
    lg: {
      paddingBottom: 0,
    },
  }),
})

export const columnSpan = createVar()

export const gridItem = style({
  gridColumn: `span ${columnSpan}`,
})

export const submitButton = style({
  width: `min(100%, ${CONTENT_MAX_WIDTH})`,
  marginInline: 'auto',
})

export const formFooter = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  width: '100vw',
  paddingTop: tokens.space.md,
  paddingBottom: tokens.space.xl,
  paddingInline: tokens.space.md,
  backdropFilter: 'blur(50px)',

  ...responsiveStyles({
    lg: {
      position: 'unset',
      gridColumn: 'span 6',
      width: 'auto',
      padding: 0,
      backdropFilter: 'unset',
    },
  }),
})
