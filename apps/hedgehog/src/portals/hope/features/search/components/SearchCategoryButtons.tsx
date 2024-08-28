import * as React from 'react'
import styled from '@emotion/styled'
import { convertEnumOrSentenceToTitle } from '@hedvig-ui'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'

const SearchCategoryButton = styled.button<{ selected?: boolean }>`
  border: none;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.accentLighter};
  transition: background-color 200ms;

  :hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.accent : theme.accentLight};
  }

  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.accent};
  font-size: 1rem;
  padding: 0.25rem 0.65rem;
  border-radius: 1rem;
  cursor: pointer;
`

const searchCategories = [
  'members',
  'quotes',
  'carts',
  'shop_sessions',
] as const
export type SearchCategory = (typeof searchCategories)[number]

export const SearchCategoryButtons: React.FC<{
  category: SearchCategory
  onChange: (category: SearchCategory) => void
}> = ({ category, onChange }) => {
  const { hasPermission: hasSearchMembersPermission } =
    useHasPermission('searchMembers')
  const { hasPermission: hasSearchQuotesPermission } =
    useHasPermission('searchQuotes')
  const { hasPermission: hasSearchCartsPermission } =
    useHasPermission('searchCarts')
  const { hasPermission: hasSearchShopSessionPermission } =
    useHasPermission('searchShopSessions')

  const filteredSearchCategories = searchCategories.filter((category) => {
    switch (category) {
      case 'members':
        return hasSearchMembersPermission
      case 'quotes':
        return hasSearchQuotesPermission
      case 'carts':
        return hasSearchCartsPermission
      case 'shop_sessions':
        return hasSearchShopSessionPermission
      default:
        return true
    }
  })

  return (
    <div>
      {filteredSearchCategories.map((searchCategory, index) => (
        <SearchCategoryButton
          key={searchCategory}
          onClick={() => onChange(searchCategory)}
          selected={category === searchCategory}
          style={{ marginLeft: index ? '1rem' : '0rem' }}
        >
          {convertEnumOrSentenceToTitle(searchCategory)}
        </SearchCategoryButton>
      ))}
    </div>
  )
}
