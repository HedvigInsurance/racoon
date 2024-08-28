import { FadeIn, List, ListItem, Spinner } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'
import { useClaimEventsQuery } from 'types/generated/graphql'
import styled from '@emotion/styled'
import { extractPerformedBy } from '../../user/util'
import { useClaim } from '../hooks/use-claim'
import { useState } from 'react'
import { Button, Flex } from '@hedvig-ui/redesign'

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

export const ClaimEventsNew = () => {
  const { claimId } = useClaim()
  const { data, loading } = useClaimEventsQuery({
    variables: { claimId },
  })

  const events = data?.claim?.events ?? []

  const [showEvents, setShowEvents] = useState(false)

  return (
    <div>
      <Flex justify="center">
        <Button
          variant="secondary-alt"
          onClick={() => setShowEvents((showing) => !showing)}
        >
          {showEvents ? 'Hide events' : 'Show events'}
        </Button>
      </Flex>

      {showEvents && (
        <FadeIn>
          {loading && <Spinner />}
          <List>
            {events.map((event) => (
              <ListItem key={event.date}>
                <p>{event.text}</p>
                <EventInfo>
                  {event.performedBy && (
                    <span>{extractPerformedBy(event.performedBy)}</span>
                  )}
                  <span>
                    {format(parseISO(event.date), 'yyyy-MM-dd HH:mm:ss')}
                  </span>
                </EventInfo>
              </ListItem>
            ))}
          </List>
        </FadeIn>
      )}
    </div>
  )
}
