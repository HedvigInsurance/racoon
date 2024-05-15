import { style, createVar } from '@vanilla-extract/css'
import { themeVars, minWidth } from 'ui/src/theme'

export const dialogContent = style({
  position: 'relative',
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: `min(35.5rem, calc(100% - ${themeVars.space.xs} * 2))`,
  maxHeight: `min(calc(100% - ${themeVars.space.md} * 2), 56rem)`,
  borderRadius: themeVars.radius.lg,
  backgroundColor: themeVars.colors.backgroundStandard,
  boxShadow: themeVars.shadow.default,
  isolation: 'isolate',
  overflow: 'hidden',

  '@media': {
    [minWidth.md]: {
      maxHeight: `min(calc(100% - ${themeVars.space.xl} * 2), 56rem)`,
    },
  },
})

export const dialogCloseBtn = style({
  position: 'absolute',
  top: themeVars.space.md,
  right: themeVars.space.md,
  borderRadius: '50%',
  padding: themeVars.space.xs,
  backgroundColor: themeVars.colors.translucent1,
  backdropFilter: 'blur(30px)',
  cursor: 'pointer',
  zIndex: 1,

  '@media': {
    [minWidth.md]: {
      top: themeVars.space.lg,
      right: themeVars.space.lg,
    },
    '(hover: hover)': {
      ':hover': {
        backgroundColor: themeVars.colors.translucent2,
      },
    },
  },
})

const dialogWindowPaddingBlock = createVar()
export const dialogWindow = style({
  vars: {
    '--scrollbar-thumb-color': themeVars.colors.gray600,
    '--scrollbar-thumb-color-hover': themeVars.colors.gray300,
    '--scrollbar-track-color': themeVars.colors.white,
    '--scrollbar-track-width': '8px',
    [dialogWindowPaddingBlock]: themeVars.space.xxxl,
  },

  paddingInline: themeVars.space.md,
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
