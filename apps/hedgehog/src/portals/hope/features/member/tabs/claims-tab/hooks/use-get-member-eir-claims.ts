import { parseISO } from 'date-fns'
import { useMemo } from 'react'
import {
  EirClaim,
  GetMemberClaimsQueryResult,
  useGetMemberEirClaimsQuery,
} from 'types/generated/graphql'

type UseGetMemberClaimsReturnTuple = [
  ReadonlyArray<EirClaim>,
  GetMemberClaimsQueryResult,
]

export const useGetMemberEirClaims = (
  memberId: string,
): UseGetMemberClaimsReturnTuple => {
  const queryResult = useGetMemberEirClaimsQuery({
    variables: {
      memberId,
    },
  })

  const claims = useMemo(() => {
    const queryClaims = (queryResult?.data?.eirClaims ?? []) as EirClaim[]
    return [...queryClaims].sort(newestClaimsFirst)
  }, [queryResult?.data?.eirClaims])
  return [claims, queryResult]
}

const newestClaimsFirst = (a: EirClaim, b: EirClaim) =>
  +parseISO(b.syncedAt) - +parseISO(a.syncedAt)
