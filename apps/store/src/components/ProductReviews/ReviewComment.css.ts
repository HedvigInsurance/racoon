import { style } from '@vanilla-extract/css'
import { themeVars, minWidth } from 'ui/src/theme'

export const wrapper = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: themeVars.space.xs,
  padding: themeVars.space.md,
  borderRadius: themeVars.radius.md,
  backgroundColor: themeVars.colors.opaque1,
  width: 'min(40ch, 100%)',
  minHeight: '8.5rem',

  '@media': {
    [minWidth.md]: {
      padding: themeVars.space.lg,
      gap: themeVars.space.md,
    },
  },
})

export const reviewHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.space.xs,
})

export const reviewContent = style({
  whiteSpace: 'normal',
})

export const reviewFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: themeVars.colors.textTranslucentSecondary,
})

export const reviewTag = style({
  fontSize: themeVars.fontSizes.xs,
  paddingBlock: themeVars.space.xxs,
  paddingInline: themeVars.space.xs,
  borderRadius: themeVars.radius.xs,
  backgroundColor: themeVars.colors.backgroundStandard,
})
