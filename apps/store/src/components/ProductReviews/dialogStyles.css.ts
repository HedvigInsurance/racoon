import { style, createVar } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

export const dialogContent = style({
  position: 'relative',
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: `min(35.5rem, calc(100% - ${tokens.space.xs} * 2))`,
  maxHeight: `min(calc(100% - ${tokens.space.md} * 2), 56rem)`,
  borderRadius: tokens.radius.lg,
  backgroundColor: tokens.colors.backgroundStandard,
  boxShadow: tokens.shadow.default,
  isolation: 'isolate',
  overflow: 'hidden',

  '@media': {
    [minWidth.md]: {
      maxHeight: `min(calc(100% - ${tokens.space.xl} * 2), 56rem)`,
    },
  },
})

export const dialogCloseBtn = style({
  position: 'absolute',
  top: tokens.space.md,
  right: tokens.space.md,
  borderRadius: '50%',
  padding: tokens.space.xs,
  backgroundColor: tokens.colors.translucent1,
  backdropFilter: 'blur(30px)',
  cursor: 'pointer',
  zIndex: 1,

  '@media': {
    [minWidth.md]: {
      top: tokens.space.lg,
      right: tokens.space.lg,
    },
    '(hover: hover)': {
      ':hover': {
        backgroundColor: tokens.colors.translucent2,
      },
    },
  },
})

const dialogWindowPaddingBlock = createVar()
export const dialogWindow = style({
  vars: {
    '--scrollbar-thumb-color': tokens.colors.gray600,
    '--scrollbar-thumb-color-hover': tokens.colors.gray300,
    '--scrollbar-track-color': tokens.colors.white,
    '--scrollbar-track-width': '8px',
    [dialogWindowPaddingBlock]: tokens.space.xxxl,
  },

  paddingInline: tokens.space.md,
  paddingBlock: dialogWindowPaddingBlock,
  overflowY: 'auto',

  '@media': {
    [minWidth.sm]: {
      // Firefox
      scrollbarColor: 'var(--scrollbar-thumb-color) var(--scrollbar-track-color)',
      scrollbarWidth: 'thin',

      // Webkit based browsers
      selectors: {
        '&::-webkit-scrollbar': {
          width: 'var(--scrollbar-track-width)',
          height: 'var(--scrollbar-track-width)',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '1000px',
          backgroundColor: 'var(--scrollbar-thumb-color)',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'var(--scrollbar-thumb-color-hover)',
        },
      },
    },
    [minWidth.md]: {
      paddingInline: dialogWindowPaddingBlock,
    },
  },
})
