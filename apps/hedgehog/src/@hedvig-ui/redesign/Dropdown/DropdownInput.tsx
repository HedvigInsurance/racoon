'use client'

import { useState } from 'react'
import { Dropdown, DropdownProps } from './Dropdown'
import { Option } from '../Select/Select.types'

type TDropdownInputOption = Pick<Option, 'value' | 'label'> &
  Partial<Pick<Option, 'action'>>

export const DropdownInput = (
  props: Omit<DropdownProps, 'options'> & {
    name: string
    options: TDropdownInputOption[]
    defaultValue?: string
  },
) => {
  const [value, setValue] = useState<string | undefined>(
    props.defaultValue ?? props.options[0]?.value,
  )

  const options = props.options.map((option) => ({
    ...option,
    selected: option.value === value,
    action: () => {
      setValue(option.value)
      option.action?.()
    },
  }))

  return (
    <>
      <Dropdown {...props} options={options} />
      <input name={props.name} type="hidden" value={value} readOnly />
    </>
  )
}
