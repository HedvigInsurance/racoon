import styled from '@emotion/styled'
import { ThirdLevelHeadline } from '@hedvig-ui'
import { FilterDropdown } from './FilterDropdown'
import { FILTERS } from '../constants'

const FilterBarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem 1rem;
  box-shadow: 0 4px 2rem rgba(0, 0, 0, 0.2);

  button {
    > div {
      width: 100%;

      > div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 0.5rem;
      }
    }
  }
`

const Divider = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const Sidebar = () => {
  return (
    <FilterBarWrapper>
      <ThirdLevelHeadline>Filters</ThirdLevelHeadline>
      {Object.entries(FILTERS).map(([filterField, filter]) => (
        <FilterDropdown
          key={filterField}
          filterField={filterField as keyof typeof FILTERS}
          filter={filter}
        />
      ))}
      <Divider />
    </FilterBarWrapper>
  )
}
