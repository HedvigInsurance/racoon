import { createVar, style } from '@vanilla-extract/css'
import { fonts } from '@hedviginsurance/brand'
import { theme } from '../theme'

export const minHeight = createVar()
export const paddingBlock = createVar()
export const paddingInline = createVar()
export const borderWidth = createVar()
export const borderRadius = createVar()
export const fontSize = createVar()
export const fontSizeRaisedLabel = createVar()
export const backgroundColor = createVar()

export const rootBase = style({
  vars: {
    [minHeight]: '56px',
    [paddingBlock]: '10px',
    [paddingInline]: '16px',
    [borderWidth]: '0.5px',
    [borderRadius]: '10px',
    [fontSize]: '16px',
    [fontSizeRaisedLabel]: '12px',
    [backgroundColor]: theme.colors.opaque1,
  },
  position: 'relative',
  fontSize,
  minHeight,
  backgroundColor,
  color: theme.colors.textSecondary,
  borderRadius,
  border: `0.5px solid ${theme.colors.borderTranslucent2}`,

  ':focus-within': {
    borderColor: theme.colors.textSecondary,
  },
})

export const rootDisabled = style({
  pointerEvents: 'none',
  backgroundColor: theme.colors.opaque2,
  cursor: 'default',
})

export const rootOpen = style({
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
})

export const trigger = style({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight,
  paddingBlock,
  paddingInline,
})

export const triggerWithValue = style({
  alignItems: 'end',
})

export const label = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  transition:
    'top 150ms cubic-bezier(1, 0, 0, 1), transform 150ms cubic-bezier(1, 0, 0, 1), font-size 150ms cubic-bezier(1, 0, 0, 1)',
})

export const raisedLabel = style({
  top: paddingBlock,
  fontSize: fontSizeRaisedLabel,
  transform: 'translateY(0)',
})

export const content = style({
  gap: theme.space.xs,
  width: '100%',
  color: theme.colors.textPrimary,
})

export const value = style({
  width: '100%',
  fontFamily: fonts.HEDVIG_LETTERS_STANDARD,
})

export const input = style({
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
})

export const sideContent = style({
  marginInlineStart: 'auto',
})
