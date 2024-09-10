import { style, keyframes, styleVariants } from '@vanilla-extract/css'
import { tokens, xStack } from 'ui'

export const SMALL_HEIGHT = '3.5rem'
export const MEDIUM_HEIGHT = '4rem'
export const LARGE_HEIGHT = '4rem'

const warningAnimation = keyframes({
  '0%': {
    backgroundColor: tokens.colors.signalAmberFill,
    color: tokens.colors.signalAmberText,
  },
  '100%': {
    backgroundColor: tokens.colors.gray100,
    color: tokens.colors.textPrimary,
  },
})

const warningColorAnimation = keyframes({
  '0%': {
    color: tokens.colors.signalAmberText,
  },
  '100%': {
    color: tokens.colors.textSecondary,
  },
})

export const baseWrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
  width: '100%',
  cursor: 'text',

  selectors: {
    '&[data-hidden=true]': {
      display: 'none',
    },

    '&[data-warning=true]': {
      animation: `${warningAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 1`,
    },

    '&:focus-within': {
      outline: `solid 1px ${tokens.colors.borderFocusedInput}`,
    },
  },
})

export const wrapper = styleVariants({
  small: [baseWrapper, { height: SMALL_HEIGHT }],
  medium: [baseWrapper, { height: MEDIUM_HEIGHT }],
  large: [baseWrapper, { height: LARGE_HEIGHT }],
})

export const baseLabel = style({
  position: 'absolute',
  left: 0,
  right: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: tokens.colors.textSecondary,

  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  transform: 'translate(0, 0) scale(1)',
  marginInline: tokens.space.md,

  selectors: {
    '&&[data-disabled=true]': {
      color: tokens.colors.textTertiary,
    },

    [`${baseWrapper}[data-warning=true] > &`]: {
      animation: `${warningColorAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 1`,
    },
  },
})

// Transform logic
// - `scale` is calculated to make small label have desired font size.
//   Unfortunately, we cannot refer to our tokens since we need unitless values for calc
// - `translateY` is matched manually to sync final look with figma
export const inputLabel = styleVariants({
  small: [
    baseLabel,
    {
      fontSize: tokens.fontSizes.md,
      selectors: {
        [`${baseWrapper}:focus-within > &, ${baseWrapper}[data-active=true] > &`]: {
          transform: `translateY(-10px) scale(${14 / 18})`,
        },
      },
    },
  ],
  medium: [
    baseLabel,
    {
      fontSize: tokens.fontSizes.md,
      selectors: {
        [`${baseWrapper}:focus-within > &, ${baseWrapper}[data-active=true] > &`]: {
          transform: `translateY(-10px) scale(${14 / 18})`,
        },
      },
    },
  ],
  large: [
    baseLabel,
    {
      fontSize: tokens.fontSizes.xl,
      selectors: {
        [`${baseWrapper}:focus-within > &, ${baseWrapper}[data-active=true] > &`]: {
          overflow: 'visible',
          transform: `translateY(-9px) scale(${14 / 24})`,
        },
      },
    },
  ],
})

export const inputWrapper = style([
  xStack({ alignItems: 'center', gap: 'xs', paddingRight: 'md' }),
  {
    width: '100%',
  },
])

export const baseInput = style({
  width: '100%',
  paddingLeft: tokens.space.md,
  paddingTop: tokens.space.md,

  selectors: {
    ['&:disabled, &:read-only']: {
      color: tokens.colors.textSecondary,

      // Webkit overrides
      WebkitTextFillColor: tokens.colors.textSecondary,
      opacity: 1,
    },

    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
})

export const upperCaseInputStyle = style({
  textTransform: 'uppercase',
})

export const input = styleVariants({
  small: [baseInput, { fontSize: tokens.fontSizes.lg }],
  medium: [baseInput, { fontSize: tokens.fontSizes.md }],
  large: [baseInput, { fontSize: tokens.fontSizes.xl }],
})

export const deleteButton = style({
  cursor: 'pointer',
  opacity: 0,

  selectors: {
    '&:focus-visible': {
      boxShadow: tokens.shadow.focus,
    },

    [`${baseWrapper}:focus-within &, ${baseWrapper}[data-readonly] &`]: {
      opacity: 1,
    },
  },
})
