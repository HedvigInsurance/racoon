import { useCombobox } from 'downshift'
import { Fragment, useState, useMemo, useDeferredValue } from 'react'
import { ChevronIcon, CrossIconSmall, Text, xStack, theme, WarningTriangleIcon } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import {
  wrapper,
  inputWrapper,
  inputBackground,
  input,
  actionsWrapper,
  toggleButton,
  deleteButton,
  separator,
  list,
  listItem,
} from './Combobox.css'

const ITEMS_TO_SHOW = 5

type Props<Item> = {
  items: Array<Item>
  selectedItem?: Item | null
  onSelectedItemChange?: (item: Item | null) => void
  defaultSelectedItem?: Item | null
  displayValue?: (item: Item) => string
  getFormValue?: (item: Item) => string | undefined
  noMatchesMessage?: string
  placeholder?: string
  name?: string
  disabled?: boolean
  required?: boolean
  mutliSelect?: boolean
  size?: 'large' | 'small'
}

/**
 * Combobox component
 * @see https://www.downshift-js.com/use-combobox
 */
export function Combobox<Item>({
  items,
  selectedItem,
  onSelectedItemChange,
  defaultSelectedItem,
  displayValue = (item) => String(item),
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  getFormValue = (item) => String(item) ?? undefined,
  mutliSelect = false,
  noMatchesMessage = 'No matches found',
  name,
  size = 'large',
  ...externalInputProps
}: Props<Item>) {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

  const [inputValue, setInputValue] = useState(() => {
    if (defaultSelectedItem) {
      return displayValue(defaultSelectedItem)
    }

    return ''
  })
  const deferredInputValue = useDeferredValue(inputValue)
  const filteredItems = useMemo(() => {
    return filterItems(items, deferredInputValue, displayValue)
  }, [deferredInputValue, items, displayValue])

  const noOptions = inputValue.trim().length > 0 && filteredItems.length === 0

  const {
    isOpen,
    highlightedIndex,
    getInputProps,
    getMenuProps,
    getItemProps,
    getToggleButtonProps,
    reset,
    openMenu,
    selectItem,
    selectedItem: internalSelectedItem,
  } = useCombobox({
    items: filteredItems,
    selectedItem,
    defaultSelectedItem,
    onSelectedItemChange({ selectedItem }) {
      onSelectedItemChange?.(selectedItem ?? null)

      if (selectedItem) {
        highlight()
      }
    },
    inputValue,
    onInputValueChange({ inputValue: internalInputValue, selectedItem }) {
      setInputValue(internalInputValue)

      // Set selectedItem to 'null' when clearing the input with delete/backspace
      // shorturl.at/f0158
      if (internalInputValue === '' && selectedItem) {
        selectItem(null)
      }
    },
    stateReducer(_, actionChanges) {
      const { type, changes } = actionChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
          if (filteredItems.length === 1) {
            return {
              ...changes,
              // Keep input clear in case 'multiSelect' mode is on
              inputValue: mutliSelect ? '' : displayValue(filteredItems[0]),
              // Select on [Enter] when only one item is available for selection
              selectedItem: filteredItems[0],
            }
          }
          return {
            ...changes,
            // Keep input clear in case 'multiSelect' mode is on
            inputValue: mutliSelect ? '' : changes.inputValue,
          }
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            // Keep input clear in case 'multiSelect' mode is on
            inputValue: mutliSelect ? '' : changes.inputValue,
          }
        default:
          return changes
      }
    },
    itemToString(item) {
      return item ? displayValue(item) : ''
    },
  })

  const handleClickDelete = () => {
    reset()
    // We need to reset the pieces of state that we control ourselfs
    setInputValue('')
    selectItem(null)
    openMenu()
  }

  const isExanded = isOpen && !noOptions

  return (
    <div data-expanded={isExanded} className={wrapper}>
      <div className={inputWrapper}>
        <div
          className={inputBackground}
          {...animationProps}
          data-expanded={isExanded}
          data-warning={noOptions}
        >
          <input className={input} {...getInputProps()} {...externalInputProps} data-size={size} />
        </div>
        {internalSelectedItem && (
          <input type="hidden" name={name} value={getFormValue(internalSelectedItem)} />
        )}
        <div className={actionsWrapper}>
          <button
            className={deleteButton}
            type="button"
            onClick={handleClickDelete}
            hidden={inputValue.length === 0}
          >
            <CrossIconSmall />
          </button>
          <button
            className={toggleButton}
            type="button"
            {...getToggleButtonProps()}
            data-warning={noOptions}
          >
            <ChevronIcon size="1rem" />
          </button>
        </div>
      </div>

      <ul className={list} {...getMenuProps()}>
        {isOpen &&
          filteredItems.map((item, index) => (
            <Fragment key={`${item}${index}`}>
              <hr className={separator} />
              <li
                className={listItem}
                {...getItemProps({ item, index })}
                data-highlighted={highlightedIndex === index}
                data-size={size}
              >
                {displayValue(item)}
              </li>
            </Fragment>
          ))}
      </ul>

      {noOptions && (
        <div
          className={xStack({
            alignItems: 'center',
            gap: 'xxs',
            paddingTop: 'xxs',
            paddingInline: 'xs',
          })}
        >
          <WarningTriangleIcon color={theme.colors.signalAmberElement} size={theme.fontSizes.xs} />
          <Text as="p" size="xs" singleLine={true}>
            {noMatchesMessage}
          </Text>
        </div>
      )}
    </div>
  )
}

function filterItems<Item>(
  items: Array<Item>,
  value: string,
  parseItemIntoString?: (item: Item) => string,
) {
  return items
    .filter((item) => {
      const itemStringValue = parseItemIntoString?.(item) ?? String(item)
      return itemStringValue.toLowerCase().includes(value.toLowerCase())
    })
    .slice(0, ITEMS_TO_SHOW)
}
