import gql from 'graphql-tag'
import { ClaimLocation } from '@hope/features/config/constants'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { extractErrorMessage } from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import { useSetClaimLocationMutation } from 'types/generated/graphql'

gql`
  mutation setClaimLocation($claimId: ID!, $location: String!) {
    claim_setLocation(claimId: $claimId, location: $location) {
      id
      location
    }
  }
`

export const useSetClaimLocation = () => {
  const [setClaimLocation] = useSetClaimLocationMutation()
  const setLocation = async (claimId: string, location: ClaimLocation) => {
    PushUserAction('claim', 'set', 'location', location)

    await toast.promise(
      setClaimLocation({
        variables: { claimId, location },
        optimisticResponse: {
          claim_setLocation: {
            __typename: 'Claim',
            id: claimId,
            location,
          },
        },
      }),
      {
        loading: 'Setting location...',
        success: `Location set`,
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }
  return { setLocation }
}
