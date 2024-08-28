import { DetailedHTMLProps, DetailsHTMLAttributes, useState } from 'react'
import { Dropdown, DropdownOption, Label } from '@hedvig-ui'

export const useDropdown = ({
  label,
  options,
}: {
  label?: string
  options: { text: string; value: string }[]
}) => {
  const [value, setValue] = useState(options[0].value)

  return {
    value,
    component: ({
      style,
    }: DetailedHTMLProps<DetailsHTMLAttributes<HTMLElement>, HTMLElement>) => (
      <div style={style}>
        {label && <Label>{label}</Label>}
        <Dropdown>
          {options.map((option) => (
            <DropdownOption
              key={option.value}
              onClick={() => setValue(option.value)}
              selected={value === option.value}
            >
              {option.text}
            </DropdownOption>
          ))}
        </Dropdown>
      </div>
    ),
  }
}
