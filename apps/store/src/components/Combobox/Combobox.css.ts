import { style } from '@vanilla-extract/css'
import { tokens, hoverStyles } from 'ui'
import { zIndexes } from '@/utils/zIndex'

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
  },
})

export const inputWrapper = style({ position: 'relative' })

export const inputBackground = style({
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
  selectors: {
    '&[data-expanded=true]': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    '&[data-warning=true]': {
      borderBottomLeftRadius: tokens.radius.sm,
      borderBottomRightRadius: tokens.radius.sm,
    },
  },
})

export const input = style({
  width: '100%',
  height: '2.5rem',
  paddingLeft: tokens.space.md,
  paddingRight: tokens.space.xxxl,
  color: tokens.colors.textPrimary,
  fontSize: tokens.fontSizes.lg,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  selectors: {
    '&[data-size=large]': {
      height: '3rem',
      fontSize: tokens.fontSizes.xl,
    },
  },
})

export const actionsWrapper = style({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
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

    '&[data-warning=true]': {
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
  minHeight: '2.5rem',
  fontSize: tokens.fontSizes.lg,
  display: 'flex',
  alignItems: 'center',
  paddingInline: tokens.space.md,
  paddingBlock: tokens.space.xs,
  ...hoverStyles({ backgroundColor: tokens.colors.gray300 }),
  ':last-of-type': {
    borderBottomLeftRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
  selectors: {
    '&[data-size=large]': {
      minHeight: '3rem',
      fontSize: tokens.fontSizes.xl,
    },

    '&[data-highlighted=true]': {
      backgroundColor: tokens.colors.gray200,
    },
  },
})
