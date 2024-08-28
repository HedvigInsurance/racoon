import styled from '@emotion/styled'
import {
  Button,
  CardContent,
  CardTitle,
  convertEnumToSentence,
  convertEnumToTitle,
  extractErrorMessage,
  InfoTag,
  Input,
  Select,
  Spacing,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  useConfirmDialog,
} from '@hedvig-ui'
import {
  LiabilityLevel,
  LiabilityLevelText,
  LiabilityLevelValue,
  PaymentOrderState,
} from '@hope/features/config/constants'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  SubclaimRecoveryFragment,
  useAddSubclaimRecoveryMutation,
} from 'types/generated/graphql'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { SettleModal } from '@hope/features/claims/claim-details/SubclaimRecovery/SettleModal'

const Column = styled(TableColumn)`
  font-size: 14px;
`

const FieldsTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.5rem;
`

const Hints = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  margin-top: 0.5rem;

  & span {
    color: ${({ theme }) => theme.accent};
    font-size: 12px;
    letter-spacing: 0.05rem;
    opacity: 0.5;

    &:hover {
      opacity: 1;
      color: ${({ theme }) => theme.foreground};
      cursor: pointer;
    }
  }
`

const calculateExpectedAmount = (
  liabilityLevel: LiabilityLevel,
  totalPayments: number,
) => {
  return Math.round(totalPayments * LiabilityLevelValue[liabilityLevel])
}

export const SubclaimRecoveryNew: React.FC<{
  subclaimId: string
}> = ({ subclaimId }) => {
  const { preferredCurrency, counterparties, getSubclaim } = useClaim()
  const { confirm } = useConfirmDialog()
  const [settleRecovery, setSettleRecovery] =
    useState<SubclaimRecoveryFragment | null>(null)
  const [addSubclaimRecovery] = useAddSubclaimRecoveryMutation()
  const subclaim = getSubclaim(subclaimId)
  const payments =
    subclaim?.paymentOrders
      ?.filter(({ state }) => state === PaymentOrderState.Settled)
      .map((payment) => +payment?.amount?.amount) ?? []
  const totalPaymentAmount = payments.reduce((acc, amount) => acc + amount, 0)

  const recoveries = subclaim?.recoveries ?? []

  const { register, handleSubmit, watch, setValue } = useForm<{
    liableCounterpartyId: string
    expectedAmount: number
    note: string
  }>()

  const liableCounterparty = counterparties?.find(
    (counterparty) => counterparty.id === watch('liableCounterpartyId'),
  )

  useEffect(() => {
    if (!liableCounterparty?.liabilityLevel) return
    setValue(
      'expectedAmount',
      calculateExpectedAmount(
        liableCounterparty.liabilityLevel as LiabilityLevel,
        totalPaymentAmount,
      ),
    )
  }, [setValue, totalPaymentAmount, liableCounterparty])

  const submitHandler = async ({
    liableCounterpartyId,
    expectedAmount,
    note,
  }: FieldValues) => {
    await confirm(
      `Are you sure you want to create a recovery of amount ${expectedAmount} ${preferredCurrency} towards ${liableCounterparty?.reference}?
      \nNote: No further payments will be available if a recovery is added`,
    )

    await toast.promise(
      addSubclaimRecovery({
        variables: {
          subclaimId,
          request: {
            amount: {
              amount: expectedAmount,
              currency: preferredCurrency!,
            },
            liableCounterpartyId,
            note,
          },
        },
      }),
      {
        loading: 'Creating recovery...',
        success: 'Recovery created',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  if (!preferredCurrency) return null

  if (payments.length === 0) {
    return (
      <StandaloneMessage>
        Unable to add a recovery without any settled payments
      </StandaloneMessage>
    )
  }

  if (!counterparties?.length) {
    return (
      <StandaloneMessage>
        Unable to add a recovery without a counterparty
      </StandaloneMessage>
    )
  }

  return (
    <CardContent>
      <CardTitle title={convertEnumToSentence(subclaim!.type!)} />
      <Spacing top="small" />
      <>
        <Table>
          <TableHeader>
            <TableHeaderColumn>Counterparty</TableHeaderColumn>
            <TableHeaderColumn>Insurance provider</TableHeaderColumn>
            <TableHeaderColumn>Expected amount</TableHeaderColumn>
            <TableHeaderColumn>Settled amount</TableHeaderColumn>
            <TableHeaderColumn>Settled date</TableHeaderColumn>
            <TableHeaderColumn>Invoice No.</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {recoveries.map((recovery) => (
              <TableRow key={recovery.id}>
                <Column>{recovery.liableCounterparty.reference}</Column>
                <Column>
                  {convertEnumToTitle(
                    recovery.liableCounterparty.insuranceProvider?.id ?? '-',
                  )}
                </Column>
                <Column>{recovery.expectedAmount.amount}</Column>
                <Column>{recovery.settledAmount?.amount || '-'}</Column>
                <Column>{recovery.paymentDate || '-'}</Column>
                <Column>-</Column>
                <Column>
                  {recovery?.settledAmount ? (
                    <InfoTag>Settled</InfoTag>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => setSettleRecovery(recovery)}
                    >
                      Settle
                    </Button>
                  )}
                </Column>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Spacing top="small" />
      </>
      {preferredCurrency ? (
        <form onSubmit={handleSubmit(submitHandler)}>
          <FieldsTop>
            <Select
              {...register('liableCounterpartyId')}
              label={'Liable counterparty'}
              defaultValue="not_specified"
              options={[
                {
                  value: 'not_specified',
                  text: 'Not specified',
                },

                ...counterparties.map((counterparty) => ({
                  text: `${counterparty.reference} - ${
                    !counterparty?.liabilityLevel
                      ? '⚠️ No liability level'
                      : LiabilityLevelText[
                          counterparty?.liabilityLevel as LiabilityLevel
                        ]
                  }`,
                  value: counterparty.id,
                })),
              ]}
            />
            <Input
              {...register('expectedAmount')}
              label="Expected amount"
              type="number"
              placeholder="Expected Amount"
              step="any"
              affix={{ content: preferredCurrency }}
            />
          </FieldsTop>
          <Hints>
            {Object.values(LiabilityLevel).map((liabilityLevel) => {
              return (
                <span
                  key={liabilityLevel}
                  onClick={() => {
                    setValue(
                      'expectedAmount',
                      calculateExpectedAmount(
                        liabilityLevel,
                        totalPaymentAmount,
                      ),
                    )
                  }}
                  style={
                    liabilityLevel === liableCounterparty?.liabilityLevel
                      ? { opacity: 1, fontWeight: 'bold' }
                      : {}
                  }
                >
                  {LiabilityLevelText[liabilityLevel as LiabilityLevel]}
                </span>
              )
            })}
          </Hints>
          <Spacing top="small" />
          <Input {...register('note')} placeholder="Note" />
          <Spacing top="small" />
          <div style={{ fontSize: 12, margin: '2rem 0 1rem 0' }}>
            Note: No further payments will be available if a recovery is added
          </div>
          <Button
            disabled={
              !watch('liableCounterpartyId') || !watch('expectedAmount')
            }
          >
            Add recovery
          </Button>
        </form>
      ) : (
        <StandaloneMessage>
          Something went wrong fetching this member's currency
        </StandaloneMessage>
      )}
      {settleRecovery && (
        <SettleModal
          recovery={settleRecovery}
          onClose={() => setSettleRecovery(null)}
          visible={true}
        />
      )}
    </CardContent>
  )
}
