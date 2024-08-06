'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import clsx from 'clsx'
import {
  useId,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
} from 'react'
import { Text, xStack } from 'ui'
import { RadioIndicatorIcon } from '@/features/priceCalculator/RadioIndicatorIcon'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { card, option, item, horizontalRoot, horizontalItem } from './InputRadio.css'

type Option = { label: string; value: string; autoFocus?: boolean }

type RootProps = { label: string; options: Array<Option> } & Omit<
  ComponentProps<typeof RadioGroup.Root>,
  'children'
>

export function InputRadio({ label, options, orientation = 'horizontal', ...props }: RootProps) {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

  const handleValueChange = (value: string) => {
    highlight()
    props.onValueChange?.(value)
  }

  if (orientation === 'vertical') {
    // TODO: add support for vertical orientation layout
    return null
  }

  // TODO: this is horizontal layout with label. Horizontal layout without label
  // can be achieved by using HorizontalRoot at the moment, but in the future I'll
  // be merging both and deciding between them based on the present of the label prop.
  return (
    <div className={card} {...animationProps}>
      <Text as="span" size="xs" color="textSecondary">
        {label}
      </Text>
      <RadioGroup.Root
        {...props}
        className={xStack({ gap: 'md', alignItems: 'center' })}
        aria-label={label}
        onValueChange={handleValueChange}
      >
        {options.map((option) => {
          return <Item key={option.value} {...option} />
        })}
      </RadioGroup.Root>
    </div>
  )
}

type ItemProps = {
  label: string
  value: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'value'>

function Item({ value, label, className, ...itemProps }: ItemProps) {
  const identifier = useId()

  return (
    <label className={clsx(option, className)} htmlFor={identifier}>
      <RadioGroup.Item id={identifier} className={item} value={value} {...itemProps}>
        <RadioGroup.Indicator forceMount={true} asChild={true}>
          <RadioIndicatorIcon />
        </RadioGroup.Indicator>
      </RadioGroup.Item>
      <Text as="span" size="xl">
        {label}
      </Text>
    </label>
  )
}

export function HorizontalInputRadio({ label, options, ...rootProps }: RootProps) {
  return (
    <RadioGroup.Root className={horizontalRoot} aria-label={label} {...rootProps}>
      {options.map((option) => (
        <HorizontalItem key={option.value} {...option} />
      ))}
    </RadioGroup.Root>
  )
}

function HorizontalItem({ onClick, ...props }: ItemProps) {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    highlight()
    onClick?.(event)
  }

  return (
    <div className={horizontalItem} {...animationProps}>
      <Item {...props} onClick={handleClick} />
    </div>
  )
}
