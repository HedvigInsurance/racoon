import { createVar, style } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'
import { focusableStyles, navigationItem } from '../Header.css'

export const navigationTriggerLinkPadding = createVar()

export const navigationTrigger = style([
  focusableStyles,
  {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.space.xxxl,
    paddingTop: tokens.space.md,
    paddingLeft: tokens.space.lg,
    paddingRight: tokens.space.md,
    whiteSpace: 'nowrap',

    '@media': {
      [minWidth.lg]: {
        height: '2.5rem',
        paddingBlock: tokens.space.xs,
        paddingInline: navigationTriggerLinkPadding,
        borderRadius: tokens.radius.sm,
        backgroundColor: tokens.colors.buttonSecondary,

        selectors: {
          '&[data-state="open"], &:hover': {
            backgroundColor: tokens.colors.buttonSecondaryHover,
          },
        },
      },
    },
    vars: {
      [navigationTriggerLinkPadding]: tokens.space.md,
    },
  },
])

export const navigationTriggerSubMenu = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

export const navigationTriggerHiddenLabel = style({
  '@media': {
    [minWidth.lg]: {
      selectors: {
        // Visually hidden but available for screen readers
        [`${navigationItem}:last-child &`]: {
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        },
      },
    },
  },
})

export const hamburgerOpenGeneralMenu = style({
  display: 'none',
  '@media': {
    [minWidth.lg]: {
      selectors: {
        [`${navigationTrigger}[data-state="closed"] &`]: {
          display: 'block',
        },
      },
    },
  },
})

export const hamburgerCloseGeneralMenu = style({
  display: 'none',
  '@media': {
    [minWidth.lg]: {
      selectors: {
        [`${navigationTrigger}[data-state="open"] &`]: {
          display: 'block',
        },
      },
    },
  },
})

export const toggleIcon = style({
  flexShrink: 0,
  '@media': {
    [minWidth.lg]: {
      selectors: {
        ['&&']: { display: 'none' },
      },
    },
  },
})

export const openIcon = style([
  toggleIcon,
  {
    display: 'block',
    selectors: {
      '[data-state=open] > &': { display: 'none' },
    },
  },
])

export const closeIcon = style([
  toggleIcon,
  {
    display: 'none',
    selectors: {
      '[data-state=open] > &': { display: 'block' },
    },
  },
])
