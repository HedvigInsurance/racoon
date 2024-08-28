import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const spin = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`

export const Spinner = styled.div<{ push?: 'left' | 'right' }>`
  display: inline-block;
  margin: 0 auto;
  width: 0.95em;
  height: 0.95em;
  border: 0.1em solid currentColor;
  border-top-color: transparent;
  border-radius: 100%;
  animation: ${spin} 500ms linear infinite;
  transform: translateY(0.1em);

  ${({ push }) => push === 'left' && 'margin-left: 1em'};
  ${({ push }) => push === 'right' && 'margin-right: 1em'};
`
