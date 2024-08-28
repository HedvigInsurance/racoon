import { Button } from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  GenericAgreement,
  MemberQuotesDocument,
  useAddAgreementFromQuoteMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

gql`
  mutation AddAgreementFromQuote($id: ID!, $contractId: ID!) {
    addAgreementFromQuote(id: $id, contractId: $contractId) {
      id
    }
  }
`

export const QuoteActivation: React.FC<{
  quoteId: string
  contract: Contract
  agreement: GenericAgreement | undefined
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = ({ contract, agreement, quoteId, onSubmitted = () => void 0 }) => {
  const [addAgreement, addAgreementMutation] =
    useAddAgreementFromQuoteMutation()

  if (contract.hasPendingAgreement && contract.terminationDate) {
    return <>Cannot active quote for a pending contract that is terminated</>
  }

  const hasFutureAgreement =
    agreement?.toDate !== null && agreement!.toDate != contract.terminationDate

  return (
    <form
      style={{ padding: '0.5rem' }}
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          addAgreementMutation.loading ||
          (hasFutureAgreement &&
            !confirm(
              'Future agreement(s) exist!\n' +
                '(That will begin after this agreement that you are modifying now)\n\n' +
                'Remember to also make the corresponding change to them, if applicable. (Check with the member)',
            )) ||
          !confirm('Are you sure you want to activate?')
        ) {
          return
        }
        await toast.promise(
          addAgreement({
            variables: {
              id: quoteId,
              contractId: contract.id,
            },
            refetchQueries: [
              {
                query: MemberQuotesDocument,
                variables: { memberId: contract.holderMember.memberId },
              },
            ],
          }),
          {
            loading: 'Activating quote',
            success: 'Quote activated',
            error: 'Could not activate quote',
          },
        )

        if (onSubmitted) {
          onSubmitted()
        }
      }}
    >
      {contract.hasPendingAgreement && (
        <div>
          With a <strong>Pending</strong> contract, the current the{' '}
          <strong>Pending</strong> agreement will be replaced with this new
          pending agreement upon activation.
        </div>
      )}

      {hasFutureAgreement && (
        <div>
          <strong>Future agreements exist!</strong> <br /> (That will begin
          after this agreement that you are modifying now) <br />
          Remember to also make the corresponding change to them, if applicable.
          (Check with the member)
          <br />
          <br />
        </div>
      )}

      {!addAgreementMutation.data?.addAgreementFromQuote ? (
        <Button
          status="success"
          type="submit"
          disabled={addAgreementMutation.loading}
        >
          {contract.hasPendingAgreement ? 'Replace' : 'Activate'}
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
    </form>
  )
}
