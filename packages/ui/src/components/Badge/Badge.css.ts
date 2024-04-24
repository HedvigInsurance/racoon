import { createVar } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { theme, minWidth } from 'ui/src/theme'

export const badgeBgColorVar = createVar()

const smallVariant = {
  paddingBlock: theme.space.xxs,
  paddingInline: theme.space.xs,
  fontSize: theme.fontSizes.sm,
}
const bigVariant = {
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,
  fontSize: theme.fontSizes.md,
  lineHeight: theme.fontSizes.md,
}
export const badge = recipe({
  base: {
    display: 'inline-block',
    color: theme.colors.dark,
    backgroundColor: badgeBgColorVar,
    borderRadius: theme.radius.xxs,
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
