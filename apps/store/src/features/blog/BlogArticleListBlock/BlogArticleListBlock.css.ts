import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const articleList = style({
  display: 'grid',
  rowGap: theme.space.xxxl,
  columnGap: theme.space.lg,
  gridTemplateColumns: 'repeat(auto-fill, minmax(21rem, 1fr))',
  gridTemplateRows: 'max-content',
})

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
})

export const inlineButtonLink = style({ width: 'auto' })
