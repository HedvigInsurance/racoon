import { Button, DropdownMenu } from '@hedvig-ui/redesign'
import gql from 'graphql-tag'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import {
  Member,
  useSetMemberSubscriptionPreferenceMutation,
} from 'types/generated/graphql'
import { Market } from '../config/constants'
import toast from 'react-hot-toast'

gql`
  mutation setMemberSubscriptionPreference(
    $memberId: String!
    $subscribe: Boolean!
  ) {
    setMemberSubscriptionPreference(memberId: $memberId, subscribe: $subscribe)
  }
`

type Props = {
  member: Member
}

export const CustomerIOActions = ({ member }: Props) => {
  const { memberId, contractMarketInfo } = member

  const [setMemberSubscriptionPreference] =
    useSetMemberSubscriptionPreferenceMutation({
      onError: () => {
        toast.error('Operation failed!')
      },
    })

  const subscribe = () =>
    setMemberSubscriptionPreference({
      variables: {
        memberId,
        subscribe: true,
      },
      onCompleted: () => {
        toast.success('Subscribed to receiving offers over email')
      },
    })

  const unsubscribe = () =>
    setMemberSubscriptionPreference({
      variables: {
        memberId,
        subscribe: false,
      },
      onCompleted: () => {
        toast.success('Unsubscribed from receiving offers over email')
      },
    })

  const visitProfile = () => {
    const env = window.location.host.includes('hope.hedvig.com')
      ? 'prod'
      : 'staging'

    const market = contractMarketInfo?.market as Market

    const idMap: Record<'prod' | 'staging', Record<Market, string>> = {
      staging: {
        NORWAY: '90964',
        SWEDEN: '78110',
        DENMARK: '97571',
      },
      prod: {
        NORWAY: '92282',
        SWEDEN: '78930',
        DENMARK: '97570',
      },
    }

    window.open(
      `https://fly.customer.io/env/${idMap[env][market]}/people/${memberId}/sent`,
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="small">
          Customer.io <ThreeDotsVertical />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={subscribe}>Subscribe</DropdownMenu.Item>
        <DropdownMenu.Item onClick={unsubscribe}>Unsubscribe</DropdownMenu.Item>
        {contractMarketInfo?.market ? (
          <DropdownMenu.Item onClick={visitProfile}>
            Visit Profile
          </DropdownMenu.Item>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
