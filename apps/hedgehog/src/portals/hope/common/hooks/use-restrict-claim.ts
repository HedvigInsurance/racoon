import gql from 'graphql-tag'
import {
  ClaimDetailsDocument,
  ClaimDetailsQuery,
  useReleaseResourceAccessMutation,
  useRestrictResourceAccessMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { extractErrorMessage } from '@hedvig-ui'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

gql`
  mutation RestrictResourceAccess($claimId: ID!) {
    restrictResourceAccess(resourceId: $claimId) {
      ...ResourceAccess
    }
  }
`

export const useRestrictClaim = (claimId: string) => {
  const [releaseResourceAccess] = useReleaseResourceAccessMutation()
  const [restrictResourceAccess] = useRestrictResourceAccessMutation()

  const release = async () => {
    PushUserAction('claim', 'delete', 'restriction', null)
    await toast.promise(
      releaseResourceAccess({
        variables: { resourceId: claimId },
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
                restriction: null,
              },
            },
          })
        },
      }),
      {
        loading: 'Removing restriction',
        success: 'Restriction removed',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const restrict = async () => {
    PushUserAction('claim', 'create', 'restriction', null)
    await toast.promise(
      restrictResourceAccess({
        variables: { claimId },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response) return
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
                restriction: response.restrictResourceAccess,
              },
            },
          })
        },
      }),
      {
        loading: 'Restricting access',
        success: 'Access restricted',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return { restrict, release }
}
