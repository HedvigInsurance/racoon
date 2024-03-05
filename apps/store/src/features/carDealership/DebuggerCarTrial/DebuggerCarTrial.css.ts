import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const wrapper = style({ paddingBottom: theme.space.xl })

export const resultRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  // Align with icon
  ':first-of-type': { marginTop: -3 },
})
