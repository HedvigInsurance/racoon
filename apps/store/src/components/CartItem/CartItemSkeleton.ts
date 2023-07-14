import styled from '@emotion/styled'
import { keyframes } from 'tss-react'
import { theme } from 'ui'

const pulsingAnimation = keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
})

export const CartItemSkeleton = styled.div({
  backgroundColor: theme.colors.grayTranslucent100,
  borderRadius: theme.radius.sm,
  height: '13.5rem',
  animation: `${pulsingAnimation} 1.5s ease-in-out infinite`,
})
