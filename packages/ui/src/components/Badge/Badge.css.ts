import { createVar } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { themeVars, minWidth } from 'ui/src/theme'

export const badgeBgColorVar = createVar()

const smallVariant = {
  paddingBlock: themeVars.space.xxs,
  paddingInline: themeVars.space.xs,
  fontSize: themeVars.fontSizes.sm,
}
const bigVariant = {
  paddingBlock: themeVars.space.xs,
  paddingInline: themeVars.space.sm,
  fontSize: themeVars.fontSizes.md,
  lineHeight: themeVars.fontSizes.md,
}
export const badge = recipe({
  base: {
    display: 'inline-block',
    color: themeVars.colors.dark,
    backgroundColor: badgeBgColorVar,
    borderRadius: themeVars.radius.xxs,
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
