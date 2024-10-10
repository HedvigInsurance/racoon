import { createVar } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { minWidth, tokens } from '../../theme'

export const badgeBgColor = createVar('badgeBgColor')
export const badgeFontColor = createVar('badgeFontColor')

const tinyVariant = {
  paddingBlock: '3px',
  paddingInline: '6px',
  fontSize: tokens.fontSizes.xxs,
}

const xsmallVariant = {
  paddingBlock: tokens.space.xxs,
  paddingInline: tokens.space.xs,
  fontSize: tokens.fontSizes.xs,
}

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
    display: 'inline-flex',
    color: badgeFontColor,
    backgroundColor: badgeBgColor,
    borderRadius: tokens.radius.xxs,
    vars: {
      [badgeFontColor]: tokens.colors.textPrimary,
    },
  },
  variants: {
    size: {
      tiny: tinyVariant,
      xsmall: xsmallVariant,
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
