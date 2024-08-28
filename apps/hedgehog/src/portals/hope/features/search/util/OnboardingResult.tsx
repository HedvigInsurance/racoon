import styled from '@emotion/styled'
import { Button, Flex, Label, Loadable, Placeholder } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { convertEnumOrSentenceToTitle, convertEnumToTitle } from '@hedvig-ui'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import { formatDate } from 'date-fns/format'
import gql from 'graphql-tag'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Quote,
  useBypassUnderwritingGuidelinesMutation,
} from 'types/generated/graphql'

const Wrapper = styled.div`
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  padding: 2rem;
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).brighten(3).hex()};
  max-width: 60rem;

  .onboarding-id {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .full-name {
    font-size: 1.5rem;
  }

  .quote-row {
    padding: 0 0.75rem;
    margin-bottom: 1.5rem;

    :last-of-type {
      margin-bottom: 0.5rem;
    }

    :first-of-type {
      margin-top: 0.5rem;
    }
  }

  .quotes {
    padding: 0.5rem 0;
    font-size: 1.1rem;
    margin-top: 1.5rem;

    border-top: 1px solid
      ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3).hex()};
    border-bottom: 1px solid
      ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3).hex()};
  }

  .quote-product-type {
    font-size: 1.1rem;

    color: ${({ theme }) => theme.semiStrongForeground};
  }
`

const SmallLabel = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(1).hex()};
`

const BreachedGuidelineTag = styled.div`
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) => theme.danger};
  padding: 0.25rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
`

gql`
  mutation BypassUnderwritingGuidelines($quoteIds: [ID!]!) {
    bypassUnderwritingGuidelines(quoteIds: $quoteIds) {
      id
      underwritingGuidelinesBypassed
    }
  }
