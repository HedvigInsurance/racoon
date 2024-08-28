import styled from '@emotion/styled'
import gql from 'graphql-tag'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Button,
  Dropdown,
  DropdownOption,
  Flex,
  Input,
  Label,
  MainHeadline,
  PrettyPrintJSON,
  Spacing,
  extractErrorMessage,
} from '@hedvig-ui'
import { useManualSasPayoutMutation } from 'types/generated/graphql'
import { formatDate } from 'date-fns/format'

gql`
  mutation ManualSasPayout($input: ManualSasPayoutInput!) {
    manualSasBonusPayout(input: $input) {
      memberId
      period
      points
      sasIdentifier
      type
    }
  }
`

const Wrapper = styled.div`
  padding: 2rem;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: max-content;
`

const SAS_PAYOUT_TYPES = {
  WELCOME: 'Welcome',
  PROMOTION: 'Promotion',
  MONTHLY: 'Monthly',
} as const
type SASPayoutType = keyof typeof SAS_PAYOUT_TYPES

const ManualSasPayoutPage = () => {
  const [manualSasPayoutMutation, { data, loading, error: responseError }] =
    useManualSasPayoutMutation()

  const [memberId, setMemberId] = useState('')
  const [type, setType] = useState<SASPayoutType>('WELCOME')
  const [period, setPeriod] = useState(formatDate(new Date(), 'yyyy-MM'))
  const [eligibleContractCount, setEligibleContractCount] = useState(1)

  const manualSasPayout = () => {
    const input = {
      memberId,
      type,
      ...(type === 'MONTHLY'
        ? {
            period,
            eligibleContractCount,
          }
        : {}),
    }
    toast.promise(manualSasPayoutMutation({ variables: { input } }), {
      loading: 'Performing payout',
      error: (error) => {
        return extractErrorMessage(error.message)
      },
      success: 'Payout performed',
    })
  }

  const errors = [
    ...(responseError?.graphQLErrors ?? []),
    ...(responseError?.clientErrors ?? []),
  ]

  return (
    <Wrapper>
      <MainHeadline>Manual SAS payout</MainHeadline>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault()
          manualSasPayout()
        }}
      >
        <Input
          label="Member id"
          placeholder="Enter member id..."
          value={memberId}
          onChange={({ target: { value } }) => setMemberId(value)}
        />
        <Flex direction="column">
          <Label>Type</Label>
          <Dropdown>
            {Object.entries(SAS_PAYOUT_TYPES).map(
              ([payoutType, displayName]) => (
                <DropdownOption
                  key={payoutType}
                  onClick={() => setType(payoutType as SASPayoutType)}
                  selected={type === payoutType}
                >
                  {displayName}
                </DropdownOption>
              ),
            )}
          </Dropdown>
        </Flex>

        {type === 'MONTHLY' && (
          <>
            <Input
              label="Period"
              type="month"
              placeholder="YYYY-MM"
              onChange={({ target: { value } }) => setPeriod(value)}
              value={period}
            />
            <Input
              label="Eligible contract count"
              type="number"
              onChange={({ target: { value } }) =>
                setEligibleContractCount(Number(value))
              }
              value={eligibleContractCount}
            />
          </>
        )}

        <Button disabled={loading} type="submit">
          Submit
        </Button>
      </StyledForm>

      <Spacing top="medium" />

      {!!data?.manualSasBonusPayout && (
        <PrettyPrintJSON
          name="Response"
          obj={data.manualSasBonusPayout}
          collapsed={false}
        />
      )}

      {!!errors.length && (
        <PrettyPrintJSON
          name={responseError?.name ?? 'Errors'}
          obj={errors}
          collapsed={false}
        />
      )}
    </Wrapper>
  )
}

export default ManualSasPayoutPage
