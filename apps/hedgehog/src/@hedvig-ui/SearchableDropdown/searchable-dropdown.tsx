import styled from '@emotion/styled'
import * as React from 'react'
import Select, { MenuPlacement } from 'react-select'
import CreatableSelect from 'react-select/creatable'

const Wrapper = styled.div`
  .searchable-type-select__control {
    border-radius: 7px;
    height: 44px;
    box-shadow: none;
    background-color: ${({ theme }) => theme.backgroundLight};
    border: 1px solid ${({ theme }) => theme.border};
    font-size: 1rem;
  }

  .searchable-type-select__input {
    color: ${({ theme }) => theme.foreground};
    padding-left: 0;
  }

  .searchable-type-select__menu {
    border-radius: 0;
    hyphens: auto;
    margin-top: 0;
    text-align: left;
    word-wrap: break-word;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
  }

  .searchable-type-select__option {
    &:hover {
      background: ${({ theme }) => theme.accentBackground};
    }
  }

  .searchable-type-select__value-container {
    padding-left: 16px;
    overflow: visible;
  }

  .searchable-type-select__multi-value__remove {
    display: none;
  }

  .searchable-type-select__single-value {
    color: ${({ theme }) => theme.foreground};
  }
`

export interface SelectOption {
  key?: string | number
  value: string | number
  label: string | number
  searchTerms?: string
}

interface CreatableSelectProps {
  formatCreateLabel: (value: React.ReactNode) => React.ReactNode
  onCreateOption: (option: string) => void
  value?: SelectOption | null
  placeholder?: string
  isLoading?: boolean
  isClearable?: boolean
  onChange: (option: SelectOption | null) => void
  noOptionsMessage?: () => string
  options: SelectOption[]
  style?: React.CSSProperties
  inputId?: string
}

export const CreatableDropdown: React.FC<CreatableSelectProps> = ({
  style,
  ...props
}) => {
  return (
    <Wrapper>
      <CreatableSelect
        {...props}
        styles={{
          container: (provided) => ({
            ...provided,
            ...style,
          }),
        }}
        classNamePrefix="searchable-type-select"
        isSearchable={true}
      />
    </Wrapper>
  )
}

export const SearchableDropdown: React.FC<
  Omit<
    CreatableSelectProps,
    'formatCreateLabel' | 'onCreateOption' | 'value'
  > & { value?: string | number | null; position?: MenuPlacement }
> = ({ position = 'bottom', style, value, options, ...props }) => {
  const selected = options.find((option) => option.value === value) ?? null
  return (
    <Wrapper>
      <Select
        menuPlacement={position}
        value={selected}
        options={options}
        {...props}
        classNamePrefix="searchable-type-select"
        isSearchable={true}
        styles={{
          container: (provided) => ({
            ...provided,
            ...style,
          }),
        }}
      />
    </Wrapper>
  )
}
