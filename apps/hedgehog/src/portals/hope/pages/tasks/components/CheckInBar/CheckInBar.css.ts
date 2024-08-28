import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const css = {
  CheckInBar: style({
    backgroundColor: theme.colors.gray50,

    paddingBlock: theme.space.xl,
    paddingInline: theme.space.xxxl,
  }),
}
