import { globalStyle, style } from '@vanilla-extract/css'

export const selectedTags = style({
  maxWidth: '291px',
})

export const selectTag = style({
  position: 'relative',
  cursor: 'pointer',

  selectors: {
    '&::after': {
      content: 'x',
      position: 'absolute',
      top: -2,
      right: 2,
      opacity: 0,
      transition: '200ms ease',
    },
  },
})

globalStyle(`${selectTag}:hover::after`, {
  opacity: 1,
})
