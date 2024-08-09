import { style, createVar } from '@vanilla-extract/css'
import { tokens, hoverStyles } from 'ui'
import { zIndexes } from '@/utils/zIndex'

const inlinePadding = createVar('inputLateralPadding')
export const wrapper = style({
  position: 'relative',
  isolation: 'isolate',
  selectors: {
    '&[data-expanded=true]': {
      zIndex: zIndexes.header,
      boxShadow: tokens.shadow.default,
      borderTopLeftRadius: tokens.radius.sm,
      borderTopRightRadius: tokens.radius.sm,
    },
    '&[data-size=small]': {
      vars: {
        [inlinePadding]: '0.875rem',
      },
      fontSize: tokens.fontSizes.md,
    },
    '&[data-size=medium]': {
      vars: {
        [inlinePadding]: tokens.space.md,
      },
      fontSize: tokens.fontSizes.md,
    },
    '&[data-size=large]': {
      vars: {
        [inlinePadding]: tokens.space.md,
      },
      fontSize: tokens.fontSizes.xl,
    },
  },
})

export const inputWrapper = style({ position: 'relative' })

export const inputBackground = style({
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
  selectors: {
    ':has([data-expanded=true]) &': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    ':has([data-warning=true]) &': {
      borderBottomLeftRadius: tokens.radius.sm,
      borderBottomRightRadius: tokens.radius.sm,
    },
  },
})

export const input = style({
  width: '100%',
  paddingLeft: inlinePadding,
  paddingRight: tokens.space.xxxl,
  color: tokens.colors.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  selectors: {
    ':has([data-size=small]) &': {
      height: '3rem',
    },
    ':has([data-size=medium]) &': {
      height: '4rem',
    },
    ':has([data-size=large]) &': {
      height: '4rem',
    },
  },
})

export const actionsWrapper = style({
  position: 'absolute',
  right: inlinePadding,
  top: '50%',
  display: 'flex',
  gap: tokens.space.xs,
  alignItems: 'center',
  transform: 'translateY(-50%)',
})

export const toggleButton = style({
  cursor: 'pointer',
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',
  selectors: {
    '&[aria-expanded=true]': {
      transform: 'rotate(180deg)',
    },
    ':has([data-warning=true]) &': {
      transform: 'rotate(0)',
    },
  },
})

export const deleteButton = style({
  cursor: 'pointer',
})

export const separator = style({
  height: 1,
  backgroundColor: tokens.colors.opaque2,
  marginInline: tokens.space.md,
})

export const list = style({
  position: 'absolute',
  width: '100%',
  borderBottomLeftRadius: tokens.radius.sm,
  borderBottomRightRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.opaque1,
  boxShadow: tokens.shadow.default,
})

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: '2.5rem',
  paddingInline: tokens.space.md,
  paddingBlock: tokens.space.xs,
  ...hoverStyles({ backgroundColor: tokens.colors.gray300 }),
  ':last-of-type': {
    borderBottomLeftRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
  selectors: {
    '&[data-highlighted=true]': {
      backgroundColor: tokens.colors.gray200,
    },
  },
})
