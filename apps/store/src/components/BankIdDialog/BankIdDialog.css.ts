import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const hedvigLogo = style({
  // Horizotally align logo in the header
  marginInline: 'auto',
})

export const qrCode = style({
  padding: tokens.space.md,
  borderRadius: tokens.radius.xl,
  border: `1px solid ${tokens.colors.grayTranslucent200}`,
  backgroundColor: tokens.colors.white,
  boxShadow: tokens.shadow.default,
})

export const qrCodeSkeleton = style({
  width: 200,
  aspectRatio: '1 / 1',
})

export const contentWrapper = style({
  width: 'min(24rem, 100%)',
  marginInline: 'auto',
})

export const link = style({
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
