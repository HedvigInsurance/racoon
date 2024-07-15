import { style } from '@vanilla-extract/css'

// Visually hide content but make it available to screen readers
// https://www.a11yproject.com/posts/how-to-hide-content/
export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
})
