import { ClaimState } from '@hope/features/config/constants'
import { useSetClaimStatusMutation } from 'types/generated/graphql'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { extractErrorMessage } from '@hedvig-ui'
import toast from 'react-hot-toast'
import gql from 'graphql-tag'

gql`
  mutation SetClaimStatus($claimId: ID!, $status: String!) {
    updateClaimState(id: $claimId, state: $status) {
      id
      state
    }
  }
`

const successMessages = {
  [ClaimState.Open]: 'Claim opened',
  [ClaimState.Closed]: 'Claim closed',
  [ClaimState.Reopened]: 'Claim reopened',
}

export const useSetClaimStatus = () => {
  const [setClaimStatus] = useSetClaimStatusMutation()

  const setStatus = async (claimId: string, status: ClaimState) => {
    PushUserAction('claim', 'set', 'status', status)
    await toast.promise(
      setClaimStatus({
        variables: { claimId, status },
      }),
      {
        loading: 'Changing status...',
        success: successMessages[status],
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return { setStatus }
}
