import { style } from '@vanilla-extract/css'
import { hoverStyles, minWidth, tokens, xStack, yStack } from 'ui'

export const root = style([
  yStack({ gap: 'xxs' }),
  {
    '@media': {
      [minWidth.lg]: {
        gap: tokens.space.xs,
      },
    },
  },
])

export const trigger = style([
  xStack({ gap: 'md', justifyContent: 'space-between', alignItems: 'center' }),
  {
    width: '100%',
    cursor: 'pointer',
    paddingBlock: tokens.space.sm,
    paddingInline: tokens.space.md,
    fontSize: tokens.fontSizes.md,
    selectors: {
      '&:focus-visible': {
        boxShadow: tokens.shadow.focus,
        borderRadius: tokens.radius.sm,
      },
    },
    ...hoverStyles({
      cursor: 'pointer',
    }),
    '@media': {
      [minWidth.lg]: {
        fontSize: tokens.fontSizes.lg,
        paddingBlock: tokens.space.md,
        paddingInline: tokens.space.lg,
      },
    },
  },
])

export const item = style({
  backgroundColor: tokens.colors.opaque1,
  borderRadius: tokens.radius.sm,
  // @ts-expect-error not supported by Vanilla type definitions
  '@media (hover: hover)': {
    // Would be nice to target `trigger` specifically,
    // but it returns multiple classes and transforming it to CSS selector would be awkward
    // Let's avoid solving it until we have other non-trigger buttons inside accordions
    [`&:has(button:hover)`]: {
      backgroundColor: tokens.colors.gray200,
      transition: `background ${tokens.transitions.hover}`,
    },
  },
})

export const openIcon = style({
  flexShrink: 0,
  display: 'block',
  selectors: {
    '[data-state=open] > &': { display: 'none' },
  },
})

export const closeIcon = style({
  flexShrink: 0,
  display: 'none',
  selectors: {
    '[data-state=open] > &': { display: 'block' },
  },
})

export const TRIGGER_ICON_SIZE = '1rem'
export const content = style({
  fontSize: tokens.fontSizes.md,
  color: tokens.colors.textSecondaryOnGray,
  lineHeight: 1.32,
  overflow: 'hidden',
  paddingInline: tokens.space.md,

  '@media': {
    [minWidth.lg]: {
      paddingLeft: tokens.space.lg,
      paddingRight: `calc(${tokens.space.lg} + ${TRIGGER_ICON_SIZE})`,
    },
  },
})
