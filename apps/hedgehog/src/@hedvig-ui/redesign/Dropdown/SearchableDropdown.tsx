import * as React from 'react'
import { DropdownProps } from './Dropdown'
import { Combobox } from '../Combobox/Combobox'

export const SearchableDropdown = React.forwardRef<
  HTMLDivElement,
  DropdownProps
>((props, ref) => {
  const { options, label, value, ...rest } = props

  const selectedOption = options.find(
    (option) => option.value === value || option.selected,
  )

  const dropdownValue = selectedOption?.value ?? value

  return (
    <Combobox
      label={label}
      options={options}
      value={dropdownValue}
      {...rest}
      ref={ref}
    />
  )
})
