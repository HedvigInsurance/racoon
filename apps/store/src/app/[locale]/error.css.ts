import { style } from '@vanilla-extract/css'
import { space } from 'ui/src/theme/space'

export const errorWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: space.md,
  gap: space.md,
})
