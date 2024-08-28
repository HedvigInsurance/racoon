import styled from '@emotion/styled'
import * as React from 'react'
import chroma from 'chroma-js'
import { Flex, Spacing } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import { SimpleMemberLookupResult } from 'types/generated/graphql'

const Card = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.foreground).brighten(0.5).hex()};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: height 200ms ease-in-out;
  border: 1px solid ${({ theme }) => theme.foreground};
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 25rem;

  #member-name {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.accentContrast};
  }

  #member-id {
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.accentContrast).darken(1).hex()};
  }

  #member-extra {
    font-size: 1rem;
    color: ${({ theme }) => theme.accentContrast};
    padding-top: 2rem;
  }

  #member-market {
    font-size: 1rem;
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) =>
      chroma(theme.background).alpha(0.2).hex()};

    color: ${({ theme }) => theme.accentContrast};
  }
`

const Group = styled.div`
  border-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
  background-color: ${({ theme }) => chroma(theme.background).alpha(0.1).hex()};
`

const GroupLabel = styled.span`
  color: ${({ theme }) => chroma(theme.accentContrast).alpha(0.5).hex()};
  font-size: 0.8rem;
`

const flags: Record<string, string> = {
  DENMARK: '🇩🇰',
  NORWAY: '🇳🇴',
  SWEDEN: '🇸🇪',
}

export const MemberCard: React.FC<{ member: SimpleMemberLookupResult }> = ({
  member: { firstName, lastName, memberId, email, phoneNumber, market },
}) => {
  return (
    <Card>
      <div>
        <div id="member-name">{`${firstName} ${lastName}`}</div>
        <div id="member-id">{memberId}</div>
      </div>
      <div id="member-extra">
        {email && (
          <Group>
            <GroupLabel>E-mail</GroupLabel>
            <div>{email}</div>
          </Group>
        )}
        <Spacing top="small" />
        {phoneNumber && (
          <Group>
            <GroupLabel>Phone</GroupLabel>
            <div>{phoneNumber}</div>
          </Group>
        )}
      </div>
      <Spacing top="small" />
      <Flex justify="space-between" align="flex-end">
        {market in flags && (
          <div id="member-market">
            {flags[market]} {convertEnumToTitle(market)}
          </div>
        )}
      </Flex>
    </Card>
  )
}
