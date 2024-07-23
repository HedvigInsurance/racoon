import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

const BUTTON_HEIGHT = '3.25rem'

const dialogHeaderHeight = createVar()

export const dialogContent = style({
  vars: {
    [dialogHeaderHeight]: '3.5rem',
  },
  height: '100%',
  overflowY: 'auto',
  isolation: 'isolate',

  '@media': {
    [minWidth.lg]: {
      vars: {
        [dialogHeaderHeight]: '4.5rem',
      },
    },
  },
})

export const dialogHeaderWrapper = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,

  display: 'flex',
  alignItems: 'center',
  height: dialogHeaderHeight,
  paddingInline: tokens.space.md,
  zIndex: 1,

  '@media': {
    [minWidth.lg]: {
      paddingInline: tokens.space.xl,
    },
  },
})

export const dialogCloseIcon = style({
  cursor: 'pointer',
  // Align the icon to the right
  marginLeft: 'auto',
})

const dialogMainBase = style({
  display: 'flex',
  flexDirection: 'column',
})
export const dialogMain = styleVariants({
  regular: [
    dialogMainBase,
    {
      paddingTop: dialogHeaderHeight,
      paddingBottom: `calc(${BUTTON_HEIGHT} + ${tokens.space.md} * 2)`,
      '@media': {
        [minWidth.lg]: {
          paddingBottom: `calc(${BUTTON_HEIGHT} + ${tokens.space.xxl} * 2)`,
        },
      },
    },
  ],
  centered: [
    dialogMainBase,
    {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingInline: tokens.space.md,
    },
  ],
})

export const dialogFooterWrapper = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,

  display: 'grid',
  gridTemplateColumns: 'minmax(0, 24rem)',
  justifyContent: 'center',
  gap: tokens.space.xxs,
  paddingInline: tokens.space.md,
  paddingBottom: tokens.space.md,

  '@media': {
    [minWidth.lg]: {
      paddingBottom: tokens.space.xxl,
    },
  },
})
