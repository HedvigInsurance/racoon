import clsx from 'clsx'
import { ComponentPropsWithRef, forwardRef } from 'react'
import {
  option,
  optionHighlighted,
  options,
  optionsOpen,
  selectionIcon,
} from './Options.css'
import { TickIcon } from '@hedvig-ui/icons'

interface OptionsProps extends ComponentPropsWithRef<'ul'> {
  isOpen?: boolean
}

export const Options = forwardRef(
  (
    { isOpen, className, children, ...props }: OptionsProps,
    ref: OptionsProps['ref'],
  ) => {
    return (
      <ul
        className={clsx(className, options, {
          [optionsOpen]: isOpen,
        })}
        {...props}
        ref={ref}
      >
        {children}
      </ul>
    )
  },
)

interface OptionProps extends ComponentPropsWithRef<'li'> {
  isSelected?: boolean
  isHighlighted?: boolean
}

export const Option = forwardRef(
  (
    { isHighlighted, isSelected, className, children, ...props }: OptionProps,
    ref: OptionProps['ref'],
  ) => {
    return (
      <li
        className={clsx(className, option, {
          [optionHighlighted]: isHighlighted,
        })}
        {...props}
        ref={ref}
      >
        {children}
        {isSelected && <TickIcon className={selectionIcon} />}
      </li>
    )
  },
)
