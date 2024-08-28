import styled from '@emotion/styled'
import { fadeIn, Spinner } from '@hedvig-ui'
import { ReactNode } from 'react'
import * as React from 'react'

interface StandaloneMessageProps {
  children?: ReactNode
  opacity?: number
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
}

const StandaloneMessageWrapper = styled.div<StandaloneMessageProps>`
  display: grid;
  place-items: center;
  opacity: 0;
  animation: ${({ opacity = 0.3 }) => fadeIn(opacity)} 1000ms forwards;
  animation-delay: 20ms;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  font-size: 1.5rem;
  padding-top: ${({ paddingTop }) => paddingTop};
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
  padding-left: ${({ paddingLeft }) => paddingLeft};
  padding-right: ${({ paddingRight }) => paddingRight};
`

export const StandaloneMessage = ({
  children,
  ...props
}: StandaloneMessageProps) => {
  return (
    <StandaloneMessageWrapper {...props}>
      <div>{children}</div>
    </StandaloneMessageWrapper>
  )
}

const LoadingMessageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: -2em;
`

export const LoadingMessage: React.FC<StandaloneMessageProps> = ({
  ...props
}) => (
  <StandaloneMessage {...props}>
    <LoadingMessageWrapper>
      <Spinner style={{ margin: '0.2em 0.7em' }} />
      {props?.children ?? 'Loading'}
    </LoadingMessageWrapper>
  </StandaloneMessage>
)
