import * as React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import chroma from 'chroma-js'
import {
  AuthenticationDocument,
  useSetPortalMutation,
} from 'types/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { FadeIn } from '@hedvig-ui'
import gql from 'graphql-tag'

const PortalCard = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 18rem;
  height: 9rem;

  padding: 0.8rem 0.8rem 0.8rem 1rem;

  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;

  ${({ theme }) => css`
    background: ${chroma(theme.foreground).brighten(0.5).hex()};
    color: ${theme.backgroundLight};
  `};

  div:first-of-type {
    font-size: 1.6rem;
    font-weight: bold;
  }

  transition: background-color 200ms ease-in-out;

  div:nth-of-type(2) {
    transition: opacity 200ms ease-in-out;
    font-size: 1.05rem;
    line-height: 1.25rem;
    color: ${({ theme }) => chroma(theme.background).darken(1.5).hex()};
    opacity: 0;
  }

  div:last-of-type {
    display: flex;
    justify-content: flex-end;
  }

  :hover {
    div:nth-of-type(2) {
      opacity: 1;
    }
  }

  cursor: pointer;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.foreground).brighten(1).hex()};
  }
`

const ActiveBadge = styled.span`
  background-color: ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.background};
  border-radius: 0.25rem;
  padding: 0.2rem 0.5rem;
`

const ActivateBadge = styled.span`
  color: ${({ theme }) => theme.background};
  padding: 0.2rem 0.5rem;
  text-decoration: underline;
`

type Portal = 'HOPE' | 'SOS'

const descriptions: Record<Portal, string> = {
  HOPE: 'The primary claims and member management tool',
  SOS: 'Restricted member lookup used by SOS International',
}

const displayNames: Record<Portal, string> = {
  HOPE: 'Hope',
  SOS: 'SOS',
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

gql`
  mutation SetPortal($portal: String!) {
    setPortal(portal: $portal) {
      id
    }
  }
`

export const AvailablePortals: React.FC<{
  portals: string[]
  currentPortal: string
  maxWidth?: string
}> = ({ portals, currentPortal, maxWidth }) => {
  const navigate = useNavigate()
  const [setPortal] = useSetPortalMutation()

  const selectPortalHandler = (portal: string) => {
    if (currentPortal === portal) {
      navigate('/')
      return
    }

    if (
      !window.confirm(
        `Are you sure you want to go to the ${
          displayNames[portal as Portal] ?? portal
        } portal?`,
      )
    ) {
      return
    }

    setPortal({
      variables: { portal },
      refetchQueries: [{ query: AuthenticationDocument }],
    }).then(() => navigate('/'))
  }

  if (portals.length <= 1) {
    return null
  }

  return (
    <Container style={{ maxWidth }}>
      {portals.map((portal, index) => (
        <FadeIn duration={1000} delay={`${index * 100}ms`} key={portal}>
          <PortalCard onClick={() => selectPortalHandler(portal)}>
            <div>{displayNames[portal as Portal] ?? portal}</div>
            <div>{descriptions[portal as Portal] ?? portal}</div>
            <div>
              {currentPortal === portal ? (
                <ActiveBadge>current</ActiveBadge>
              ) : (
                <ActivateBadge>activate</ActivateBadge>
              )}
            </div>
          </PortalCard>
        </FadeIn>
      ))}
    </Container>
  )
}
