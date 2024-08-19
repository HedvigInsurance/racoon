import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'
import { CONTENT_WIDTH } from '@/features/memberArea/components/MemberAreaLayout.css'

export const wrapper = style({
  width: '100%',
  maxWidth: CONTENT_WIDTH,
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.space.md,
  width: '100%',
  paddingBlock: tokens.space.md,
  paddingInline: tokens.space.xxxs,
  borderBottom: `1px solid ${tokens.colors.gray200}`,
})
