import { style } from '@vanilla-extract/css'
import { hoverStyles, theme } from 'ui/src/theme'

export const learnMoreLink = style({
  color: theme.colors.textPrimary,
  ...hoverStyles({
    textDecoration: 'underline',
  }),
})
