import styled from '@emotion/styled'
import {
  Button,
  StandaloneMessage,
  ThirdLevelHeadline,
  useConfirmDialog,
} from '@hedvig-ui'
import { useMemberQuotes } from '@hope/features/member/tabs/quote-tab/hooks/use-member-quotes'
import { isExpired } from '@hope/features/member/tabs/quote-tab/utils'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  GenericAgreement,
  GetContractsDocument,
  MemberQuotesDocument,
  useCreateQuoteFromAgreementMutation,
} from 'types/generated/graphql'
import { atStartOfDay } from '@hope/features/member/tabs/contracts-tab/agreement/helpers'
import { getOriginatingAgreementPeriod } from '@hope/features/contracts/utils'

const QuoteMessage = styled(StandaloneMessage)`
  font-size: 1.1rem;
`

export const CreateQuoteFromAgreement: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [createQuote] = useCreateQuoteFromAgreementMutation()
  const [{ quotes }, { loading: loadingQuotes }] = useMemberQuotes(
    contract.holderMember.memberId,
  )
  const { confirm, confirmWithValue } = useConfirmDialog()

  if (loadingQuotes) {
    return null
  }

  if (!quotes) {
    return (
      <>
        <ThirdLevelHeadline>Create Quote</ThirdLevelHeadline>
        <QuoteMessage>Failed to retrieve quotes</QuoteMessage>
      </>
    )
  }

  const quoteAlreadyExists = quotes
    .filter(
      (quote) =>
        quote.state === 'QUOTED' &&
        !isExpired(quote) &&
        quote.initiatedFrom !== 'RENEWAL',
    )
    .map((quote) => quote.originatingProductId)
    .includes(agreement.id)

  const isNotActiveAgreement =
    agreement.toDate &&
    atStartOfDay(new Date(agreement.toDate)) < atStartOfDay(new Date())
  const isContractTerminatedBeforeToday =
    contract.terminationDate &&
    atStartOfDay(new Date(contract.terminationDate)) < atStartOfDay(new Date())

  const createQuoteHandler = () => {
    const [minDate, maxDate] = getOriginatingAgreementPeriod(
      agreement,
      contract,
    )

    if (agreement.fromDate !== null) {
      confirmWithValue({
        content: `Create new mid-term change quote?`,
        values: {
          startDate: {
            type: 'date',
            required: true,
            label: 'Start Date',
            min: minDate?.toString(),
            max: maxDate?.toString(),
          },
        },
      }).then((record: void | Record<string, string | boolean | undefined>) => {
        const startDate = record?.startDate as string

        toast.promise(
          createQuote({
            variables: {
              agreementId: agreement.id,
              memberId: contract.holderMember.memberId,
              startDate: startDate,
            },
            refetchQueries: [
              {
                query: MemberQuotesDocument,
                variables: { memberId: contract.holderMember.memberId },
              },
              {
                query: GetContractsDocument,
                variables: { memberId: contract.holderMember.memberId },
              },
            ],
          }),
          {
            loading: 'Creating quote',
            success: 'Quote created, find it under the quotes tab',
            error: 'Could not create quote',
          },
        )
      })
    } else {
      // For pending agreements we don't require a startDate
      confirm(`Create new mid-term change quote?`).then(() => {
        toast.promise(
          createQuote({
            variables: {
              agreementId: agreement.id,
              memberId: contract.holderMember.memberId,
            },
            refetchQueries: [
              {
                query: MemberQuotesDocument,
                variables: { memberId: contract.holderMember.memberId },
              },
              {
                query: GetContractsDocument,
                variables: { memberId: contract.holderMember.memberId },
              },
            ],
          }),
          {
            loading: 'Creating quote',
            success: 'Quote created, find it under the quotes tab',
            error: 'Could not create quote',
          },
        )
      })
    }
  }

  return (
    <>
      <ThirdLevelHeadline>Mid-term Change</ThirdLevelHeadline>
      <>
        {quoteAlreadyExists ? (
          <QuoteMessage>Agreement already has an existing quote</QuoteMessage>
        ) : (
          <Button
            disabled={
              contract.isLocked ||
              isNotActiveAgreement ||
              isContractTerminatedBeforeToday
            }
            onClick={createQuoteHandler}
          >
            Create a mid-term change
          </Button>
        )}
      </>
    </>
  )
}
