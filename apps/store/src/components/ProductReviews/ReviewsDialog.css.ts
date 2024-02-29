import { style, createVar } from '@vanilla-extract/css'
import { theme, minWidth } from 'ui/src/theme'

export const closeBtn = style({
  position: 'absolute',
  top: theme.space.md,
  right: theme.space.md,
  borderRadius: '50%',
  padding: theme.space.xs,
  backgroundColor: theme.colors.translucent1,
  backdropFilter: 'blur(30px)',
  cursor: 'pointer',
  zIndex: 1,

  '@media': {
    [minWidth.md]: {
      top: theme.space.lg,
      right: theme.space.lg,
    },
    '(hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.translucent2,
      },
    },
  },
})

export const dialogContent = style({
  position: 'relative',
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: `min(35.5rem, calc(100% - ${theme.space.xs} * 2))`,
  maxHeight: `min(calc(100% - ${theme.space.md} * 2), 56rem)`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.backgroundStandard,
  boxShadow: theme.shadow.default,
  isolation: 'isolate',
  overflow: 'hidden',

  '@media': {
    [minWidth.md]: {
      maxHeight: `min(calc(100% - ${theme.space.xl} * 2), 56rem)`,
    },
  },
})

const dialogWindowPaddingBlock = createVar()
export const dialogWindow = style({
  vars: {
    '--scrollbar-thumb-color': theme.colors.gray600,
    '--scrollbar-thumb-color-hover': theme.colors.gray300,
    '--scrollbar-track-color': theme.colors.white,
    '--scrollbar-track-width': '8px',
    [dialogWindowPaddingBlock]: theme.space.xxxl,
  },

  paddingInline: theme.space.md,
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

export const reviewComment = style({
  width: '100%',
})

export const latestReviewsLabel = style({
  paddingInline: theme.space.md,
})

export const noReviewsLabel = style({
  paddingInline: theme.space.md,
})
