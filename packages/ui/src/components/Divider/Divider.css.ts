import { style } from '@vanilla-extract/css'
import { tokens } from '../../theme'

export const divider = style({
  height: 1,
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: tokens.colors.borderOpaque1,
})
