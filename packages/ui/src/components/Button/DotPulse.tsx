import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

export const DotPulse = () => {
  return (
    <LoadingWrapper>
      <Circle style={{ ['--delay' as any]: '0' }} />
      <Circle style={{ ['--delay' as any]: '0.1s' }} />
      <Circle style={{ ['--delay' as any]: '0.2s' }} />
    </LoadingWrapper>
  )
}

const fadeAnimation = keyframes({
  '0%': { opacity: 0 },
  '8%, 50%': { opacity: 1 },
  '58%, 100%': { opacity: 0 },
})

const LoadingWrapper = styled.div({ display: 'flex', gap: 7 })

const Circle = styled.div({
  width: 6,
  height: 6,
  backgroundColor: 'currentcolor',
  borderRadius: '50%',
  animationName: fadeAnimation,
  animationDuration: '1.2s',
  animationIterationCount: 'infinite',
  animationDelay: 'var(--delay)',
})
