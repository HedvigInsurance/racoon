'use client'

import { Dropdown, DropdownOption, Flex, Input } from '@hedvig-ui'
import { useState } from 'react'

export const SelectOrInput = ({
  value,
  options,
  onChange,
}: {
  value: string
  options: { name: string; value: string }[]
  onChange: (value: string) => void
}) => {
  const [isCustom, setIsCustom] = useState(false)
  return (
    <Flex gap="tiny">
      <Dropdown>
        <DropdownOption
          selected={isCustom}
          onClick={() => {
            setIsCustom(true)
            onChange('')
          }}
        >
          Custom
        </DropdownOption>
        {options.map(({ name, value: optionValue }) => (
          <DropdownOption
            selected={value === optionValue}
            onClick={() => {
              if (isCustom) {
                setIsCustom(false)
              }
              onChange(optionValue)
            }}
            key={name}
          >
            {name}
          </DropdownOption>
        ))}
      </Dropdown>
      {isCustom && (
        <>
          <br />
          <Input
            autoFocus
            placeholder="Enter custom value"
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      )}
    </Flex>
  )
}
