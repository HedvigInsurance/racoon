import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const grid = style({
  display: 'grid',
  gridTemplateRows: '1fr 1fr',
  justifyItems: 'center',
  height: '100vh',

  '@media': {
    [minWidth.lg]: {
      gridTemplateColumns: '550px 1fr',
      gridTemplateRows: 'auto',
      alignItems: 'stretch',
    },
  },
})

export const loginVideo = style({
  position: 'relative',
  objectFit: 'cover',
  width: '100%',
  height: '100%',
})

export const loginWrapper = style({
  display: 'grid',
  gridTemplateRows: '1fr 200px',
  alignItems: 'center',
  justifyItems: 'center',
  '@media': {
    [minWidth.lg]: {
      order: -1,
    },
  },
})

export const formWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: tokens.space.md,
  marginTop: tokens.space.xxxl,
})

export const form = style({
  minWidth: '20rem',
})

export const fieldWrapper = style({
  marginTop: tokens.space.lg,
  marginBottom: tokens.space.xxs,
})
