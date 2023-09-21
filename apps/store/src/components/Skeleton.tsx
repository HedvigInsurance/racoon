import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from 'ui'

const pulsingAnimation = keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
})

export const Skeleton = styled.div({
  backgroundColor: theme.colors.grayTranslucent100,
  borderRadius: theme.radius.sm,
  animation: `${pulsingAnimation} 1.5s ease-in-out infinite`,
})
