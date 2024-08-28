import {
  ClaimDetailsDocument,
  ClaimDetailsQuery,
  UpsertCoInsuredMutationVariables,
  useDeleteCoInsuredMutation,
  useUpsertCoInsuredMutation,
} from 'types/generated/graphql'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import gql from 'graphql-tag'
import { toast } from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'

gql`
  mutation DeleteCoInsured($claimId: ID!) {
    deleteCoInsured(claimId: $claimId)
  }

  mutation UpsertCoInsured($claimId: ID!, $request: UpsertCoInsuredInput!) {
    upsertCoInsured(claimId: $claimId, request: $request) {
      id
      coInsured {
        ...ClaimCoInsured
      }
    }
  }
`

interface UseClaimCoInsuredResult {
  upsertCoInsured: (
    request: UpsertCoInsuredMutationVariables['request'],
  ) => void
  removeCoInsured: () => void
}

export const useClaimCoInsured = (claimId: string): UseClaimCoInsuredResult => {
  const [upsert] = useUpsertCoInsuredMutation()
  const [remove] = useDeleteCoInsuredMutation()

  const removeCoInsured = async () => {
    PushUserAction('claim', 'remove', 'co_insured', null)
    await toast.promise(
      remove({
        variables: { claimId },
        optimisticResponse: {
          deleteCoInsured: true,
        },
        update: (cache) => {
          const cachedData = cache.readQuery({
            query: ClaimDetailsDocument,
            variables: { claimId },
          })
          const cachedClaim = (cachedData as ClaimDetailsQuery)?.claim
          if (!cachedClaim) return
          cache.writeQuery({
            query: ClaimDetailsDocument,
            data: {
              claim: {
                ...cachedClaim,
                coInsured: null,
              },
            },
          })
        },
      }),
      {
        loading: 'Deleting co-insured',
        success: 'Co-insured deleted',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const upsertCoInsured = async (
    request: UpsertCoInsuredMutationVariables['request'],
  ) => {
    PushUserAction('claim', 'upsert', 'co_insured', null)
    await toast.promise(
      upsert({
        variables: {
          claimId,
          request,
        },
        optimisticResponse: {
          upsertCoInsured: {
            __typename: 'Claim',
            id: claimId,
            coInsured: {
              id: 'temp-id',
              ...request,
            },
          },
        },
      }),
      {
        loading: 'Updating co-insured',
        success: 'Co-insured updated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return { removeCoInsured, upsertCoInsured }
}
