import { style, createVar } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const qrCode = style({
  padding: themeVars.space.md,
  borderRadius: themeVars.radius.md,
  border: `1px solid ${themeVars.colors.grayTranslucent200}`,
  backgroundColor: themeVars.colors.white,
})

export const qrCodeSkeleton = style({
  width: 200,
  aspectRatio: '1 / 1',
})

export const iconWithText = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: themeVars.space.xs,
})

export const contentWrapperMaxWidth = createVar()
export const contentWrapper = style({
  display: 'grid',
  justifyItems: 'center',
  width: `min(${contentWrapperMaxWidth}, 100%)`,
  marginInline: 'auto',
  vars: {
    [contentWrapperMaxWidth]: '24rem',
  },
})

export const qrOnAnotherDeviceFooter = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const qrOnAnotherDeviceLink = style({
  fontSize: themeVars.fontSizes.md,
  color: themeVars.colors.textSecondary,
  textDecoration: 'underline',
  textUnderlineOffset: 5,
  textDecorationThickness: 1,
  textDecorationColor: 'currentcolor',
  ':hover': {
    color: themeVars.colors.textPrimary,
  },
  ':focus-visible': {
    outline: `2px solid ${themeVars.colors.gray900}`,
  },
})
