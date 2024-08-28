import { keyframes } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'

const fadeInKeyframes = (maxOpacity: number, translateTo: string) =>
  keyframes({
    from: { opacity: 0, transform: translateTo },
    to: { opacity: maxOpacity, transform: 'translateY(0)' },
  })

export interface FadeInProps {
  delay?: string
  duration?: number
  translateTo?: string
}

// FIXME: Type-wise this is really messy

export const withFadeIn: <T extends object>(
  // eslint-disable-next-line
  component: any,
  // eslint-disable-next-line
  ...args: any
) => // eslint-disable-next-line
StyledComponent<FadeInProps, T, any> = (component, ...args) =>
  styled(
    component,
    ...args,
  )<FadeInProps>(
    ({ delay = '0ms', duration = 1000, translateTo = 'translateY(2%)' }) => ({
      opacity: 0,
      animation: `${fadeInKeyframes(1.0, translateTo)} ${duration}ms forwards`,
      animationDelay: delay,
    }),
  )

export const FadeIn = withFadeIn('div')
