import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import * as React from 'react'

const fade = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.3;
  }
`

const LoadableWrapper = styled.div<{ isLoading: boolean }>`
  > * {
    transition: opacity 300ms;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      > * {
        opacity: 0.3;
        animation: ${fade} 1500ms infinite;
        transition: opacity 300ms;
        position: relative;
        overflow: hidden;
        padding-top: 0.125em;
        padding-bottom: 0.125rem;

        &:before {
          content: ' ';
          display: block;
          position: absolute;
          top: 0.125em;
          right: 0;
          bottom: 0.125em;
          left: 0;
          background: rgba(127, 127, 127, 1);
          z-index: 999;
        }
      }

      ${Array(10)
        .fill(null)
        .map(
          (_, i) => css`
            > *:nth-of-type(${i}) {
              animation-delay: ${(i * 1000) / 10}ms;
            }
          `,
        )}
    `}
`

export const Loadable: React.FC<
  PropsWithChildren & {
    loading?: boolean
    as?: React.ComponentType
  }
> = ({ loading, as, children }) => (
  <LoadableWrapper as={as} isLoading={Boolean(loading)}>
    {children}
  </LoadableWrapper>
)
