import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  vars: {
    '--padding-x': tokens.space.md,
  },
  width: 'min(calc(28.5rem + var(--padding-x) * 2), 100%)',
  marginInline: 'auto',
  paddingInline: 'var(--padding-x)',
})

export const disclaimerText = style({
  paddingInline: tokens.space.md,
  paddingBottom: tokens.space.md,
})

export const reviewsDistributionSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const reviewsDistributionWrapper = style({
  alignSelf: 'stretch',
})
