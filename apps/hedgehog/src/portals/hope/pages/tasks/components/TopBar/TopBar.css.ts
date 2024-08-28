import { theme } from '@hedvig-ui/redesign/theme'
import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

export const css = {
  TopBar: style({
    width: '100%',

    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.space.sm,

    paddingBlock: theme.space.sm,
    paddingInline: theme.space.md,

    borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
  }),
  TopBarItem: styleVariants({
    base: {
      position: 'relative',

      display: 'grid',
      placeContent: 'center',

      paddingBlock: theme.space.md,
      paddingInline: theme.space.lg,

      borderRadius: theme.radius.md,

      cursor: 'pointer',

      transition: 'color 200ms',
    },
    default: {
      selectors: {
        '&:hover': {
          backgroundColor: theme.colors.translucent1,
          color: theme.colors.textSecondary,
        },
      },
    },
    selected: {
      backgroundColor: theme.colors.gray1000,
      color: theme.colors.textNegative,
      cursor: 'default',
    },
  }),
  CloseTrigger: style({
    position: 'absolute',
    top: theme.space.xxs,
    right: theme.space.xxs,

    cursor: 'pointer',

    opacity: 0,
    transition: 'opacity 200ms, scale 200ms',

    selectors: {
      '&:hover': {
        scale: '1.1',
      },
    },
  }),
}

globalStyle(`${css.TopBarItem.base}:hover ${css.CloseTrigger}`, {
  opacity: 1,
  visibility: 'visible',
})
