import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui'

export const wrapper = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: themeVars.space.xl,
  height: '100dvh',
  padding: themeVars.space.xl,
})

export const iframe = style({
  height: '100%',
  maxHeight: 750,
  width: 375,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: themeVars.colors.borderOpaque1,
  display: 'block',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
})

export const sidebar = style({
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gap: themeVars.space.xl,
})
