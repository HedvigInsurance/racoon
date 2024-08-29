import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { xStack } from '../../patterns'
import { tokens } from '../../theme'

const ButtonActiveColor = createVar()

export const tabsRoot = style({
  width: 'min-content',
  marginInline: 'auto',
  paddingInline: tokens.space.xs,
})

export const tabsListBase = style([
  xStack({ alignItems: 'center', gap: 'xs', paddingInline: 'xxs', paddingBlock: 'xxs' }),
])

export const tabsListSize = styleVariants({
  small: { borderRadius: tokens.radius.xs },
  medium: { borderRadius: tokens.radius.md },
  large: { borderRadius: tokens.radius.lg },
})

export const tabsListType = styleVariants({
  default: {
    vars: { [ButtonActiveColor]: tokens.colors.buttonSecondary },
  },
  filled: {
    backgroundColor: tokens.colors.surfaceOpaquePrimary,
    borderRadius: tokens.radius.md,
    vars: { [ButtonActiveColor]: tokens.colors.buttonSecondaryAlt },
  },
})

export const tabButton = style({
  selectors: {
    '&[data-state=active]': {
      backgroundColor: ButtonActiveColor,
    },
  },
})
