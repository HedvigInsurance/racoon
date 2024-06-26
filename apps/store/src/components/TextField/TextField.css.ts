import { style, keyframes, styleVariants } from '@vanilla-extract/css'
import { tokens, xStack } from 'ui'

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
  },
})

export const wrapper = styleVariants({
  small: [baseWrapper, { height: '3.5rem' }],
  large: [baseWrapper, { height: '4.5rem' }],
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
  paddingInline: tokens.space.md,

  selectors: {
    '&&[data-disabled=true]': {
      color: tokens.colors.textTertiary,
    },

    [`${baseWrapper}[data-warning=true] > &`]: {
      animation: `${warningColorAnimation} 1.5s cubic-bezier(0.2, -2, 0.8, 2) 1`,
    },
  },
})

export const inputLabel = styleVariants({
  small: [
    baseLabel,
    {
      fontSize: tokens.fontSizes.lg,
      selectors: {
        [`${baseWrapper}:focus-within > &, ${baseWrapper}[data-active=true] > &`]: {
          transform: `translate(calc(${tokens.space.md} * 0.2), -0.6rem) scale(0.8)`,
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
          transform: `translate(calc(${tokens.space.md} * 0.4), -0.6rem) scale(0.6)`,
        },
      },
    },
  ],
})

export const baseInputWrapper = style([
  {
    position: 'absolute',
    width: '100%',
  },
  xStack({ alignItems: 'center', gap: 'xs', paddingRight: 'md' }),
])

export const inputWrapper = styleVariants({
  small: [baseInputWrapper, { bottom: '0.3125rem' }],
  large: [baseInputWrapper, { bottom: '0.625rem' }],
})

export const baseInput = style({
  width: '100%',
  paddingLeft: tokens.space.md,

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
  large: [baseInput, { fontSize: tokens.fontSizes.xl }],
})

export const messageWithIcon = xStack({
  alignItems: 'center',
  gap: 'xs',
  paddingLeft: 'xxs',
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
