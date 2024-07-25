import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme, tokens } from 'ui'

// **InputSelect styling strategy**
//
// We want whole visible input to be clickable, therefore inner `select` has to have 100% width and height
// Other elements like label and chevron are absolutely positioned on top of it
// Visual centering is achieved by hand-picked paddings for select and `top` for label

const paddingHorizontal = createVar('selectPaddingHorizontal')
const paddingTop = createVar('selectPaddingTop')
const labelTop = createVar('selectLabelTop')
const labelHeight = createVar('selectLabelHeight')

export const wrapperVariants = styleVariants({
  base: {
    position: 'relative',
    width: '100%',
    height: '4rem',
    vars: {
      [paddingHorizontal]: tokens.space.md,
      [paddingTop]: tokens.space.md,
      [labelHeight]: tokens.fontSizes.md,
    },
  },
  small: {
    height: '3.5rem',
    fontSize: theme.fontSizes.md,
  },
  medium: {
    fontSize: theme.fontSizes.md,
    vars: {
      [paddingTop]: '20px',
    },
  },
  large: {
    fontSize: theme.fontSizes.xl,
  },
})

export const wrapperWithLabelVariants = styleVariants({
  small: {
    vars: {
      [labelTop]: '7.5px',
      [paddingTop]: `calc(${labelTop} + ${labelHeight})`,
      [paddingHorizontal]: '14px',
    },
  },
  medium: {
    vars: {
      [labelTop]: tokens.space.sm,
      [paddingTop]: `calc(${labelTop} + ${labelHeight})`,
    },
  },
  large: {
    vars: {
      [labelTop]: '10px',
      [paddingTop]: `calc(${labelTop} + ${labelHeight} - 2px)`,
    },
  },
})

export const inputLabel = style({
  position: 'absolute',
  fontSize: tokens.fontSizes.xs,
  color: tokens.colors.textTranslucentSecondary,
  userSelect: 'none',
  top: labelTop,
  left: paddingHorizontal,
})

export const chevronIcon = style({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
})

export const select = style({
  color: tokens.colors.textPrimary,
  // Truncate if there's not enough space
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  width: '100%',
  height: '100%',

  // Paddings:
  // - no bottom padding to avoid clipping text descenders
  // - right padding increased to avoid overlapping chevron
  paddingTop: paddingTop,
  paddingLeft: paddingHorizontal,
  paddingRight: `calc(${paddingHorizontal} + 1.125rem)`,

  backgroundColor: tokens.colors.translucent1,
  borderRadius: tokens.radius.md,

  cursor: 'pointer',

  selectors: {
    '&:invalid, &:disabled': {
      color: theme.colors.textSecondary,
    },

    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
})

// Hack to target placeholder being selected
// https://stackoverflow.com/questions/55085140/detecting-if-an-option-has-been-selected-in-select-using-css
globalStyle(`${select}:has(option[value=""]:checked)`, {
  color: theme.colors.textSecondary,
})
