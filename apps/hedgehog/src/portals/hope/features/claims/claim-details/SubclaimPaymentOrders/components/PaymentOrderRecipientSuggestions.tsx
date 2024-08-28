import gql from 'graphql-tag'
import {
  convertEnumToTitle,
  Placeholder,
  Spinner,
  useDebounce,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import {
  PaymentOrderRecipientFragment,
  useSearchPaymentOrderRecipientsQuery,
} from 'types/generated/graphql'

gql`
  query SearchPaymentOrderRecipients(
    $input: SearchPaymentOrderRecipientsInput!
  ) {
    paymentOrderRecipients(input: $input) {
      ...PaymentOrderRecipient
    }
  }

  fragment PaymentOrderRecipient on PaymentOrderRecipient {
    method
    recipientType
    recipientName
    bankName
    number
    bic
  }
`

const Suggestion = styled.div`
  padding: ${({ theme }) => theme.spacing.tiny};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.tiny};

  &:hover {
    background-color: ${({ theme }) => theme.accentBackground};
  }
`

type Props = {
  searchString: string
  onSelect: (recipient: PaymentOrderRecipientFragment) => void
}

export const PaymentOrderRecipientSuggestions = (props: Props) => {
  const debouncedSearchString = useDebounce(props.searchString, 400)
  const { data, loading } = useSearchPaymentOrderRecipientsQuery({
    variables: { input: { recipientName: debouncedSearchString } },
  })
  const suggestions = data?.paymentOrderRecipients ?? []

  if (loading && !suggestions.length) {
    return <Spinner />
  }
  return (
    <div>
      {suggestions.map((suggestion) => (
        <Suggestion
          key={`${suggestion.method}${suggestion.recipientName}${suggestion.bankName}`}
          onClick={() => props.onSelect(suggestion)}
        >
          <div>
            <div>{suggestion.recipientName}</div>
            <Placeholder>{suggestion.number}</Placeholder>
            <Placeholder>{suggestion.bic}</Placeholder>
          </div>
          <Placeholder>
            <div>{suggestion.bankName}</div>
            <div>{convertEnumToTitle(suggestion.method)}</div>
          </Placeholder>
        </Suggestion>
      ))}
    </div>
  )
}
