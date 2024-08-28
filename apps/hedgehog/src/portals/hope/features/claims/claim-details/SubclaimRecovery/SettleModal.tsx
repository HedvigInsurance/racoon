import { format } from 'date-fns'
import { useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  Input,
  Modal,
  ModalProps,
  TextDatePicker,
} from '@hedvig-ui'
import gql from 'graphql-tag'
import chroma from 'chroma-js'
import { FieldValues, useForm } from 'react-hook-form'
import {
  SubclaimRecoveryFragment,
  useSettleRecoveryMutation,
} from 'types/generated/graphql'
import toast from 'react-hot-toast'

gql`
  mutation SettleRecovery($recoveryId: ID!, $request: SettleRecoveryInput!) {
    recovery_settle(recoveryId: $recoveryId, request: $request) {
      id
      settledAmount {
        amount
        currency
      }
      paymentDate
      note
    }
  }
`

const Form = styled.form`
  width: 27rem;

  padding: 20px 20px 25px 20px;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & p {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(0.5).hex()};
  }
`

export const SettleModal: React.FC<
  ModalProps & { recovery: SubclaimRecoveryFragment }
> = ({ recovery, onClose, ...props }) => {
  const [addRecoverySettle] = useSettleRecoveryMutation()
  const [paymentDate, setPaymentDate] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd'),
  )

  const { register, watch, handleSubmit } = useForm<{
    amount: number
    note: string
  }>({
    defaultValues: {
      amount: +recovery.expectedAmount.amount,
    },
  })

  const submitHandler = async ({ amount, note }: FieldValues) => {
    if (amount === undefined || !paymentDate) {
      return
    }

    await toast.promise(
      addRecoverySettle({
        variables: {
          recoveryId: recovery.id,
          request: {
            amount: {
              amount: +amount,
              currency: recovery.expectedAmount.currency,
            },
            note,
            paymentDate,
          },
        },
      }),
      {
        loading: 'Settling recovery...',
        success: () => {
          onClose()
          return 'Success!'
        },
        error: 'Error while settling recovery...',
      },
    )
  }

  return (
    <Modal onClose={onClose} {...props}>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <p style={{ marginBottom: 0 }}>
          To mark the recovery as settled, <br />
          Please enter the following:
        </p>
        <Input
          {...register('amount')}
          type="number"
          affix={{ content: recovery.expectedAmount.currency }}
          placeholder="Not specified"
          label="Settled amount"
        />
        <div style={{ fontSize: '1rem' }}>
          {+watch('amount') > +recovery.expectedAmount.amount &&
            `Be aware that the amount is larger than the expected amount (${recovery.expectedAmount.amount})`}
        </div>
        <TextDatePicker
          value={paymentDate}
          maxDate={new Date()}
          onChange={setPaymentDate}
          label="Payment received at date"
          position="right"
        />
        <Input label="Note (optional)" {...register('note')} />
        <ButtonsGroup style={{ marginTop: '0.5rem' }}>
          <Button type="submit" disabled={!watch('amount') || !paymentDate}>
            Confirm
          </Button>
          <Button type="button" variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
        </ButtonsGroup>
      </Form>
    </Modal>
  )
}
