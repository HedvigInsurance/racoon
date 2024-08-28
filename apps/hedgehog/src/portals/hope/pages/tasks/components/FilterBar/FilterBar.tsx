import { ComponentProps } from 'react'
import { css } from './FilterBar.css'
import { Button, Flex, InfoTag, LegacyTooltip } from '@hedvig-ui/redesign'

export function FilterBar(props: ComponentProps<'div'>) {
  return <div {...props} className={css.FilterBar} />
}

function FilterItem(
  props: ComponentProps<'button'> & {
    text: string | JSX.Element
    count: number
    popoverContent?: string
    selected?: boolean
    partiallySelected?: boolean
  },
) {
  const variant = getFilterItemVariant(
    props.partiallySelected ?? false,
    props.selected ?? false,
  )

  const item = (
    <Button {...props} variant={variant}>
      <Flex gap="sm" align="center">
        {props.text}
        <InfoTag variant="neutral">{props.count}</InfoTag>
      </Flex>
    </Button>
  )

  if (props.popoverContent) {
    return <LegacyTooltip content={props.popoverContent}>{item}</LegacyTooltip>
  }
  return item
}

function getFilterItemVariant(
  partiallySelected: boolean,
  selected: boolean,
): 'secondary' | 'primary-alt' | 'secondary-alt' {
  if (partiallySelected) {
    return 'secondary'
  }
  if (selected) {
    return 'primary-alt'
  }
  return 'secondary-alt'
}

FilterBar.Item = FilterItem
