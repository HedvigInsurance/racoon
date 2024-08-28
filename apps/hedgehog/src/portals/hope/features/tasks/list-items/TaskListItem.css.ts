import { theme } from '@hedvig-ui/redesign/theme'
import { style, styleVariants } from '@vanilla-extract/css'

const TaskListItem = styleVariants({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.space.md,

    paddingBlock: theme.space.xs,
    paddingInline: theme.space.md,

    cursor: 'pointer',
    overflowX: 'auto',

    borderBottom: '1px solid',
    borderColor: theme.colors.borderTranslucent1,

    selectors: {
      '&:hover': {
        scale: 1.005,
        backgroundColor: theme.colors.gray200,
      },
    },
  },
  selected: {
    boxShadow: theme.shadow.default,
    backgroundColor: theme.colors.translucent1,
    selectors: {
      '&:hover': {
        cursor: 'default',
        scale: 1,
        backgroundColor: theme.colors.translucent1,
      },
    },
  },
})

const flag = style({
  display: 'grid',
  placeItems: 'center',
  width: '24px',
})

const preview = style({
  color: theme.colors.textSecondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
})

export const css = {
  TaskListItem,
  flag,
  preview,
}
