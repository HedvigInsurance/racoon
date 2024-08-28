import gql from 'graphql-tag'
import * as React from 'react'
import {
  ShopSessionSearchHit,
  useShopSessionSearchQuery,
} from 'types/generated/graphql'
import { OnboardingResult } from '@hope/features/search/util/OnboardingResult'

gql`
  query ShopSessionSearch($shopSessionId: ID!) {
    shopSession(shopSessionId: $shopSessionId) {
      id
      countryCode
      quotes {
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
  }
`

export const ShopSessionSearchResult: React.FC<{
  shopSession: ShopSessionSearchHit
}> = ({ shopSession }) => {
  const { data } = useShopSessionSearchQuery({
    variables: { shopSessionId: shopSession.id },
    fetchPolicy: 'cache-first',
  })

  const storeUrl = process.env.NEXT_PUBLIC_HEDVIG_COM

  return data?.shopSession?.quotes ? (
    <OnboardingResult
      quotes={data.shopSession.quotes}
      id={shopSession.id}
      ssn={shopSession.ssn}
      email={shopSession.email}
      fullName={shopSession.fullName}
      memberId={shopSession.memberId}
      offerPageUrl={`${storeUrl}/${data.shopSession.countryCode.toLowerCase()}/session/${
        shopSession.id
      }?next=/cart`}
    />
  ) : (
    <></>
  )
}
