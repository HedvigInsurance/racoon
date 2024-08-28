import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import {
  Button,
  extractErrorMessage,
  Input,
  Select,
  StandaloneMessage,
  useConfirmDialog,
} from '@hedvig-ui'
import * as React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  GetMemberTransactionsDocument,
  GetMemberTransactionsQuery,
  PayoutMemberMutation,
  usePayoutMemberMutation,
} from 'types/generated/graphql'
import { useContractMarketInfo } from '@hope/common/hooks/use-contract-market-info'
import styled from '@emotion/styled'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

const entryTypeOptions = [
  {
    key: 1,
    value: 'MARKETING',
    text: 'Marketing',
  },
  {
    key: 2,
    value: 'REFERRAL',
    text: 'Referral',
  },
  {
    key: 3,
    value: 'REFUND',
    text: 'Refund',
  },
]

export const PayoutDetails: React.FC<{ memberId: string }> = ({ memberId }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [payoutMember] = usePayoutMemberMutation()

  const { preferredCurrency } = useContractMarketInfo(memberId)

  const { confirm } = useConfirmDialog()

  const updateCache = (
    cache: ApolloCache<NormalizedCacheObject>,
    response: PayoutMemberMutation,
  ) => {
    const transaction = response?.payoutMember
    const cachedData = cache.readQuery({
      query: GetMemberTransactionsDocument,
      variables: { id: memberId },
    })

    const member = (cachedData as GetMemberTransactionsQuery).member
    const transactions = member?.transactions ?? []

    const newMember = {
      ...member,
      transactions: [...transactions, transaction],
    }

    cache.writeQuery({
      query: GetMemberTransactionsDocument,
      data: { member: newMember },
    })
  }

  const onSubmitHandler = async (data: FieldValues) => {
    const confirmMessage = `Are you sure you want to payout ${data.amount} ${preferredCurrency}?`

    await confirm(confirmMessage).then(() => {
      toast.promise(
        payoutMember({
          variables: {
            memberId,
            request: {
              amount: {
                amount: data.amount,
                currency: preferredCurrency!,
              },
              category: data.category,
              referenceId: data.referenceId,
              note: data.note,
            },
          },
          update: (
            cache: ApolloCache<NormalizedCacheObject>,
            { data: response },
          ) => {
            if (!response) {
              return
            }
            updateCache(cache, response)
          },
        }),
        {
          loading: 'Creating payout...',
          success: () => {
            reset()
            return 'Payout created'
          },
          error: (e) => {
            if (e.message.split(': ').includes('Payouts are restricted')) {
              return 'Payouts are restricted'
            }

            return extractErrorMessage(e.message)
          },
        },
      )
    })
  }

  if (!preferredCurrency) {
    return (
      <StandaloneMessage>
        Something went wrong fetching this member's currency
      </StandaloneMessage>
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmitHandler)}>
      <Select
        {...register('category', {
          required: 'Category is required',
        })}
        label="Category"
        options={entryTypeOptions}
        defaultValue=""
        errors={errors}
      />
      <Input
        {...register('amount', {
          required: 'Amount is required',
          pattern: {
            value: /[^0]/,
            message: 'Amount cannot be zero',
          },
        })}
        label="Payout amount"
        defaultValue=""
        type="number"
        affix={{
          content: preferredCurrency,
        }}
        errors={errors}
      />
      <Input
        {...register('referenceId', {
          required: 'Reference Id is required',
          maxLength: {
            value: 50,
            message: 'The reference is too long (max 50 characters)',
          },
        })}
        label="Reference Id"
        defaultValue=""
        errors={errors}
      />
      <Input {...register('note')} label="Note" defaultValue="" />

      <Button style={{ marginTop: '1rem' }} type="submit">
        Create payout
      </Button>
    </Form>
  )
}
