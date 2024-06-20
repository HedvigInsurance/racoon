import { style } from '@vanilla-extract/css'
import { tokens } from '../theme.css'
import { gray } from './colors'

export const colorGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem 1rem',
  marginBottom: tokens.space.xxl,
})

export const colorSwatch = style({
  width: 230,
  overflow: 'hidden',
  border: '1px solid hsla(0, 0%, 0%, 0.1)',
  borderRadius: tokens.radius.lg,
})

export const colorBg = style({
  aspectRatio: '7 / 4',
  borderBottom: '1px solid hsla(0, 0%, 0%, 0.1)',
})

export const colorInfo = style({
  paddingBlock: tokens.space.sm,
  paddingInline: tokens.space.md,
})

export const translucentWrapper = style({
  color: gray[25],
  marginBottom: tokens.space.xxl,
  marginInline: '-1rem',
  padding: tokens.space.md,
  backgroundColor: gray[1000],
})
