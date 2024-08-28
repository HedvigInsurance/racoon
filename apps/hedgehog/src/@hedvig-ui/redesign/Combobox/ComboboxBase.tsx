import { useCombobox } from 'downshift'
import { forwardRef, useState } from 'react'
import { InputWrapper } from '../InputWrapper/InputWrapper'
import { ChevronDownIcon } from '@hedvig-ui/icons/components/ChevronDownIcon'
import clsx from 'clsx'
import { Options, Option } from '../Select/Options/Options'
import type {
  BaseSelectProps,
  Option as OptionType,
} from '../Select/Select.types'
import {
  toggleIndicator,
  toggleIndicatorOpen,
} from '../Select/SelectBase/SelectBase.css'
import { Flex } from '@hedvig-ui/Flex/flex'
import { action, sideContent } from './Combobox.css'
import { XIcon } from '@hedvig-ui/icons'
import { useIsFocused } from '../hooks/useIsFocused'
import { Button } from '../Button/Button'

type Props<T extends boolean> = BaseSelectProps<T>

const filterOptions = (options: OptionType[], searchTerm: string = '') => {
  return options.filter(
    (option) =>
      option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

export const ComboboxBase = forwardRef(
  <IsMultiple extends boolean>(
    {
      options,
      selectedOption,
      hasValue,
      label,
      disabled,
      renderValue,
      getIsSelected,
      onChange,
      ...props
    }: Props<IsMultiple>,
    ref: Props<IsMultiple>['ref'],
  ) => {
    const [isInputFocused, inputRef] = useIsFocused<HTMLInputElement>()
    const [filteredOptions, setFilteredOptions] = useState(options)

    const {
      isOpen,
      highlightedIndex,
      selectedItem,
      inputValue,
      getToggleButtonProps,
      getMenuProps,
      getInputProps,
      getItemProps,
      selectItem,
    } = useCombobox({
      onInputValueChange({ inputValue }) {
        setFilteredOptions(filterOptions(options, inputValue))
      },
      items: filteredOptions,
      selectedItem: selectedOption,
      onSelectedItemChange: (newSelectedItem) => {
        // Only trigger on actual value change
        if (newSelectedItem.selectedItem?.value !== selectedItem?.value) {
          onChange?.(newSelectedItem.selectedItem?.value)
          newSelectedItem.selectedItem?.action?.()
        }
      },
      onIsOpenChange: () => {
        // Reset the options list
        setFilteredOptions(options)
      },
      itemToString(item) {
        return item ? item.label : ''
      },
    })

    const hasInputValue = hasValue || !!inputValue

    return (
      <InputWrapper.Root
        isOpen={isOpen}
        disabled={disabled}
        {...props}
        ref={ref}
        onKeyDown={(event) => {
          // Prevent closing modals on Escape
          if (event.key === 'Escape' && isOpen) {
            event.stopPropagation()
          }
        }}
      >
        <InputWrapper.Trigger
          as="label"
          withValue={hasInputValue || isInputFocused}
        >
          {label ? (
            <InputWrapper.Label raised={hasInputValue || isInputFocused}>
              {label}
            </InputWrapper.Label>
          ) : null}

          <InputWrapper.Content>
            <InputWrapper.Input
              {...getInputProps({
                ref: inputRef,
              })}
            />
            <InputWrapper.SideContent className={sideContent}>
              <Flex align="center">
                {hasInputValue && !disabled ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className={action}
                    onClick={() => selectItem(null)}
                  >
                    <XIcon />
                  </Button>
                ) : null}

                <Button
                  type="button"
                  variant="ghost"
                  className={clsx(toggleIndicator, action, {
                    [toggleIndicatorOpen]: isOpen,
                  })}
                  {...getToggleButtonProps()}
                >
                  <ChevronDownIcon />
                </Button>
              </Flex>
            </InputWrapper.SideContent>
          </InputWrapper.Content>
        </InputWrapper.Trigger>

        <Options isOpen={isOpen} {...getMenuProps()}>
          {isOpen
            ? filteredOptions.map((option, index) => {
                return (
                  <Option
                    key={option.value}
                    isSelected={selectedItem?.value === option.value}
                    isHighlighted={highlightedIndex === index}
                    {...getItemProps({ item: option, index })}
                  >
                    {option.label}
                  </Option>
                )
              })
            : null}
        </Options>
      </InputWrapper.Root>
    )
  },
)
