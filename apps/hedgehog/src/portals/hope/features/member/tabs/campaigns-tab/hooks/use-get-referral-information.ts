import {
  GetReferralInformationQueryHookResult,
  ReferralInformation,
  useGetReferralInformationQuery,
} from 'types/generated/graphql'

type ReferralInformationReturnTuple = [
  ReferralInformation | undefined,
  GetReferralInformationQueryHookResult,
]

export const useGetReferralInformation = (
  memberId: string,
): ReferralInformationReturnTuple => {
  const queryResult = useGetReferralInformationQuery({
    variables: { memberId },
  })
  const referralInformation = queryResult.data?.member?.referralInformation as
    | ReferralInformation
    | undefined
  return [referralInformation, queryResult]
}
