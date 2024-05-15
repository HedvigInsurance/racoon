import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui'

export const articleList = style({
  display: 'grid',
  rowGap: themeVars.space.xxxl,
  columnGap: themeVars.space.lg,
  gridTemplateColumns: 'repeat(auto-fill, minmax(21rem, 1fr))',
  gridTemplateRows: 'max-content',
})

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
})

export const inlineButtonLink = style({ width: 'auto' })
