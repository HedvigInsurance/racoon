import styled from '@emotion/styled'
import { useCombobox } from 'downshift'
import { motion } from 'framer-motion'
import { Fragment, useState, useMemo, useDeferredValue } from 'react'
import { ChevronIcon, CrossIconSmall, Text, theme, WarningTriangleIcon } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { zIndexes } from '@/utils/zIndex'

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
export const Combobox = <Item,>({
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
}: Props<Item>) => {
  const { highlight, animationProps } = useHighlightAnimation()

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
      setInputValue(internalInputValue ?? '')

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
    <Wrapper data-expanded={isExanded}>
      <InputWrapper>
        <Input
          {...getInputProps()}
          {...animationProps}
          {...externalInputProps}
          data-expanded={isExanded}
          data-warning={noOptions}
          data-size={size}
        />
        {internalSelectedItem && (
          <input type="hidden" name={name} value={getFormValue(internalSelectedItem)} />
        )}
        <Actions>
          <DeleteButton type="button" onClick={handleClickDelete} hidden={inputValue.length === 0}>
            <CrossIconSmall />
          </DeleteButton>
          <ToggleButton type="button" {...getToggleButtonProps()} data-warning={noOptions}>
            <ChevronIcon size="1rem" />
          </ToggleButton>
        </Actions>
      </InputWrapper>

      <List {...getMenuProps()}>
        {isOpen &&
          filteredItems.map((item, index) => (
            <Fragment key={`${item}${index}`}>
              <Separator />
              <ComboboxOption
                {...getItemProps({ item, index })}
                data-highlighted={highlightedIndex === index}
                data-size={size}
              >
                {displayValue(item)}
              </ComboboxOption>
            </Fragment>
          ))}
      </List>

      {noOptions && (
        <WarningBox>
          <WarningTriangleIcon color={theme.colors.amberElement} size={theme.fontSizes.xs} />
          <SingleLineText as="p" size="xs">
            {noMatchesMessage}
          </SingleLineText>
        </WarningBox>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  isolation: 'isolate',

  '&[data-expanded=true]': {
    zIndex: zIndexes.header,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
    borderTopLeftRadius: theme.radius.sm,
    borderTopRightRadius: theme.radius.sm,
  },
})

const InputWrapper = styled.div({
  position: 'relative',
})

const Input = styled(motion.input)({
  color: theme.colors.textPrimary,
  borderRadius: theme.radius.sm,
  width: '100%',
  height: '2.5rem',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.xxl,
  backgroundColor: theme.colors.opaque1,
  fontSize: theme.fontSizes.lg,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  '&[data-size=large]': {
    height: '3rem',
    fontSize: theme.fontSizes.xl,
  },

  '&[data-expanded=true]': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  '&[data-warning=true]': {
    borderBottomLeftRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
  },
})

const Actions = styled.div({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  transform: 'translateY(-50%)',
  display: 'flex',
  gap: theme.space.xs,
  alignItems: 'center',
})

const ToggleButton = styled.button({
  cursor: 'pointer',

  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',

  ['&[aria-expanded=true]']: {
    transform: 'rotate(180deg)',
  },

  ['&[data-warning=true]']: {
    transform: 'rotate(0)',
  },
})

const DeleteButton = styled.button({
  cursor: 'pointer',
})

const Separator = styled.hr({
  height: 1,
  backgroundColor: theme.colors.opaque2,
  marginInline: theme.space.md,
})

const List = styled.ul({
  backgroundColor: theme.colors.opaque1,
  borderBottomLeftRadius: theme.radius.sm,
  borderBottomRightRadius: theme.radius.sm,

  position: 'absolute',
  width: '100%',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
})

export const ComboboxOption = styled.li({
  minHeight: '2.5rem',
  fontSize: theme.fontSizes.lg,
  display: 'flex',
  alignItems: 'center',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xs,

  '&[data-size=large]': {
    minHeight: '3rem',
    fontSize: theme.fontSizes.xl,
  },

  '&[data-highlighted=true]': {
    backgroundColor: theme.colors.gray200,
  },

  '&:hover': {
    backgroundColor: theme.colors.gray300,
  },

  '&:last-of-type': {
    borderBottomLeftRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
  },
})

const WarningBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.space.xxs,
  paddingInline: theme.space.xs,
  gap: theme.space.xxs,
})

const SingleLineText = styled(Text)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const filterItems = <Item,>(
  items: Array<Item>,
  value: string,
  parseItemIntoString?: (item: Item) => string,
) => {
  return items
    .filter((item) => {
      const itemStringValue = parseItemIntoString?.(item) ?? String(item)
      return itemStringValue.toLowerCase().includes(value.toLowerCase())
    })
    .slice(0, ITEMS_TO_SHOW)
}
