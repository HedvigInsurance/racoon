import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const qrCode = style({
  padding: tokens.space.md,
  borderRadius: tokens.radius.md,
  border: `1px solid ${tokens.colors.grayTranslucent200}`,
  backgroundColor: tokens.colors.white,
})

export const qrCodeSkeleton = style({
  width: 200,
  aspectRatio: '1 / 1',
})

export const iconWithText = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: tokens.space.xs,
})

export const contentWrapper = style({
  display: 'grid',
  justifyItems: 'center',
  width: 'min(24rem, 100%)',
  marginInline: 'auto',
})

export const qrOnAnotherDeviceFooter = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const qrOnAnotherDeviceLink = style({
  fontSize: tokens.fontSizes.md,
  color: tokens.colors.textSecondary,
  textDecoration: 'underline',
  textUnderlineOffset: 5,
  textDecorationThickness: 1,
  textDecorationColor: 'currentcolor',
  ':hover': {
    color: tokens.colors.textPrimary,
  },
  ':focus-visible': {
    outline: `2px solid ${tokens.colors.gray900}`,
  },
})
