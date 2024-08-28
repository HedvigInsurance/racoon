import { forwardRef } from 'react'

import { SelectBase } from './SelectBase/SelectBase'
import { Option, WrapperSelect } from './Select.types'

type Props = WrapperSelect<false>

export const Select = forwardRef(
  (
    { label, options, value, className, ...props }: Props,
    ref: Props['ref'],
  ) => {
    const getIsSelected = (option: Option) =>
      option.value === value || !!option.selected

    const selectedOption = options.find(getIsSelected) || null
    const hasValue = !!selectedOption

    const renderValue = () => selectedOption?.label

    return (
      <SelectBase
        label={label}
        options={options}
        selectedOption={selectedOption}
        hasValue={hasValue}
        renderValue={renderValue}
        getIsSelected={getIsSelected}
        {...props}
        ref={ref}
      />
    )
  },
)
