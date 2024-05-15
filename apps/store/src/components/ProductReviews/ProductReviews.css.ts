import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const wrapper = style({
  vars: {
    '--padding-x': themeVars.space.md,
  },
  width: 'min(calc(28.5rem + var(--padding-x) * 2), 100%)',
  marginInline: 'auto',
  paddingInline: 'var(--padding-x)',
})

export const disclaimerText = style({
  paddingInline: themeVars.space.md,
  paddingBottom: themeVars.space.md,
})

export const reviewsDistributionSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const reviewsDistributionWrapper = style({
  alignSelf: 'stretch',
})
