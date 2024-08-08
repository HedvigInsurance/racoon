'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import clsx from 'clsx'
import {
  forwardRef,
  useId,
  type MouseEventHandler,
  type ComponentProps,
  type ComponentPropsWithoutRef,
} from 'react'
import { Text } from 'ui'
import { RadioIndicatorIcon } from '@/features/priceCalculator/RadioIndicatorIcon'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { horizontalRadioGroup, card, item, paddedItem, radioButton } from './InputRadio.css'

type Option = { label: string; value: string; autoFocus?: boolean }

type InputRadioProps = {
  label: string
  options: Array<Option>
  displayLabel?: boolean
} & Omit<ComponentProps<typeof RadioGroup.Root>, 'children'>

export function InputRadio({
  displayLabel = true,
  orientation = 'horizontal',
  ...forwardedProps
}: InputRadioProps) {
  if (displayLabel) {
    return <LabelledInputRadio orientation={orientation} {...forwardedProps} />
  }

  return <UnlabelledInputRadio orientation={orientation} {...forwardedProps} />
}

function LabelledInputRadio({
  label,
  options,
  onValueChange,
  ...forwardedProps
}: Omit<InputRadioProps, 'displayLabel'>) {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()

  if (forwardedProps.orientation === 'vertical') {
    // TODO: add support for vertical orientation layout in the future
    // https://www.figma.com/design/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?node-id=15719-7413&t=0qSItK7IB6SKNJP3-4
    return null
  }

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
        {...forwardedProps}
        className={horizontalRadioGroup.withLabel}
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

function UnlabelledInputRadio({
  label,
  options,
  ...forwardedProps
}: Omit<InputRadioProps, 'displayLabel'>) {
  if (forwardedProps.orientation === 'vertical') {
    // TODO: add support for vertical orientation layout in the future
    // https://www.figma.com/design/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?node-id=15719-7413&t=0qSItK7IB6SKNJP3-4
    return null
  }
  return (
    <RadioGroup.Root
      {...forwardedProps}
      className={horizontalRadioGroup.withoutLabel}
      aria-label={label}
    >
      {options.map((option) => {
        return <HighlightableItem key={option.value} className={paddedItem} {...option} />
      })}
    </RadioGroup.Root>
  )
}

type ItemProps = {
  label: string
  value: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'value'>

const Item = forwardRef<HTMLLabelElement, ItemProps>(
  ({ value, label, className, ...itemProps }, ref) => {
    const identifier = useId()

    return (
      <label ref={ref} className={clsx(item, className)} htmlFor={identifier}>
        <RadioGroup.Item id={identifier} className={radioButton} value={value} {...itemProps}>
          <RadioGroup.Indicator forceMount={true} asChild={true}>
            <RadioIndicatorIcon />
          </RadioGroup.Indicator>
        </RadioGroup.Item>
        <Text as="span" size="xl">
          {label}
        </Text>
      </label>
    )
  },
)
Item.displayName = 'Item'

function HighlightableItem(props: ItemProps) {
  const { highlight, animationProps } = useHighlightAnimation<HTMLLabelElement>()

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    highlight()
    props.onClick?.(event)
  }

  return <Item {...props} {...animationProps} onClick={handleClick} />
}
