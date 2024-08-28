import { forwardRef } from 'react'

import { SelectBase } from './SelectBase/SelectBase'
import { SelectedTags } from './SelectedTags/SelectedTags'
import { Option, WrapperSelect } from './Select.types'

type Props = WrapperSelect<true>

export const MultiSelect = forwardRef(
  (
    { label, options, value, onChange, className, ...props }: Props,
    ref: Props['ref'],
  ) => {
    const getIsSelected = (option: Option) =>
      value?.includes(option.value) || !!option.selected

    const hasValue = !!value?.length

    const renderValue = () => {
      if (!hasValue) {
        return null
      }

      return (
        <SelectedTags
          value={value}
          options={options}
          onTagClicked={handleChange}
          mt="lg"
        />
      )
    }

    const handleChange = (selectedOption: string) => {
      const selectedOptionsSet = new Set(value || [])

      if (selectedOptionsSet.has(selectedOption)) {
        selectedOptionsSet.delete(selectedOption)
      } else {
        selectedOptionsSet.add(selectedOption)
      }

      onChange?.(Array.from(selectedOptionsSet))
    }

    return (
      <SelectBase
        label={label}
        options={options}
        selectedOption={null}
        getIsSelected={getIsSelected}
        hasValue={hasValue}
        renderValue={renderValue}
        onChange={handleChange}
        keepMenuOpenOnSelection
        {...props}
        ref={ref}
      />
    )
  },
)