`

const QuoteResultRow: React.FC<{
  quote: Quote
}> = ({ quote }) => {
  const price = quote?.price
  const currency = quote?.currency
  const productType = quote?.productType
  const breachedGuidelines = quote?.breachedUnderwritingGuidelines ?? []
  const subType = quote?.schemaData?.subType
    ? quote.schemaData.subType
    : quote?.schemaData?.isStudent
      ? 'Student'
      : quote?.schemaData?.isYouth
        ? 'Youth'
        : quote?.schemaData?.isStudent != null ||
            quote?.schemaData?.isYouth != null
          ? 'Regular'
          : null
  const registrationNumber = quote?.schemaData?.registrationNumber

  return (
    <>
      <Flex className="quote-row">
        <Flex direction="column">
          <SmallLabel>Product type</SmallLabel>
          <Flex>
            {productType ? (
              convertEnumOrSentenceToTitle(productType)
            ) : (
              <Placeholder>No product type</Placeholder>
            )}
          </Flex>
          {subType != null && (
            <Flex>
              <Label>{convertEnumToTitle(subType)}</Label>
            </Flex>
          )}
        </Flex>
        {registrationNumber && (
          <Flex direction="column" justify="flex-end">
            <SmallLabel>Registration number</SmallLabel>
            <Flex>{registrationNumber.toUpperCase()}</Flex>
          </Flex>
        )}
        <Flex direction="column" justify="flex-end">
          <SmallLabel>Breached guidelines</SmallLabel>
          <Flex>
            {breachedGuidelines.length !== 0 ? (
              breachedGuidelines.map((guideline) => (
                <BreachedGuidelineTag key={guideline + quote.id}>
                  {convertEnumToTitle(guideline)}
                </BreachedGuidelineTag>
              ))
            ) : (
              <Placeholder>None</Placeholder>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" align="flex-end">
          <SmallLabel>Price</SmallLabel>
          <Flex justify="flex-end">
            <Loadable loading={!price || !currency}>
              {price ?? '123'} {currency ?? 'ABC'}
            </Loadable>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export const OnboardingResult: React.FC<{
  quotes: Quote[]
  id: string
  fullName?: string | null
  ssn?: string | null
  email?: string | null
  memberId?: string | null
  offerPageUrl?: string | null
}> = ({ quotes, id, fullName, ssn, email, memberId, offerPageUrl }) => {
  const [bypassQuotes] = useBypassUnderwritingGuidelinesMutation()
  const { confirm } = useConfirmDialog()

  const firstQuotePreview = quotes[0]
  const firstQuote = quotes?.at(0)

  const createdAt = firstQuote?.createdAt
  const state = firstQuote?.state
  const numberCoInsured = firstQuote?.schemaData?.numberCoInsured

  const hasBypassedUwgl = quotes?.every(
    (quote) => quote.underwritingGuidelinesBypassed,
  )

  const geoInfo = [
    firstQuotePreview?.schemaData['street'],
    firstQuotePreview?.schemaData['city'],
    firstQuotePreview?.schemaData['postalCode'],
  ].filter((q) => !!q)

  return (
    <Wrapper>
      <Flex align="center" justify="space-between">
        <Flex direction="column">
          <div className="onboarding-id">{id}</div>
          <div className="full-name">
            {fullName ?? <Placeholder>Name not available</Placeholder>}
          </div>
          <div>{ssn ?? <Placeholder>SSN not available</Placeholder>}</div>
          <div>{email ?? <Placeholder>Email not available</Placeholder>}</div>
          <div>
            {memberId ? (
              <a href={`/members/${memberId}`}>{memberId}</a>
            ) : (
              <Placeholder>New member</Placeholder>
            )}
          </div>
        </Flex>
        <Button
          disabled={!firstQuote}
          variant={hasBypassedUwgl ? 'tertiary' : 'secondary'}
          onClick={() => {
            if (hasBypassedUwgl && firstQuote && offerPageUrl) {
              copy(offerPageUrl)
              toast.success('Copied offer page link')
              return
            }
            confirm(
              'Are you sure you want to allow the member to sign these quotes?',
            ).then(() => {
              toast.promise(
                bypassQuotes({
                  variables: {
                    quoteIds: quotes.map((quote) => quote.id),
                  },
                  optimisticResponse: {
                    bypassUnderwritingGuidelines: quotes.map((quote) => ({
                      id: quote.id,
                      underwritingGuidelinesBypassed: true,
                      __typename: 'Quote',
                    })),
                  },
                }),
                {
                  success:
                    'Quotes signable, please send the link to the member',
                  loading: 'Making quotes signable',
                  error: 'Unable to make quotes signable',
                },
              )
            })
          }}
        >
          {hasBypassedUwgl
            ? 'Copy offer link'
            : 'Exempt quotes from guidelines'}
        </Button>
      </Flex>
      <Flex className="quotes" direction="column" fullWidth>
        {quotes.map((quote) => (
          <QuoteResultRow key={quote.id} quote={quote} />
        ))}
      </Flex>
      <Flex
        style={{ marginTop: '1rem', padding: '0 0.75rem' }}
        justify="space-between"
      >
        <Flex direction="column" align="flex-start" style={{ minWidth: '50%' }}>
          <SmallLabel>Address</SmallLabel>
          {geoInfo.length !== 0 ? (
            <div>{geoInfo.join(', ')}</div>
          ) : (
            <Placeholder>Not available</Placeholder>
          )}
          {numberCoInsured != null && (
            <Label>{numberCoInsured} co-insured</Label>
          )}
        </Flex>
        <Flex justify="flex-end">
          <Flex
            direction="column"
            style={{
              marginLeft: '2rem',
              marginRight: '2rem',
            }}
          >
            <SmallLabel>Created at</SmallLabel>
            {createdAt ? (
              <div>{formatDate(new Date(createdAt), 'yyyy-MM-dd')}</div>
            ) : (
              <Placeholder>Not available</Placeholder>
            )}
          </Flex>
          <Flex direction="column" align="flex-end">
            <SmallLabel>State</SmallLabel>
            {state ? (
              <div>{convertEnumOrSentenceToTitle(state)}</div>
            ) : (
              <Placeholder>Not available</Placeholder>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Wrapper>
  )
}
