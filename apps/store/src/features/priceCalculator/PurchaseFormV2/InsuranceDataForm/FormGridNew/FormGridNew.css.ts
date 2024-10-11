import { style, createVar } from '@vanilla-extract/css'
import { responsiveStyles, tokens } from 'ui'
import { CONTENT_MAX_WIDTH } from '../../PurchaseFormV2.css'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: tokens.space.xxs,
})

export const columnSpan = createVar()

export const gridItem = style({
  gridColumn: `span ${columnSpan}`,
})

export const formFooterButton = style({
  width: `min(100%, ${CONTENT_MAX_WIDTH})`,
  marginInline: 'auto',

  ...responsiveStyles({
    lg: {
      width: '100%',
    },
  }),
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
