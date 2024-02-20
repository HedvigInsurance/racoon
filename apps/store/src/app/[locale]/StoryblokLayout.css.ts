import { style } from '@vanilla-extract/css'

export { dark } from 'ui/src/theme/dark.css'

export const wrapper = style({
  minHeight: '100vh',
  isolation: 'isolate',
})
