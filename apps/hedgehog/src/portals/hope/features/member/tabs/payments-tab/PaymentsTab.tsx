import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  Copyable,
  formatMoney,
  InfoRow,
  InfoTag,
  InfoText,
  LoadingMessage,
  MainHeadline,
  Shadowed,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  ThirdLevelHeadline,
  useConfirmDialog,
} from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'
import { Market } from '@hope/features/config/constants'
import { useGetMasterLedgerBreakdown } from '@hope/features/member/tabs/account-tab/hooks/use-get-master-ledger-breakdown'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Transaction,
  useCreatePaymentCompletionLinkMutation,
  useGetMemberTransactionsQuery,
  useCancelAutoRescueMutation,
} from 'types/generated/graphql'
import { PayoutDetails } from './PayoutDetails'
import { SmallTopSpacing } from '../campaigns-tab/styles'

const CHARGE_MEMBER_MUTATION = gql`
  mutation ChargeMemberOutstandingBalance($memberId: ID!) {
    chargeMemberOutstandingBalance(memberId: $memberId) {
      memberId
      transactions {
        id
        amount {
          amount
          currency
        }
        timestamp
        type
        status
      }
    }
  }
`

const PaymentTable = styled(Table)`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const PaymentTableHeader = styled(TableHeader)`
  & tr {
    flex: 1;
    display: grid;
    grid-template-columns: 0.9fr 0.4fr 0.5fr 0.3fr 0.5fr 0.7fr;
  }
`

const PaymentColumn = styled(TableColumn)`
  &,
  & * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const TableRowColored = styled(TableRow)<{
  status: Transaction['status']
  type: Transaction['type']
}>`
  flex: 1;
  display: grid;
  grid-template-columns: 0.9fr 0.4fr 0.5fr 0.3fr 0.5fr 0.7fr;

  td {
    background-color: ${({ theme, status, type }) => {
      if (type === 'PAYOUT') {
        return theme.accentLighter
      }
      switch (status) {
        case 'INITIATED':
          return theme.lightWarning
        case 'COMPLETED':
          return theme.lightSuccess
        case 'FAILED':
          return theme.lightDanger
      }
    }} !important;
  }
`

const ChargeNotAvailableMessage = styled(StandaloneMessage)`
  font-size: 1.2em;
  padding: 1.5em 0;
`

const MemberTransactionsTable: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const { data } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })
  const [cancelAutoRescueMutation] = useCancelAutoRescueMutation()

  const transactions = (data?.member?.transactions ?? [])
    .slice()
    .sort((a, b) =>
      a && b
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : 0,
    )
    .reverse()

  return (
    <PaymentTable>
      <PaymentTableHeader>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Amount</TableHeaderColumn>
        <TableHeaderColumn>Timestamp</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Action</TableHeaderColumn>
      </PaymentTableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          if (!transaction) {
            return null
          }

          return (
            <TableRowColored
              border
              key={transaction.id}
              status={transaction.status}
              type={transaction.type}
            >
              <PaymentColumn title={transaction.id?.toString()}>
                {transaction.id}
              </PaymentColumn>
              <PaymentColumn
                title={
                  transaction.amount ? formatMoney(transaction.amount) : ''
                }
              >
                <strong>
                  {transaction.amount ? formatMoney(transaction.amount) : ''}
                </strong>
              </PaymentColumn>
              <PaymentColumn
                title={format(
                  parseISO(transaction.timestamp),
                  'yyyy-MM-dd HH:mm:ss',
                )}
              >
                {format(parseISO(transaction.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </PaymentColumn>
              <PaymentColumn title={transaction.type?.toString()}>
                {transaction.type}
              </PaymentColumn>
              <PaymentColumn title={transaction.status?.toString()}>
                {transaction.status}
              </PaymentColumn>
              <PaymentColumn title="Cancel Auto Rescue">
                <Button
                  disabled={transaction.status != 'INITIATED'}
                  onClick={(e) => {
                    if (!transaction.id) return

                    e.preventDefault()
                    toast.promise(
                      cancelAutoRescueMutation({
                        variables: {
                          transactionId: transaction.id,
                        },
                      }),
                      {
                        loading: 'Cancelling auto rescue',
                        success: ({ data: response }) => {
                          if (!response?.cancelAutoRescue) return null

                          return 'Auto rescue canceled'
                        },
                        error: 'Could not cancel auto rescue',
                      },
                    )
                  }}
                >
                  Cancel Auto-Rescue
                </Button>
              </PaymentColumn>
            </TableRowColored>
          )
        })}
      </TableBody>
    </PaymentTable>
  )
}

