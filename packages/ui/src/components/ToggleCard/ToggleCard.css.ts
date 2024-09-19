import { style } from '@vanilla-extract/css'
import { tokens } from '../../theme'

export const toggleCardSwitchStyles = style({
  // Align switch with label
  marginTop: `calc(${tokens.space[1]} / 2)`,
})
