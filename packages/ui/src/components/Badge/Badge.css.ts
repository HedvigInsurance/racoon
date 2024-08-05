import { createVar } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { tokens, minWidth } from 'ui'

export const badgeBgColor = createVar('badgeBgColor')
export const badgeFontColor = createVar('badgeFontColor')

const smallVariant = {
  paddingBlock: tokens.space.xxs,
  paddingInline: tokens.space.xs,
  fontSize: tokens.fontSizes.sm,
}
const bigVariant = {
  paddingBlock: tokens.space.xs,
  paddingInline: tokens.space.sm,
  fontSize: tokens.fontSizes.md,
  lineHeight: tokens.fontSizes.md,
}
export const badge = recipe({
  base: {
    display: 'inline-block',
    color: badgeFontColor,
    backgroundColor: badgeBgColor,
    borderRadius: tokens.radius.xxs,
    vars: {
      [badgeFontColor]: tokens.colors.textPrimary,
    },
  },
  variants: {
    size: {
      tiny: {
        paddingBlock: '3px',
        paddingInline: '6px',
        fontSize: tokens.fontSizes.xxs,
      },
      small: smallVariant,
      big: bigVariant,

      responsive: {
        ...smallVariant,
        '@media': {
          [minWidth.md]: {
            ...bigVariant,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'small',
  },
})
