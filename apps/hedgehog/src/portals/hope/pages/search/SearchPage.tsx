import styled from '@emotion/styled'
import { useSearchParamsState } from '@hedvig-ui'
import { QuoteCartSearch } from '@hope/features/search/carts/QuoteCartSearch'
import { MemberSearch } from '@hope/features/search/members/MemberSearch'
import { QuoteSearch } from '@hope/features/search/quotes/QuoteSearch'
import * as React from 'react'
import { useParams } from 'react-router'
import { ShopSessionSearch } from '@hope/features/search/shopSessions/ShopSessionSearch'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-x: hidden;
`

const SearchPage: React.FC = () => {
  const { category = 'members' } = useParams<{ category?: string }>()

  const [query] = useSearchParamsState('query', '')

  return (
    <Wrapper>
      {category === 'quotes' && <QuoteSearch query={query} />}
      {category === 'members' && <MemberSearch query={query} />}
      {category === 'carts' && <QuoteCartSearch query={query} />}
      {category === 'shop_sessions' && <ShopSessionSearch query={query} />}
    </Wrapper>
  )
}

export default SearchPage
