import { CardTitle, List, ListItem, Spacing, Spinner } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import * as React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import gql from 'graphql-tag'
import { useContractEventsQuery } from 'types/generated/graphql'
import styled from '@emotion/styled'
import { extractPerformedBy } from '@hope/features/user/util'

gql`
  query ContractEvents($contractId: ID!) {
    contractEvents(contractId: $contractId) {
      type
      timestamp
      source
      description
      performedBy {
        __typename
        ... on AdminSystemUser {
          ...AdminSystemUser
        }
        ... on EmailSystemUser {
          id
          email
          name
        }
        ... on MemberSystemUser {
          memberId
        }
        ... on UnknownSystemUser {
          id
          name
        }
      }
    }
  }
`

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  text-align: right;
  font-size: 0.8rem;
  white-space: nowrap;
`

export const CardContentX = styled('div')`
  text-wrap: wrap;
`

export const Events: React.FC<{ contractId: string }> = ({ contractId }) => {
  const { data, error, loading } = useContractEventsQuery({
    variables: { contractId },
  })

  const events = data?.contractEvents ?? []

  return (
    <CardContentX>
      <CardTitle
        title="Events"
        badge={
          error
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      <Spacing top="medium" />
      {loading && <Spinner />}

      <List>
        {events.map((event) => (
          <ListItem key={event.type + event.timestamp}>
            <p>
              <b>{event.type}</b> <br />
              {event.description}
            </p>
            <EventInfo>
              {event.performedBy && (
                <span>{extractPerformedBy(event.performedBy)}</span>
              )}
              <span>
                {format(parseISO(event.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </span>
              {event.source && <span>Source: {event.source}</span>}
            </EventInfo>
          </ListItem>
        ))}
      </List>
    </CardContentX>
  )
}
