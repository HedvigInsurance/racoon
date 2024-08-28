import {
  Contract,
  GetContractsQueryHookResult,
  useGetContractsQuery,
} from 'types/generated/graphql'
import { useMemo } from 'react'

type ContractReturnTuple = [
  ReadonlyArray<Contract>,
  GetContractsQueryHookResult,
]

export const useContracts = (memberId: string): ContractReturnTuple => {
  const queryResult = useGetContractsQuery({
    variables: { memberId },
  })
  const contracts = useMemo(() => {
    return (
      (queryResult.data?.member?.contracts?.slice() ?? []) as Contract[]
    ).sort(compareContracts)
  }, [queryResult.data?.member?.contracts])
  return [contracts, queryResult]
}

const compareContracts = (a: Contract, b: Contract) =>
  a.createdAt < b.createdAt ? 1 : -1
