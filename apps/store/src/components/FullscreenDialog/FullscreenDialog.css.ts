import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'

const HEADER_HEIGHT = '3.5rem'
const BUTTON_HEIGHT = '3.25rem'

export const dialogContent = style({
  height: '100%',
  overflowY: 'auto',
  isolation: 'isolate',
})

export const dialogHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingInline: theme.space.md,
  height: HEADER_HEIGHT,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,

  '@media': {
    [minWidth.lg]: {
      paddingInline: theme.space.xl,
    },
  },
})

export const dialogCloseIcon = style({
  cursor: 'pointer',
})

const dialogMainBase = style({
  display: 'flex',
  flexDirection: 'column',
})
export const dialogMain = styleVariants({
  regular: [
    dialogMainBase,
    {
      paddingTop: HEADER_HEIGHT,
      paddingBottom: `calc(${BUTTON_HEIGHT} + ${theme.space.md} * 2)`,
      '@media': {
        [minWidth.lg]: {
          paddingBottom: `calc(${BUTTON_HEIGHT} + ${theme.space.xxl} * 2)`,
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
      paddingInline: theme.space.md,
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
  gap: theme.space.xxs,
  paddingInline: theme.space.md,
  paddingBottom: theme.space.md,

  '@media': {
    [minWidth.lg]: {
      paddingBottom: theme.space.xxl,
    },
  },
})
