import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space.xxs,
  maxWidth: '30rem',
  marginInline: 'auto',
  padding: '1rem',
  border: `1px solid ${tokens.colors.borderTranslucent1}`,
  borderRadius: tokens.radius.xl,
  backgroundColor: tokens.colors.backgroundStandard,
  boxShadow: tokens.shadow.card,
})
