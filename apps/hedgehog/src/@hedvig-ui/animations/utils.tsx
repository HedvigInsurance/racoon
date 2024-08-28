import { keyframes } from '@emotion/react'

export const fadeIn = (max: number) => keyframes`
  from { opacity: 0; transform: translateY(2%) }
  to { opacity: ${max}; transform: translateY(0) }
`
