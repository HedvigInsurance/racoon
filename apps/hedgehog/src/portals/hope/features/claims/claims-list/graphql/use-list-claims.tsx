import {
  ListClaimsLazyQueryHookResult,
  ListClaimsOptions,
  ListClaimsResult,
  useListClaimsLazyQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { useCallback } from 'react'

type ListClaimsReturnTuple = [
  ListClaimsResult,
  (options?: ListClaimsOptions) => void,
  ListClaimsLazyQueryHookResult[1],
]

gql`
  query ListClaims($options: ListClaimsOptions!) {
    listClaims(options: $options) {
      claims {
        id
        assignedAdmin {
          ...AdminSystemUser
        }
        member {
          memberId
          firstName
          lastName
        }
        subclaims {
          id
          type
          outcome
          payments {
            id
            amount
          }
          reserve
          reserves {
            ...SubclaimReserve
          }
        }
        market
        openedAt
        state
      }
      page
      totalPages
      totalClaims
    }
  }
`

export const useListClaims = (): ListClaimsReturnTuple => {
  const [listClaimsQuery, queryResult] = useListClaimsLazyQuery()

  const listClaims = useCallback(
    (options?: ListClaimsOptions) => {
      listClaimsQuery({
        variables: {
          options: {
            includeAll: options?.includeAll ?? false,
            page: options?.page ?? 0,
            pageSize: options?.pageSize ?? 20,
            sortBy: options?.sortBy ?? 'DATE',
            sortDirection: options?.sortDirection ?? 'DESC',
            filterClaimStates: options?.filterClaimStates ?? null,
            filterOpenedAfterOrOnDate:
              options?.filterOpenedAfterOrOnDate ?? null,
            filterOpenedBeforeOrOnDate:
              options?.filterOpenedBeforeOrOnDate ?? null,
            filterComplexities: options?.filterComplexities ?? null,
            filterMarkets: options?.filterMarkets ?? null,
            filterTypesOfContract: options?.filterTypesOfContract ?? null,
            filterClaimTypes: options?.filterClaimTypes ?? null,
            filterClaimOutcomes: options?.filterClaimOutcomes ?? null,
            searchString: options?.searchString,
            adminIds: options?.adminIds,
          },
        },
      })
    },
    [listClaimsQuery],
  )
  const {
    claims = [],
    page = 0,
    totalPages = 0,
    totalClaims = 0,
  } = {
    ...queryResult?.data?.listClaims,
  }

  const listClaimsResult = {
    claims,
    totalPages,
    page,
    totalClaims,
  }

  return [listClaimsResult as ListClaimsResult, listClaims, queryResult]
}
