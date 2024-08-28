import gql from 'graphql-tag'
import { Market, MarketLanguage } from '@hope/features/config/constants'
import * as React from 'react'
import {
  QuoteCartSearchHit,
  useQuoteCartSearchQuotesQuery,
} from 'types/generated/graphql'
import { OnboardingResult } from '@hope/features/search/util/OnboardingResult'

gql`
  query QuoteCartSearchQuotes($quoteIds: [String!]!) {
    quotes(ids: $quoteIds) {
      id
      market
      price
      currency
      createdAt
      state
      productType
      breachedUnderwritingGuidelines
      underwritingGuidelinesBypassed
      schemaData
    }
  }
`

export const QuoteCartResult: React.FC<{ quoteCart: QuoteCartSearchHit }> = ({
  quoteCart: { id, quotes },
}) => {
  const { data } = useQuoteCartSearchQuotesQuery({
    variables: { quoteIds: quotes.map((quote) => quote.id) },
    fetchPolicy: 'cache-first',
  })

  const firstQuotePreview = quotes[0]
  const firstQuote = data?.quotes?.at(0)

  const fullName = firstQuotePreview?.fullName
  const ssn = firstQuotePreview?.ssn
  const memberId = firstQuotePreview?.memberId

  const onboardingUrl = process.env.NEXT_PUBLIC_HEDVIG_COM

  return data?.quotes ? (
    <OnboardingResult
      quotes={data.quotes}
      id={id}
      ssn={ssn}
      email={null}
      fullName={fullName}
      memberId={memberId}
      offerPageUrl={
        firstQuote
          ? `${onboardingUrl}/${
              MarketLanguage[firstQuote.market as Market]
            }/new-member/offer/${id}`
          : null
      }
    />
  ) : (
    <></>
  )
}
