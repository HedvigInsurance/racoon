import * as RadioGroup from '@radix-ui/react-radio-group'
import {
  type RadioGroupIndicatorProps,
  type RadioGroupItemProps,
  type RadioGroupProps,
} from '@radix-ui/react-radio-group'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { tokens, yStack } from 'ui'
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
      scaleX: 1.05,
      backgroundColor: tokens.colors.buttonPrimary,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    unselected: {
      scaleX: 1,
      backgroundColor: tokens.colors.opaque1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  }
  return (
    <RadioGroup.Item value={value} {...forwardedProps} asChild>
      <motion.div
        className={clsx(item, className)}
        variants={variants}
        animate={isSelected ? 'selected' : 'unselected'}
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
