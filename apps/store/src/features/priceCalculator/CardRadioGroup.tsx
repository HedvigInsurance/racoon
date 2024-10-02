import * as RadioGroup from '@radix-ui/react-radio-group'
import {
  type RadioGroupIndicatorProps,
  type RadioGroupItemProps,
  type RadioGroupProps,
} from '@radix-ui/react-radio-group'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { framerTransitions, tokens, yStack } from 'ui'
import { RadioIndicatorIcon } from '@/features/priceCalculator/RadioIndicatorIcon'
import { item } from './CardRadioGroup.css'

export function Root({ children, className, ...forwardedProps }: RadioGroupProps) {
  return (
    <RadioGroup.Root className={clsx(yStack({ gap: 'xxs' }), className)} {...forwardedProps}>
      {children}
    </RadioGroup.Root>
  )
}

export function Item({
  children,
  className,
  value,
  isSelected,
  ...forwardedProps
}: RadioGroupItemProps & { isSelected?: boolean }) {
  const variants = {
    selected: {
      backgroundColor: tokens.colors.buttonPrimary,
    },
    unselected: {
      backgroundColor: tokens.colors.opaque1,
    },
  }
  return (
    <RadioGroup.Item value={value} {...forwardedProps} asChild>
      <motion.div
        className={clsx(item, className)}
        variants={variants}
        animate={isSelected ? 'selected' : 'unselected'}
        transition={{
          duration: framerTransitions.defaultDuration,
          ...framerTransitions.easeInOutCubic,
        }}
        initial={false}
      >
        {children}
      </motion.div>
    </RadioGroup.Item>
  )
}

export function Indicator({ forceMount = true, ...forwardedProps }: RadioGroupIndicatorProps) {
  return (
    <RadioGroup.Indicator forceMount={forceMount} {...forwardedProps} asChild={true}>
      <RadioIndicatorIcon />
    </RadioGroup.Indicator>
  )
}
