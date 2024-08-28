import {
  Checkbox,
  convertEnumOrSentenceToTitle,
  Flex as FlexStyled,
  Label,
  NavigationAbsolute,
} from '@hedvig-ui'
import {
  FilterElement,
  FilterWrapper,
} from '@hope/features/claims/claims-list/filters/ClaimListFilters'
import {
  ClaimState,
  Market,
  MarketFlags,
} from '@hope/features/config/constants'
import { ClaimsFiltersType } from '@hope/pages/claims/list/ClaimsListPage'
import * as React from 'react'
import styled from '@emotion/styled'

const Flex = styled(FlexStyled)`
  position: relative;
`

const Navigation = styled(NavigationAbsolute)`
  left: -0.25rem;
  top: -0.25rem;

  width: calc(fit-content + 0.5rem);
  height: calc(100% + 0.5rem);
`

interface ClaimTemplateFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  templateId?: string
  template: ClaimsFiltersType
  editTemplate: (newFilter: ClaimsFiltersType, id?: string) => void
}

export const ClaimTemplateFilters: React.FC<ClaimTemplateFiltersProps> = ({
  template,
  editTemplate,
  templateId,
  ...props
}) => {
  const filterExists = (
    state: string | number,
    field: keyof ClaimsFiltersType,
  ) => {
    if (!template) {
      return false
    }

    const value = template[field]

    if (!value) {
      return false
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return true
    }

    return value.some((filterState) => filterState === state)
  }

  const setFilterHandler = (
    state: string | number,
    field: keyof ClaimsFiltersType,
  ) => {
    const value = template[field]

    if (filterExists(state, field)) {
      if (!Array.isArray(value)) {
        return
      }

      editTemplate(
        {
          ...template,
          [field]: (value as unknown[]).filter((st) => st !== state),
        },
        templateId,
      )

      return
    }

    if (!Array.isArray(value)) {
      editTemplate(
        {
          ...template,
          [field]: value ? [value, state] : [state],
        },
        templateId,
      )

      return
    }

    editTemplate(
      {
        ...template,
        [field]: value ? [...value, state] : [state],
      },
      templateId,
    )
  }

  return (
    <FilterWrapper {...props}>
      <FilterElement>
        <Label>States</Label>
        {Object.values(ClaimState).map((state, index) => (
          <Flex key={state} direction="row" align="center">
            <Checkbox
              label={convertEnumOrSentenceToTitle(state)}
              checked={filterExists(state, 'filterClaimStates')}
              onChange={() => setFilterHandler(state, 'filterClaimStates')}
            />
            <Navigation
              name={`state-${index}`}
              options={{
                resolve: () => {
                  setFilterHandler(state, 'filterClaimStates')
                },
                neighbors: {
                  up:
                    index === 0 ? 'create-filter-input' : `state-${index - 1}`,
                  right: 'Member Groups 0',
                  down:
                    index === Object.values(ClaimState).length - 1
                      ? 'market-0'
                      : `state-${index + 1}`,
                },
              }}
            />
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.values(Market).map((market, index) => (
          <Flex key={market} direction="row" align="center">
            <Checkbox
              label={convertEnumOrSentenceToTitle(market)}
              checked={filterExists(market, 'filterMarkets')}
              onChange={() => setFilterHandler(market, 'filterMarkets')}
            />
            <span style={{ marginLeft: '0.5rem' }}>{MarketFlags[market]}</span>
            <Navigation
              name={`market-${index}`}
              options={{
                resolve: () => {
                  setFilterHandler(market, 'filterMarkets')
                },
                neighbors: {
                  up:
                    index === 0
                      ? `state-${Object.values(ClaimState).length - 1}`
                      : `market-${index - 1}`,
                  down:
                    index === Object.values(Market).length - 1
                      ? 'create-filter-btn'
                      : `market-${index + 1}`,
                },
              }}
            />
          </Flex>
        ))}
      </FilterElement>
    </FilterWrapper>
  )
}
