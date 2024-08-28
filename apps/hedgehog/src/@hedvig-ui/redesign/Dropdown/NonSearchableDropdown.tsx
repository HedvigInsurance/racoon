import * as React from 'react'
import { DropdownProps } from './Dropdown'
import { Select } from '@hedvig-ui/redesign'

export const NonSearchableDropdown = React.forwardRef<
  HTMLDivElement,
  DropdownProps
>((props, ref) => {
  const { options, label, value, ...rest } = props

  const selectedOption = options.find(
    (option) => option.value === value || option.selected,
  )

  const dropdownValue = selectedOption?.value ?? value

  return (
    <Select
      label={label}
      options={options}
      value={dropdownValue}
      {...rest}
      ref={ref}
    />
  )
})
