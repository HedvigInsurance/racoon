import { forwardRef } from 'react'
import { InputWrapper } from '../../InputWrapper/InputWrapper'
import { ChevronDownIcon } from '@hedvig-ui/icons'
import { useSelect } from 'downshift'
import { Options, Option } from '../Options/Options'
import clsx from 'clsx'
import { toggleIndicator, toggleIndicatorOpen } from './SelectBase.css'
import { BaseSelectProps } from '../Select.types'

type Props<T extends boolean> = BaseSelectProps<T>

export const SelectBase = forwardRef(
  <IsMultiple extends boolean>(
    {
      label,
      options,
      selectedOption,
      hasValue,
      className,
      keepMenuOpenOnSelection,
      onChange,
      getIsSelected,
      renderValue,
      ...props
    }: Props<IsMultiple>,
    ref: Props<IsMultiple>['ref'],
  ) => {
    const {
      isOpen,
      selectedItem,
      highlightedIndex,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getItemProps,
    } = useSelect({
      items: options,
      selectedItem: selectedOption,
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges

        if (!keepMenuOpenOnSelection) {
          return changes
        }

        switch (type) {
          case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
          case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
          case useSelect.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // Keep menu open after selection.
              highlightedIndex: state.highlightedIndex,
            }
          default:
            return changes
        }
      },
      onSelectedItemChange: (selectedItem) => {
        onChange?.(selectedItem.selectedItem.value)
        selectedItem.selectedItem.action?.()
      },
    })

    return (
      <InputWrapper.Root
        isOpen={isOpen}
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
          as="button"
          type="button"
          withValue={hasValue}
          {...getToggleButtonProps()}
        >
          {label ? (
            <InputWrapper.Label
              as="label"
              raised={hasValue}
              {...getLabelProps()}
            >
              {label}
            </InputWrapper.Label>
          ) : null}

          <InputWrapper.Content>
            {hasValue ? (
              <>
                {selectedItem?.icon && selectedItem.icon}
                {renderValue ? (
                  <InputWrapper.Value>{renderValue()}</InputWrapper.Value>
                ) : null}
              </>
            ) : null}

            <InputWrapper.SideContent>
              <ChevronDownIcon
                className={clsx(toggleIndicator, {
                  [toggleIndicatorOpen]: isOpen,
                })}
              />
            </InputWrapper.SideContent>
          </InputWrapper.Content>
        </InputWrapper.Trigger>
        <Options isOpen={isOpen} {...getMenuProps()}>
          {isOpen
            ? options.map((option, index) => (
                <Option
                  key={option.value}
                  isSelected={getIsSelected(option)}
                  isHighlighted={highlightedIndex === index}
                  {...getItemProps({ item: option, index })}
                >
                  {option.label}
                </Option>
              ))
            : null}
        </Options>
      </InputWrapper.Root>
    )
  },
)
