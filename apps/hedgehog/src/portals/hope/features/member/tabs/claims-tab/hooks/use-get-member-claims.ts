import { parseISO } from 'date-fns'
import { useMemo } from 'react'
import {
  Claim,
  GetMemberClaimsQueryResult,
  useGetMemberClaimsQuery,
} from 'types/generated/graphql'

type UseGetMemberClaimsReturnTuple = [
  ReadonlyArray<Claim>,
  GetMemberClaimsQueryResult,
]

export const useGetMemberClaims = (
  memberId: string,
): UseGetMemberClaimsReturnTuple => {
  const queryResult = useGetMemberClaimsQuery({
    variables: {
      memberId,
    },
  })

  const claims = useMemo(() => {
    const queryClaims = (queryResult?.data?.member?.claims ?? []) as Claim[]
    return [...queryClaims].sort(newestClaimsFirst)
  }, [queryResult?.data?.member?.claims])

  return [claims, queryResult]
}

const newestClaimsFirst = (a: Claim, b: Claim) =>
  +parseISO(b.registrationDate) - +parseISO(a.registrationDate)
