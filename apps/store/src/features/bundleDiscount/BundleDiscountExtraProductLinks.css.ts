import { style } from '@vanilla-extract/css'
import { hoverStyles, theme, tokens } from 'ui/src/theme'

export const bundleDiscountLinkCard = style({
  marginBlock: theme.space.md,
  display: 'flex',
  flexDirection: 'row',

  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.sm,

  backgroundColor: theme.colors.gray100,
  padding: theme.space.md,
  borderRadius: theme.space.md,

  ...hoverStyles({
    backgroundColor: tokens.colors.gray200,
  }),
})

export const bundleDiscountLinkCardTitle = style({
  flexGrow: 1,
})
