import { Input } from '@hedvig-ui/redesign'
import { useState } from 'react'
import { PaymentOrderRecipientSuggestionsNew } from './PaymentOrderRecipientSuggestionsNew'
import { PaymentOrderRecipientFragment } from 'types/generated/graphql'

export const AutoCompleteRecipient = ({
  defaultRecipient,
  onSelectRecipient,
}: {
  defaultRecipient: PaymentOrderRecipientFragment
  onSelectRecipient: (recipient: PaymentOrderRecipientFragment) => void
}) => {
  const [recipientSearchString, setRecipientSearchString] = useState(
    defaultRecipient.recipientName,
  )
  const [showRecipientSuggestions, setShowRecipientSuggestions] =
    useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <Input
        label="Recipient name"
        type="text"
        name="recipientName"
        required={true}
        value={recipientSearchString}
        onChange={(e) => setRecipientSearchString(e.target.value)}
        onFocus={() => setShowRecipientSuggestions(true)}
      />

      {showRecipientSuggestions && (
        <PaymentOrderRecipientSuggestionsNew
          searchString={recipientSearchString}
          onClose={() => setShowRecipientSuggestions(false)}
          onSelect={(recipient) => {
            onSelectRecipient(recipient)
            setShowRecipientSuggestions(false)
            setRecipientSearchString(recipient.recipientName)
          }}
        />
      )}
    </div>
  )
}
