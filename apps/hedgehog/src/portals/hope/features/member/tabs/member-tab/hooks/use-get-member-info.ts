import {
  GetMemberClaimsInfoQueryResult,
  GetMemberInfoQueryResult,
  Member,
  useGetMemberClaimsInfoQuery,
  useGetMemberInfoQuery,
} from 'types/generated/graphql'

type GetMemberInfoResult = GetMemberInfoQueryResult &
  GetMemberClaimsInfoQueryResult

type UseGetMemberInfoReturnTuple = [Member | undefined, GetMemberInfoResult]

export const useGetMemberInfo = (
  memberId = '',
): UseGetMemberInfoReturnTuple => {
  const queryResult = useGetMemberInfoQuery({
    variables: {
      memberId,
    },
    skip: !memberId,
  })
  const claimsResult = useGetMemberClaimsInfoQuery({
    variables: {
      memberId,
    },
    skip: !memberId,
  })
  const member = {
    ...queryResult?.data?.member,
    claims: claimsResult?.data?.member?.claims ?? [],
    gsrClaims: claimsResult?.data?.member?.gsrClaims ?? [],
  } as Member | undefined
  return [member, { ...queryResult, ...claimsResult } as GetMemberInfoResult]
}
