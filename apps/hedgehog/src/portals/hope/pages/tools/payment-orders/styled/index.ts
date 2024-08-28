import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { Button, InfoTag as _InfoTag } from '@hedvig-ui'

export const Divider = styled.div`
  width: 100%;
  border-top: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
`

export const Row = styled.div<{ columns?: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ columns }) =>
    columns ? `repeat(${columns}, 1fr)` : '1fr 1fr'};
  gap: 1rem;
`

export const InfoText = styled.div`
  color: ${({ theme }) => theme.accent};
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    color: ${({ theme }) => theme.accentLight};
  }
`

export const InfoTag = styled(_InfoTag)`
  padding-block: 0.25rem;
  max-width: max-content;
`

export const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  & > * {
    margin: 0;
    padding: 1rem;
    width: 100%;

    &:not(:nth-of-type(1)) {
      border-top: ${({ theme }) => `1px solid ${theme.border}`};
    }
  }
`

export const ActionButton = styled(Button)`
  & > div {
    width: 100%;

    & > div {
      width: 100%;
      position: relative;

      & > svg {
        opacity: 0;
        color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(100%, -50%);
      }
    }
  }

  &:hover {
    & > div {
      & > div {
        color: transparent;

        & > svg {
          opacity: 1;
          color: white;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
`
