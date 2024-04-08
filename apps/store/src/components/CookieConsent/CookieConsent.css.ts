import { style } from '@vanilla-extract/css'
import { theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'

export const cookieBanner = style({
  position: 'fixed',
  bottom: theme.space.xs,
  left: 0,
  right: 0,
  width: 'calc(100% - 1rem)',
  maxWidth: '35rem',
  marginInline: 'auto',
  padding: theme.space.lg,
  backgroundColor: theme.colors.dark,
  boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.radius.xl,
  fontSize: '14px',
  color: '#333',
  zIndex: zIndexes.cookieBanner,
})

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'space-between',
})

export const readMoreLink = style({
  marginLeft: theme.space.xxs,
  textDecoration: 'underline',
})
