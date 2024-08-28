import {
  GetMasterLedgerBreakdownQueryHookResult,
  Member,
  useGetMasterLedgerBreakdownQuery,
} from 'types/generated/graphql'

type MasterLedgerBreakdownReturnTuple = [
  Member | undefined,
  GetMasterLedgerBreakdownQueryHookResult,
]

export const useGetMasterLedgerBreakdown = (
  memberId: string,
): MasterLedgerBreakdownReturnTuple => {
  const queryResult = useGetMasterLedgerBreakdownQuery({
    variables: { memberId },
  })
  const masterLedgerBreakdown = queryResult.data?.member as Member | undefined
  return [masterLedgerBreakdown, queryResult]
}
