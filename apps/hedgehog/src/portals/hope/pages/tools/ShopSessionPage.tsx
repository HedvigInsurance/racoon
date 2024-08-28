import { Button, Flex, Input, MainHeadline, PrettyPrintJSON } from '@hedvig-ui'
import { useState } from 'react'
import styled from '@emotion/styled'
import gql from 'graphql-tag'
import { useShopSessionLazyQuery } from 'types/generated/graphql'

const Wrapper = styled.div`
  padding: 2rem;
`

gql`
  query ShopSession($shopSessionId: ID!) {
    shopSession(shopSessionId: $shopSessionId) {
      id
      countryCode
      customer {
        email
        firstName
        lastName
        memberId
        ssn
      }
      quotes {
        id
        attributedTo
        breachedUnderwritingGuidelines
        createdAt
        currency
        currentInsurer
        initiatedFrom
        isComplete
        isReadyToSign
        market
        memberId
        originatingProductId
        price
        productType
        schema
        schemaData
        signedAt
        signedProductId
        startDate
        state
        underwritingGuidelinesBypassed
        validity
      }
    }
  }
`

export default function ShopSessionsPage() {
  const [shopSessionId, setShopSessionId] = useState('')
  const [searchShopSession, { data }] = useShopSessionLazyQuery({
    fetchPolicy: 'network-only',
  })

  const handleSearch = () => {
    searchShopSession({ variables: { shopSessionId } })
  }

  return (
    <Wrapper>
      <MainHeadline>🛒 Shop Sessions</MainHeadline>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        <Flex direction="row" style={{ marginTop: '2rem' }}>
          <div style={{ marginRight: '1rem' }}>
            <Input
              value={shopSessionId}
              onChange={(e) => setShopSessionId(e.currentTarget.value)}
              placeholder="Shop session ID"
              style={{ width: '20rem' }}
            />
          </div>
          <Button type="submit">Search</Button>
        </Flex>
      </form>
      {!!data?.shopSession && (
        <PrettyPrintJSON
          name="Shop Session"
          collapsed={false}
          obj={data.shopSession}
        />
      )}
    </Wrapper>
  )
}
