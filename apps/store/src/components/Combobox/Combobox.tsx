import styled from '@emotion/styled'
import { useCombobox } from 'downshift'
import { motion } from 'framer-motion'
import { Fragment, useDeferredValue, useMemo } from 'react'
import { ChevronIcon, CrossIconSmall, Text, theme, WarningTriangleIcon } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

const ITEMS_TO_SHOW = 5

type Props<Item> = {
  placeholder?: string
  defaultValue?: Item | null
  items: Array<Item>
  onSelect?: (item: Item | null) => void
  displayValue?: (item: Item) => string
  className?: string
  disabled?: boolean
  required?: boolean
}

/**
 * Combobox component
 * @see https://www.downshift-js.com/use-combobox
 */
export const Combobox = <Item,>(props: Props<Item>) => {
  const { defaultValue, onSelect, items, displayValue, ...inputProps } = props
  const { highlight, animationProps } = useHighlightAnimation()

  const {
    isOpen,
    inputValue,
    highlightedIndex,
    getInputProps,
    getMenuProps,
    getItemProps,
    getToggleButtonProps,
    reset,
    openMenu,
  } = useCombobox({
    items,
    initialSelectedItem: defaultValue,
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        highlight()
      }

      onSelect?.(selectedItem ?? null)
    },
    itemToString(item) {
      return item ? displayValue?.(item) ?? String(item) : ''
    },
  })

  const deferredInputValue = useDeferredValue(inputValue)
  const filteredItems = useMemo(() => {
    const lowerCaseInputValue = deferredInputValue.toLowerCase() ?? ''
    return items
      .filter((item) => {
        const stringValue = displayValue?.(item) ?? String(item)
        return stringValue.toLowerCase().includes(lowerCaseInputValue)
      })
      .slice(0, ITEMS_TO_SHOW)
  }, [deferredInputValue, items, displayValue])

  const noOptions = filteredItems.length === 0

  const handleClickDelete = () => {
    reset()
    openMenu()
  }

  return (
    <Wrapper data-expanded={isOpen}>
      <InputWrapper>
        <Input
          {...getInputProps()}
          {...animationProps}
          {...inputProps}
          defaultValue={defaultValue}
          data-expanded={isOpen}
          data-warning={noOptions}
        />
        <Actions>
          <DeleteButton onClick={handleClickDelete} hidden={inputValue.length === 0}>
            <CrossIconSmall />
          </DeleteButton>
          <ToggleButton {...getToggleButtonProps()} data-warning={noOptions}>
            <ChevronIcon size="1rem" />
          </ToggleButton>
        </Actions>
      </InputWrapper>

      <List {...getMenuProps()}>
        {isOpen &&
          filteredItems.map((item, index) => (
            <Fragment key={`${item}${index}`}>
              {index !== 0 && <Separator />}
              <ComboboxOption
                {...getItemProps({ item, index })}
                data-highlighted={highlightedIndex === index}
              >
                {displayValue?.(item) ?? String(item)}
              </ComboboxOption>
            </Fragment>
          ))}
      </List>
      {noOptions && (
        <WarningBox>
          <WarningTriangleIcon color={theme.colors.amberElement} size={theme.fontSizes.xs} />
          <SingleLineText as="p" size="xs">
            Vi kan inte hitta den här rasen, försök igen
          </SingleLineText>
        </WarningBox>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  isolation: 'isolate',
})

const InputWrapper = styled.div({
  position: 'relative',
})

const Input = styled(motion.input)({
  color: theme.colors.textPrimary,
  borderRadius: theme.radius.sm,
  width: '100%',
  height: '3rem',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.xxl,
  backgroundColor: theme.colors.opaque1,
  fontSize: theme.fontSizes.md,

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
})

export const ComboboxOption = styled.li({
  height: '3rem',
  fontSize: theme.fontSizes.md,
  display: 'flex',
  alignItems: 'center',
  paddingInline: theme.space.md,

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
