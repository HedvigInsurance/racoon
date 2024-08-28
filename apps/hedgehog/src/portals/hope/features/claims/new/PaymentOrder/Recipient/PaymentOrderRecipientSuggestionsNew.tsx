import {
  convertEnumToTitle,
  Spinner,
  useClickOutside,
  useDebounce,
} from '@hedvig-ui'
import {
  PaymentOrderRecipientFragment,
  useSearchPaymentOrderRecipientsQuery,
} from 'types/generated/graphql'
import { Flex } from '@hedvig-ui/redesign'
import { wrapper, suggestionRow, muted } from './RecipientSuggestions.css'
import { useRef } from 'react'

type Props = {
  searchString: string
  onClose: () => void
  onSelect: (recipient: PaymentOrderRecipientFragment) => void
}

export const PaymentOrderRecipientSuggestionsNew = (props: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapperRef, props.onClose)

  const debouncedSearchString = useDebounce(props.searchString, 400)
  const { data, loading } = useSearchPaymentOrderRecipientsQuery({
    variables: { input: { recipientName: debouncedSearchString } },
  })
  const suggestions = data?.paymentOrderRecipients ?? []

  if (!suggestions.length && !loading) {
    return null
  }

  return (
    <div className={wrapper} ref={wrapperRef}>
      {loading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : (
        suggestions.map((suggestion) => (
          <div
            className={suggestionRow}
            key={`${suggestion.method}${suggestion.recipientName}${suggestion.bankName}`}
            onClick={() => props.onSelect(suggestion)}
          >
            <div>
              <div>{suggestion.recipientName}</div>
              <span className={muted}>
                {convertEnumToTitle(suggestion.method)}
              </span>
            </div>
            <Flex
              direction="column"
              align="flex-end"
              style={{ width: 'max-content' }}
            >
              <span className={muted}>{suggestion.bankName}</span>
              <span className={muted}>{suggestion.number}</span>
              <span className={muted}>{suggestion.bic}</span>
            </Flex>
          </div>
        ))
      )}
    </div>
  )
}
