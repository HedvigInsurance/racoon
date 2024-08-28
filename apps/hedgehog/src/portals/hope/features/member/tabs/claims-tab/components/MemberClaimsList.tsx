import styled from '@emotion/styled'
import {
  Dropdown,
  DropdownOption,
  Flex,
  isPressing,
  Keys,
  Label,
  LoadingMessage,
  Monetary,
  Placeholder,
  Spacing,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import { useMemo, useState } from 'react'
import * as React from 'react'
import { useGetMemberClaims } from '@hope/features/member/tabs/claims-tab/hooks/use-get-member-claims'
import {
  ClaimState,
  ContractIcon,
  InsuranceType,
} from '@hope/features/config/constants'
import { Contract } from 'types/generated/graphql'

const ClaimStateBadge = styled.span<{ state: string }>`
  display: inline-block;
  min-width: 8em;
  text-align: center;
  padding: 0.3em 1em;
  background-color: ${({ theme, state }) =>
    state === ClaimState.Closed ? theme.success : theme.accent};
  color: ${({ theme }) => theme.accentContrast};
  font-size: 0.8em;
  border-radius: 8px;
`

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
`

export const MemberClaimsList: React.FC<{
  memberId: string
  onClickClaim: (claimId: string) => void
}> = ({ memberId, onClickClaim }) => {
  const [memberClaims, { loading }] = useGetMemberClaims(memberId)

  const [selectedContractId, setSelectedContractId] = useState<string>()

  const claims = useMemo(() => memberClaims ?? [], [memberClaims])

  const claimsList = useMemo(() => {
    if (!selectedContractId) return claims
    return claims.filter((claim) => claim.contract?.id === selectedContractId)
  }, [claims, selectedContractId])

  const contracts = useMemo(
    () =>
      claims
        .map((claim) => claim.contract)
        .filter((contract) => Boolean(contract)) as Contract[],
    [claims],
  )

  const uniqueContractIds = useMemo(
    () => [...new Set(contracts.map((contract) => contract.id))],
    [contracts],
  )
  const contractOptions = useMemo(
    () =>
      uniqueContractIds.map((id) => {
        return contracts.find((contract) => contract.id === id)
      }) as Contract[],
    [contracts, uniqueContractIds],
  )

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (claimsList.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        No claims for member
      </StandaloneMessage>
    )
  }

  return (
    <>
      <Spacing bottom="small">
        <Label>Filter by contract</Label>

        <Dropdown>
          <DropdownOption
            onClick={() => setSelectedContractId(undefined)}
            selected={selectedContractId === undefined}
          >
            All
          </DropdownOption>
          {contractOptions.map((contract) => {
            const icon = ContractIcon[contract.insuranceType as InsuranceType]
            const agreement = contract?.currentAgreement
            return (
              <DropdownOption
                key={contract.id}
                onClick={() => setSelectedContractId(contract.id)}
                selected={selectedContractId === contract.id}
              >
                <Flex gap="tiny">
                  {<span>{icon}</span>}
                  <span>
                    {agreement?.name
                      ? agreement.name
                      : agreement?.registrationNumber
                        ? agreement.registrationNumber
                        : agreement?.address
                          ? agreement.address.street
                          : contract?.insuranceType
                            ? convertEnumToTitle(contract.insuranceType)
                            : ''}
                  </span>
                </Flex>
              </DropdownOption>
            )
          })}
        </Dropdown>
      </Spacing>

      <Table>
        <TableHeader>
          <TableHeaderColumn>Date Opened</TableHeaderColumn>
          <TableHeaderColumn>Insurance</TableHeaderColumn>
          <TableHeaderColumn>Type & Outcome</TableHeaderColumn>
          <TableHeaderColumn>State</TableHeaderColumn>
          <TableHeaderColumn>Payments</TableHeaderColumn>
          <TableHeaderColumn>Reserves</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {claimsList.map((claim, index) => {
            const openedAtString = claim.openedAt
              ? formatDate(parseISO(claim.openedAt), 'dd MMMM, yyyy')
              : undefined
            const openedAtTimeString = claim.openedAt
              ? formatDate(parseISO(claim.openedAt), 'HH:mm')
              : undefined

            return (
              <TableRow
                key={claim.id}
                index={index}
                length={claimsList.length}
                onResolve={(selectedIndex) =>
                  onClickClaim(claimsList[selectedIndex].id)
                }
                topElement="Claims - Create"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (isPressing(e, Keys.Enter)) {
                    e.preventDefault()
                    onClickClaim(claim.id)
                  }
                }}
                onClick={() => onClickClaim(claim.id)}
              >
                <TableColumn>
                  {openedAtString && openedAtTimeString ? (
                    <FlexVertically>
                      {openedAtString}
                      <TableColumnSubtext>
                        {openedAtTimeString}
                      </TableColumnSubtext>
                    </FlexVertically>
                  ) : (
                    <Placeholder>Not opened</Placeholder>
                  )}
                </TableColumn>

                <TableColumn>
                  {claim.contract?.insuranceType ? (
                    <FlexVertically>
                      <span>
                        {convertEnumToTitle(claim.contract.insuranceType)}
                      </span>
                      <TableColumnSubtext>
                        {claim.agreement?.name ?? ''}
                      </TableColumnSubtext>
                    </FlexVertically>
                  ) : (
                    <Placeholder>Insurance not specified</Placeholder>
                  )}
                </TableColumn>

                <TableColumn>
                  <FlexVertically>
                    {claim.subclaims[0]?.type ? (
                      convertEnumToTitle(claim.subclaims[0].type)
                    ) : (
                      <Placeholder>Type not specified</Placeholder>
                    )}
                    <TableColumnSubtext>
                      {claim.subclaims[0]?.outcome ? (
                        convertEnumToTitle(claim.subclaims[0].outcome)
                      ) : (
                        <Placeholder>Outcome not specified</Placeholder>
                      )}
                    </TableColumnSubtext>
                  </FlexVertically>
                </TableColumn>

                <TableColumn>
                  <ClaimStateBadge state={claim.state}>
                    {convertEnumToTitle(claim.state)}
                  </ClaimStateBadge>
                </TableColumn>

                <TableColumn>
                  {claim.subclaims.some(
                    ({ paymentOrders }) =>
                      !!paymentOrders.filter(({ settledAt }) =>
                        Boolean(settledAt),
                      ).length,
                  ) ? (
                    <Monetary
                      amount={claim.subclaims
                        .flatMap((subclaim) => subclaim.paymentOrders)
                        .reduce(
                          (totalAmount, { amount, settledAt }) => {
                            if (settledAt) {
                              if (!totalAmount.currency) {
                                totalAmount.currency = amount.currency
                              }
                              totalAmount.amount = String(
                                Number(totalAmount.amount) + amount.amount,
                              )
                            }

                            return totalAmount
                          },
                          {
                            amount: '0',
                            currency: '',
                          },
                        )}
                    />
                  ) : (
                    <Placeholder>Not specified</Placeholder>
                  )}
                </TableColumn>

                <TableColumn>
                  {claim.subclaims.some(({ reserves }) => !!reserves.length) ? (
                    <Monetary
                      amount={claim.subclaims.reduce(
                        (reserve, subclaim) => {
                          reserve['amount'] = String(
                            Number(reserve['amount']) + subclaim.reserve.amount,
                          )
                          if (!reserve.currency) {
                            reserve['currency'] = subclaim.reserve.currency
                          }
                          return reserve
                        },
                        { amount: '0', currency: '' } as {
                          amount: string
                          currency: string
                        },
                      )}
                    />
                  ) : (
                    <Placeholder>Not specified</Placeholder>
                  )}
                </TableColumn>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
