import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const fadeIn = (max: number) =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: max, transform: 'translateY(0)' },
  })

export const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1rem;
  padding-top: 2rem;

  code {
    background: ${({ theme }) => theme.backgroundTransparent};
    padding: 1px 2px;
    border-radius: 0.25rem;
  }
  opacity: 0;
  animation: ${fadeIn(0.3)} 1000ms forwards;
  animation-delay: 500ms;
`

export const ExtraInstruction = styled.div`
  opacity: 0;
  animation: ${fadeIn(1)} 1000ms forwards;
  animation-delay: 1000ms;
`
