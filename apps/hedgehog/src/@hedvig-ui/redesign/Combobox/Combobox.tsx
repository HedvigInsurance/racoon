'use client'

import { forwardRef, useState } from 'react'
import { ComboboxBase } from './ComboboxBase'
import { Option, WrapperSelect } from '../Select/Select.types'

type Props = WrapperSelect<false>

export const Combobox = forwardRef(
  (
    { label, options, value, className, ...props }: Props,
    ref: Props['ref'],
  ) => {
    const getIsSelected = (option: Option) =>
      option.value === value || !!option.selected

    const [selectedOption, setSelectedOption] = useState(
      () => options.find(getIsSelected) || null,
    )

    const handleSelection = (selectedValue: string) => {
      const newSelectedOption = options.find(
        (option) => option.value === selectedValue,
      )

      setSelectedOption(newSelectedOption || null)
    }

    const hasValue = !!selectedOption

    return (
      <ComboboxBase
        label={label}
        options={options}
        selectedOption={selectedOption}
        onChange={handleSelection}
        hasValue={hasValue}
        getIsSelected={getIsSelected}
        {...props}
        ref={ref}
      />
    )
  },
)
