import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'
import { CONTENT_WIDTH } from '@/features/memberArea/components/MemberAreaLayout.css'

export const tabList = style({
  display: 'flex',
  gap: tokens.space.xs,
  marginBottom: tokens.space.xs,
})

export const tabButton = style({
  flex: 1,
  selectors: {
    '&[data-state=active]': {
      backgroundColor: tokens.colors.translucent2,
    },
  },
})

export const overview = style({
  width: `min(${CONTENT_WIDTH}, 100%)`,
})

export const documentsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space.md,
  marginTop: tokens.space.lg,
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '3rem',
  selectors: {
    '&:not(:first-of-type)': {
      borderTop: '1px solid hsla(0, 0%, 7%, 0.1)',
    },
  },
})
