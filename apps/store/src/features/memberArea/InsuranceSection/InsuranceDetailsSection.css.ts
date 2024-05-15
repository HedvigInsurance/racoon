import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'
import { CONTENT_WIDTH } from './InsuranceSection.constants'

export const tabList = style({
  display: 'flex',
  gap: themeVars.space.xs,
  marginBottom: themeVars.space.xs,
})

export const tabButton = style({
  flex: 1,
  selectors: {
    '&[data-state=active]': {
      backgroundColor: themeVars.colors.translucent2,
    },
  },
})

export const overview = style({
  width: `min(${CONTENT_WIDTH}, 100%)`,
})

export const documentsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeVars.space.md,
  marginTop: themeVars.space.lg,
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '3rem',
  selectors: {
    '&:not(:first-of-type)': {
      borderTop: '1px solid hsla(0, 0%, 7%, 0.1)',
    },
  },
})
