import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from '../theme'

export const wrapper = style({
  position: 'relative',
})

export const menu = styleVariants({
  base: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'initial',

    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.offWhite,
    boxShadow: theme.shadow.default,

    padding: theme.space.md,
    minWidth: '200px',
    width: 'max-content',

    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility 200ms, opacity 200ms',
  },
  visible: {
    visibility: 'visible',
    opacity: 1,
  },
})

export const menuPosition = styleVariants({
  top: {
    bottom: '100%',
    marginBottom: theme.space.xs,
    left: '50%',
    translate: '-50% 0',
  },
  topRight: {
    bottom: '100%',
    marginBottom: theme.space.xs,
    left: 0,
  },
  right: {
    left: '100%',
    marginLeft: theme.space.xs,
    top: '50%',
    translate: '0 -50%',
  },
  bottomRight: {
    top: '100%',
    marginTop: theme.space.xs,
    left: 0,
  },
  bottom: {
    top: '100%',
    marginTop: theme.space.xs,
    left: '50%',
    translate: '-50% 0',
  },
  bottomLeft: {
    top: '100%',
    marginTop: theme.space.xs,
    right: 0,
  },
  left: {
    right: '100%',
    marginRight: theme.space.xs,
    top: '50%',
    translate: '0 -50%',
  },
  topLeft: {
    bottom: '100%',
    marginBottom: theme.space.xs,
    right: 0,
  },
})

// Make parent non-clickable when menu is visible (outside click will close the menu)
globalStyle(`*:has(> ${menu.visible}):not(${menu.visible})`, {
  pointerEvents: 'none',
})

export const menuLabel = style({
  paddingTop: theme.space.sm,
  paddingBottom: theme.space.xs,
  paddingInline: theme.space.md,
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes.xs,

  selectors: {
    '&:nth-child(1)': {
      paddingTop: theme.space.xs,
    },
  },
})

export const menuItem = style({
  cursor: 'pointer',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: theme.space.lg,

  paddingBlock: theme.space.xs,
  paddingInline: theme.space.md,
  borderRadius: theme.radius.sm,

  transition: 'background-color 200ms',

  selectors: {
    '&:hover': {
      backgroundColor: theme.colors.translucent1,
    },
  },
})
