import gql from 'graphql-tag'
import {
  MemberSearchContractFragment,
  MemberSearchContractsQuery,
  useMemberSearchContractsQuery,
} from 'types/generated/graphql'
import { ContractStatus } from '@hope/features/config/constants'

gql`
  query MemberSearchContracts($memberId: ID!) {
    member(id: $memberId) {
      memberId
      birthDate
      signedOn
      contractMarketInfo {
        market
        preferredCurrency
      }
      contracts {
        ...MemberSearchContract
      }
    }
  }

  fragment MemberSearchContract on Contract {
    id
    masterInception
    terminationDate
    status
  }
`

type MemberContractGroupBy = 'status'

interface UseMemberContracts {
  member: MemberSearchContractsQuery['member'] | null
  contracts: Array<MemberSearchContractFragment>
  loading: boolean
  groupBy: (
    by: MemberContractGroupBy,
  ) => Record<string, Array<MemberSearchContractFragment>>
}

export const useMemberSearchContracts = (
  memberId: string,
): UseMemberContracts => {
  const { data, loading } = useMemberSearchContractsQuery({
    variables: { memberId },
  })

  const member = data?.member ?? null
  const contracts = member?.contracts ?? []

  const groupByStatus = () =>
    contracts.reduce<Record<string, Array<MemberSearchContractFragment>>>(
      (acc, contract) => {
        const groupedStatus = [
          ContractStatus.Pending,
          ContractStatus.Terminated,
          ContractStatus.ActiveInFuture,
        ].includes(contract.status as ContractStatus)
          ? contract.status
          : ContractStatus.Active

        return {
          ...acc,
          [groupedStatus]: [...(acc[groupedStatus] ?? []), contract],
        }
      },
      {},
    )

  const groupBy = (by: MemberContractGroupBy) => {
    switch (by) {
      case 'status':
        return groupByStatus()
    }
  }

  return {
    member,
    contracts,
    loading,
    groupBy,
  }
}
