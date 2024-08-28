import { ComponentPropsWithRef, ReactNode } from 'react'

import { InputWrapper } from '../InputWrapper/InputWrapper'

type RootProps = Omit<
  ComponentPropsWithRef<typeof InputWrapper.Root>,
  'onChange'
>

export type Option = {
  value: string
  label: string
  icon?: React.ReactNode
  selected?: boolean
  action?: () => void
}

export interface BaseSelectProps<IsMultiple extends boolean> extends RootProps {
  label?: string
  options: Option[]
  selectedOption: Option | null
  hasValue?: boolean
  keepMenuOpenOnSelection?: boolean
  value?: IsMultiple extends true ? string[] | null : string | null
  onChange?: (updatedValue: string) => void
  getIsSelected: (option: Option) => boolean
  renderValue?: () => ReactNode
}

export type WrapperSelect<IsMultiple extends boolean> = Omit<
  BaseSelectProps<IsMultiple>,
  'getIsSelected' | 'selectedOption' | 'renderValue' | 'onChange'
> & {
  onChange?: IsMultiple extends true
    ? (updatedValues: string[]) => void
    : (updatedValue: string) => void
}
