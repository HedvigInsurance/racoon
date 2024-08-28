import styled from '@emotion/styled'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  CircleFill,
  Circle,
} from 'react-bootstrap-icons'
import { Button, Flex, TextDatePicker } from '@hedvig-ui'
import { useEntrypoints } from '../hooks'
import { TFilter, TFilterKey } from '../types'
import { defaultDateFilter } from '../constants'

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  gap: 0.25rem;
`

const ClearButton = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.accent};
  background-color: transparent;
  :hover {
    background-color: ${({ theme }) => theme.accentLight};
  }
`

export const FilterDropdown = ({
  filterField,
  filter,
}: {
  filterField: TFilterKey
  filter: TFilter
}) => {
  const { appliedFilters, toggleFilterOption, clearDateFilter } =
    useEntrypoints()
  const [isOptionsVisible, setIsOptionsVisible] = useState(false)

  const getNumberOptionsSelected = () => {
    switch (filterField) {
      case 'createdAt':
        return undefined
      default:
        return appliedFilters[filterField]?.filter((filter) => !!filter).length
          ? appliedFilters[filterField]?.length
          : undefined
    }
  }

  const selectedFilterOptions =
    filterField !== 'createdAt' ? (appliedFilters[filterField] as string[]) : []

  const selectedFilterRange =
    filterField === 'createdAt' ? appliedFilters[filterField] : undefined

  const hasAppliedDateFilter =
    filterField === 'createdAt' &&
    !!selectedFilterRange &&
    (selectedFilterRange.min !== defaultDateFilter.min ||
      selectedFilterRange.max !== defaultDateFilter.max)

  return (
    <>
      <Button
        variant={
          isOptionsVisible ||
          !!getNumberOptionsSelected() ||
          hasAppliedDateFilter
            ? 'secondary'
            : 'tertiary'
        }
        onClick={() => setIsOptionsVisible((prev) => !prev)}
      >
        {isOptionsVisible ? <ChevronDown /> : <ChevronRight />}{' '}
        {filter.displayName}
        <span style={{ marginLeft: 'auto' }}>{getNumberOptionsSelected()}</span>
        {hasAppliedDateFilter && (
          <ClearButton
            onClick={(e) => {
              clearDateFilter(filterField)
              e.stopPropagation()
            }}
          >
            Clear
          </ClearButton>
        )}
      </Button>
      {isOptionsVisible && (
        <FilterOptions>
          {'options' in filter ? (
            filter.options.map(({ value, text }) => (
              <Button
                key={value}
                variant="tertiary"
                onClick={() => toggleFilterOption(filterField, value)}
              >
                {selectedFilterOptions?.includes(value) ? (
                  <CircleFill />
                ) : (
                  <Circle />
                )}
                {text}
              </Button>
            ))
          ) : (
            <Flex>
              <TextDatePicker
                label="From"
                value={selectedFilterRange?.min}
                onChange={(newDate) => {
                  toggleFilterOption(filterField, {
                    min: newDate ?? defaultDateFilter.min,
                    max: selectedFilterRange?.max ?? defaultDateFilter.max,
                  })
                }}
              />
              <TextDatePicker
                label="To"
                value={selectedFilterRange?.max}
                onChange={(newDate) => {
                  toggleFilterOption(filterField, {
                    min: selectedFilterRange?.min ?? defaultDateFilter.min,
                    max: newDate ?? defaultDateFilter.max,
                  })
                }}
              />
            </Flex>
          )}
        </FilterOptions>
      )}
    </>
  )
}
