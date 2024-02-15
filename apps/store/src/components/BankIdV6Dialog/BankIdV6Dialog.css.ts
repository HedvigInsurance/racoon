import { style, createVar } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const qrCode = style({
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.grayTranslucent200}`,
  backgroundColor: theme.colors.white,
})

export const qrCodeSkeleton = style({
  width: 200,
  aspectRatio: '1 / 1',
})

export const iconWithText = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.space.xs,
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
