import { Button, Spacing } from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  GetContractsDocument,
  MemberQuotesDocument,
  Quote,
  useSignQuoteForNewContractMutation,
} from 'types/generated/graphql'

export const QuoteContractCreation: React.FC<{
  quote: Quote
  memberId: string
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = ({ quote, memberId, onSubmitted = () => void 0 }) => {
  const [signQuote, setSignQuoteMutation] = useSignQuoteForNewContractMutation()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          setSignQuoteMutation.loading ||
          !confirm('Are you sure you want to create a new contract?')
        ) {
          return
        }
        await toast.promise(
          signQuote({
            variables: {
              quoteId: quote.id,
            },
            refetchQueries: [
              {
                query: MemberQuotesDocument,
                variables: { memberId },
              },
              {
                query: GetContractsDocument,
                variables: { memberId },
              },
            ],
          }),
          {
            loading: 'Creating contract',
            success: 'Contract created',
            error: 'Could not create contract',
          },
        )
        if (onSubmitted) {
          onSubmitted()
        }
      }}
    >
      <div style={{ padding: '1rem' }}>
        <Spacing bottom="small" />
        {!setSignQuoteMutation.data?.signQuoteForNewContract ? (
          <Button type="submit" disabled={setSignQuoteMutation.loading}>
            Create contract
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault()
              window.location.reload()
            }}
          >
            Reload
          </Button>
        )}
      </div>
    </form>
  )
}
