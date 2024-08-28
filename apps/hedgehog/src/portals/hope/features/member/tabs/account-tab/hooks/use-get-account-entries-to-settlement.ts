import {
  AccountEntryV2,
  GetAccountEntriesToSettlementQueryHookResult,
  useGetAccountEntriesToSettlementQuery,
} from 'types/generated/graphql'

type AccountEntriesToSettlementReturnTuple = [
  [AccountEntryV2] | undefined,
  GetAccountEntriesToSettlementQueryHookResult,
]

export const useGetAccountEntriesToSettlement = (
  settlementId: string,
): AccountEntriesToSettlementReturnTuple => {
  const queryResult = useGetAccountEntriesToSettlementQuery({
    variables: { settlementId },
  })
  const accountEntriesToSettlement = queryResult.data
    ?.accountEntriesToSettlement as [AccountEntryV2] | undefined
  return [accountEntriesToSettlement, queryResult]
}
