import * as RadioGroup from '@radix-ui/react-radio-group'
import {
  type RadioGroupIndicatorProps,
  type RadioGroupItemProps,
  type RadioGroupProps,
} from '@radix-ui/react-radio-group'
import { clsx } from 'clsx'
import { yStack } from 'ui'
import { RadioIndicatorIcon } from '@/features/priceCalculator/RadioIndicatorIcon'
import { indicator, indicatorBorderColor, indicatorInnerColor, item } from './CardRadioGroup.css'

export function Root({ children, className, ...forwardedProps }: RadioGroupProps) {
  return (
    <RadioGroup.Root className={clsx(yStack({ gap: 'xxs' }), className)} {...forwardedProps}>
      {children}
    </RadioGroup.Root>
  )
}

export function Item({ children, className, value, ...forwardedProps }: RadioGroupItemProps) {
  return (
    <RadioGroup.Item value={value} {...forwardedProps} asChild>
      <div className={clsx(item, className)}>{children}</div>
    </RadioGroup.Item>
  )
}

export function Indicator({
  className,
  forceMount = true,
  ...forwardedProps
}: RadioGroupIndicatorProps) {
  return (
    <RadioGroup.Indicator
      className={clsx(className, indicator)}
      forceMount={forceMount}
      {...forwardedProps}
    >
      <RadioIndicatorIcon borderColor={indicatorBorderColor} innerColor={indicatorInnerColor} />
    </RadioGroup.Indicator>
  )
}
