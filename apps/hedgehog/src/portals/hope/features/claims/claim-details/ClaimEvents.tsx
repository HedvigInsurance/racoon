import {
  CardContent,
  CardTitle,
  List,
  ListItem,
  Spacing,
  Spinner,
} from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import * as React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import gql from 'graphql-tag'
import { useClaimEventsQuery } from 'types/generated/graphql'
import styled from '@emotion/styled'
import { extractPerformedBy } from '../../user/util'

gql`
  query ClaimEvents($claimId: ID!) {
    claim(id: $claimId) {
      id
      events {
        text
        date
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

export const ClaimEvents: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { data, error, loading } = useClaimEventsQuery({
    variables: { claimId },
  })

  const events = data?.claim?.events ?? []

  return (
    <CardContent>
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
          <ListItem key={event.date}>
            <p>{event.text}</p>
            <EventInfo>
              {event.performedBy && (
                <span>{extractPerformedBy(event.performedBy)}</span>
              )}
              <span>{format(parseISO(event.date), 'yyyy-MM-dd HH:mm:ss')}</span>
            </EventInfo>
          </ListItem>
        ))}
      </List>
    </CardContent>
  )
}
