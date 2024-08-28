import styled from '@emotion/styled'
import {
  convertEnumToTitle,
  FadeIn,
  LoadingMessage,
  StandaloneMessage,
} from '@hedvig-ui'
import gql from 'graphql-tag'
import { Contract } from '@hope/features/member/tabs/contracts-tab/contract'
import { useContracts } from '@hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import { RefreshButton } from '@hope/features/member/tabs/shared/refresh-button'
import * as React from 'react'
import { ArrowRepeat, ExclamationCircle } from 'react-bootstrap-icons'
import { useMemberSelfChangeBlockersQuery } from 'types/generated/graphql'
import { ContractStatus } from '../../../config/constants'
import { useMemo, useState } from 'react'
import { Flex, MultiSelect } from '@hedvig-ui/redesign'
import { theme } from '@hedvig-ui/redesign/theme'

gql`
  query MemberSelfChangeBlockers($memberId: ID!) {
    member(id: $memberId) {
      memberId
      selfChangeBlockers
    }
  }
`

const Blockers = styled.div`
  list-style: none;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.accentLighter};
  padding: 0.625rem;
  border-radius: 0.5rem;

  margin: 0 0 0.5rem;

  & span {
    margin-left: 0.5rem;
    font-size: 12px;
    line-height: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
  }
`

const CONTRACT_STATUSES = [...Object.values(ContractStatus)]

export const ContractTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data } = useMemberSelfChangeBlockersQuery({
    variables: { memberId },
  })
  const [contracts, { loading, refetch }] = useContracts(memberId)

  const [contractStatusFilter, setContractStatusFilter] = useState<string[]>([])

  const toggleStatusInFilter = (status: string) => {
    setContractStatusFilter((prev) => {
      if (prev.includes(status)) {
        return prev.filter((item) => item !== status)
      }
      return [...prev, status]
    })
  }

  const selfChangeBlockers = data?.member?.selfChangeBlockers

  const filteredContracts = useMemo(
    () =>
      contracts.filter((contract) => {
        return !contractStatusFilter.includes(contract.status)
      }),
    [contracts, contractStatusFilter],
  )

  const sortedContracts = useMemo(
    () =>
      filteredContracts.toSorted((a, b) => {
        const aOrder = CONTRACT_STATUSES.indexOf(a.status as ContractStatus)
        const bOrder = CONTRACT_STATUSES.indexOf(b.status as ContractStatus)
        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }
        if (a.masterInception) {
          if (b.masterInception) {
            return a.masterInception
              .toString()
              .localeCompare(b.masterInception.toString())
          }
          return 1
        }
        if (b.masterInception) {
          return -1
        }
        return 1
      }),
    [filteredContracts],
  )

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (contracts.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        No contract for member
      </StandaloneMessage>
    )
  }

  return (
    <FadeIn>
      {selfChangeBlockers && selfChangeBlockers.length > 0 && (
        <Blockers>
          <ExclamationCircle />
          <span>
            Self-change blocker:{' '}
            {selfChangeBlockers.map((blocker, index) => (
              <React.Fragment key={blocker}>
                <strong>{convertEnumToTitle(blocker)}</strong>
                {index == selfChangeBlockers.length - 2
                  ? ' & '
                  : selfChangeBlockers.length > 2 && ', '}
              </React.Fragment>
            ))}
          </span>
        </Blockers>
      )}
      {contracts.length > 0 && (
        <>
          <Flex direction="column" gap="md" mb="md">
            <RefreshButton
              style={{ fontSize: theme.fontSizes.xxl }}
              onClick={() => refetch()}
              isloading={loading || undefined}
            >
              <ArrowRepeat />
            </RefreshButton>

            <div style={{ width: '50%' }}>
              <MultiSelect
                label="Exclude from view"
                value={contractStatusFilter}
                options={CONTRACT_STATUSES.map((status) => ({
                  value: status,
                  label: convertEnumToTitle(status),
                  action: () => toggleStatusInFilter(status),
                }))}
              />
            </div>
          </Flex>
        </>
      )}
      <div>
        {sortedContracts.map((contract) => (
          <Contract
            key={contract.id}
            contract={contract}
            onRefetch={() => refetch()}
            shouldPreSelectAgreement={
              contracts.length === 1 && !contract.terminationDate
            }
          />
        ))}
      </div>
    </FadeIn>
  )
}
