import { createVar } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { tokens, minWidth } from 'ui'

export const badgeBgColorVar = createVar()

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
    color: tokens.colors.dark,
    backgroundColor: badgeBgColorVar,
    borderRadius: tokens.radius.xxs,
  },
  variants: {
    size: {
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