export const PaymentsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const {
    data: memberData,
    loading,
    error,
    refetch,
  } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
    fetchPolicy: 'no-cache',
  })

  const [chargeMemberOutstandingBalanceMutation] = useMutation(
    CHARGE_MEMBER_MUTATION,
  )

  const [createPaymentCompletionLink] = useCreatePaymentCompletionLinkMutation({
    variables: { memberId },
  })

  const [accountBreakDown] = useGetMasterLedgerBreakdown(memberId)

  const { confirm } = useConfirmDialog()

  const handleChargeSubmit = () => {
    if (!accountBreakDown?.masterLedgerBreakdown?.outstandingAmountBreakdown) {
      return
    }

    const outstandingAmountBreakdown =
      accountBreakDown?.masterLedgerBreakdown?.outstandingAmountBreakdown

    const chargeAmount = {
      amount: outstandingAmountBreakdown.amount,
      currency: outstandingAmountBreakdown.currency,
    }

    confirm(
      `Are you sure you want to charge ${formatMoney(chargeAmount)}?`,
    ).then(() => {
      toast
        .promise(
          chargeMemberOutstandingBalanceMutation({
            variables: {
              memberId: memberId,
            },
          }),
          {
            loading: 'Charging member',
            success: 'Member charged',
            error: 'Could not charge member',
          },
        )
        .then(() => refetch())
    })
  }

  if (error) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Something went wrong
      </StandaloneMessage>
    )
  }

  if (loading || !memberData?.member || !accountBreakDown) {
    return <LoadingMessage paddingTop="10vh" />
  }

  const currentBalance = accountBreakDown?.masterLedgerBreakdown
    ?.outstandingAmountBreakdown && {
    amount:
      accountBreakDown.masterLedgerBreakdown.outstandingAmountBreakdown.amount,
    currency:
      accountBreakDown.masterLedgerBreakdown.outstandingAmountBreakdown
        .currency,
  }

  return (
    <>
      <MainHeadline>Payments</MainHeadline>
      <CardsWrapper>
        <Card span={1.5}>
          <InfoRow>
            Direct debit
            <InfoText>
              <InfoTag
                style={{ fontWeight: 'bold', padding: '0.2em 0.7em' }}
                status={
                  memberData?.member?.directDebitStatus?.activated
                    ? 'success'
                    : 'danger'
                }
              >
                {memberData?.member?.directDebitStatus?.activated
                  ? 'Activated'
                  : 'Not Activated'}
              </InfoTag>
            </InfoText>
          </InfoRow>
          <InfoRow>
            Payout method
            <InfoText>
              <InfoTag
                style={{ fontWeight: 'bold', padding: '0.2em 0.7em' }}
                status={
                  memberData?.member?.directDebitStatus?.activated
                    ? 'success'
                    : 'danger'
                }
              >
                {memberData?.member?.directDebitStatus?.activated
                  ? 'Activated'
                  : 'Not Activated'}
              </InfoTag>
            </InfoText>
          </InfoRow>
          {memberData.member?.adyenShopperReference && (
            <InfoRow>
              Adyen shopper reference
              <InfoText>
                <Copyable iconValue={memberData.member.adyenShopperReference} />
              </InfoText>
            </InfoRow>
          )}
        </Card>
        <Card span={3}>
          <ThirdLevelHeadline>Payments Link</ThirdLevelHeadline>
          <Button
            onClick={(e) => {
              e.preventDefault()
              toast.promise(Promise.resolve(), {
                loading: 'Generating payment link...',
                success: () => {
                  copy(`${process.env.NEXT_PUBLIC_HEDVIG_APP}/payments`, {
                    format: 'text/plain',
                  })
                  return 'Payments page link copied to clipboard'
                },
                error: 'Could not generate payment link',
              })
            }}
          >
            Copy payments page link
          </Button>
          <SmallTopSpacing />
          <Button
            onClick={(e) => {
              e.preventDefault()
              toast.promise(createPaymentCompletionLink(), {
                loading: 'Generating payment link...',
                success: ({ data: response }) => {
                  if (!response?.createPaymentCompletionLink?.url) {
                    return null
                  }

                  copy(response?.createPaymentCompletionLink?.url, {
                    format: 'text/plain',
                  })

                  return 'Payment link copied to clipboard'
                },
                error: 'Could not generate payment link',
              })
            }}
          >
            Generate payments link
          </Button>
        </Card>

        {memberData.member?.directDebitStatus?.activated && currentBalance && (
          <Card>
            <ThirdLevelHeadline>Charge current balance</ThirdLevelHeadline>
            {Number(currentBalance.amount) > 0.0 ? (
              <Button onClick={() => handleChargeSubmit()}>
                Charge {formatMoney(currentBalance)}
              </Button>
            ) : (
              <ChargeNotAvailableMessage opacity={0.6}>
                Not available since the balance is{' '}
                <Shadowed style={{ fontWeight: 'bold' }}>
                  {formatMoney(currentBalance)}
                </Shadowed>
              </ChargeNotAvailableMessage>
            )}
          </Card>
        )}
        {memberData.member.payoutMethodStatus?.activated &&
          memberData.member.contractMarketInfo?.market === Market.Sweden && (
            <Card>
              <ThirdLevelHeadline>Payout</ThirdLevelHeadline>
              <PayoutDetails memberId={memberId} />
            </Card>
          )}
        <Card>
          <ThirdLevelHeadline>Transactions</ThirdLevelHeadline>
          <MemberTransactionsTable memberId={memberId} />
        </Card>
      </CardsWrapper>
    </>
  )
}
