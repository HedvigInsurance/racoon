'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import clsx from 'clsx'
import { type ComponentPropsWithoutRef, type MouseEventHandler } from 'react'
import { Text, xStack } from 'ui'
import { RadioIndicatorIcon } from '@/features/priceCalculator/RadioIndicatorIcon'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { card, option, item, horizontalRoot, horizontalItem } from './InputRadio.css'

type RootProps = {
  label: string
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  required?: boolean
  defaultValue?: string
  name?: string
}

export const Root = ({ children, label, onValueChange, ...props }: RootProps) => {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

  const handleValueChange = (value: string) => {
    highlight()
    onValueChange?.(value)
  }

  return (
    <div className={card} {...animationProps}>
      <Text as="span" size="xs" color="textSecondary">
        {label}
      </Text>
      <RadioGroup.Root
        className={xStack({ gap: 'md', alignItems: 'center' })}
        onValueChange={handleValueChange}
        aria-label={label}
        {...props}
      >
        {children}
      </RadioGroup.Root>
    </div>
  )
}

type ItemProps = {
  label: string
  value: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'value'>

export const Item = ({ value, label, id, className, ...itemProps }: ItemProps) => {
  const identifier = id ?? `radio-${value}`

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

export const HorizontalRoot = ({ label, children, ...rootProps }: RootProps) => {
  return (
    <RadioGroup.Root className={horizontalRoot} aria-label={label} {...rootProps}>
      {children}
    </RadioGroup.Root>
  )
}

export const HorizontalItem = ({ onClick, ...props }: ItemProps) => {
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
