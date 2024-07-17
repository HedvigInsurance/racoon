import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space.xxxl,
  paddingBottom: tokens.space.lg,
  '@media': {
    [minWidth.lg]: {
      paddingBottom: tokens.space.xxl,
    },
  },
})

export const fakeInput = style({
  width: '100%',
  height: '4.5rem',
  padding: tokens.space.sm,
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
})

export const fakeInputRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
